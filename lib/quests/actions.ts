"use server";

/**
 * Server Action: закрыть ежедневный квест.
 *
 * MVP-петля:
 *   1. валидируем юзера и id квеста,
 *   2. вставляем строку в `daily_quest_completions` (UNIQUE по
 *      user_id+quest_id+completed_on защищает от двойного начисления),
 *   3. начисляем XP через общий `awardXp` (на размере из каталога),
 *   4. ревалидируем экраны, которые показывают XP/уровень/аватар.
 *
 * Намеренно НЕ:
 *   - не ведём историю «когда нажал» отдельно от completed_on,
 *   - не считаем стрики (другой helper, когда понадобится),
 *   - не складываем коины (экономики пока нет).
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  awardXp,
  getAvatarEvolutionForLevel,
  touchStreak,
  type AwardXpResult,
  type StreakUpdate,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  buildCompanionFeedback,
  type CompanionFeedback,
} from "@/lib/workouts/companion-feedback";
import { findDailyQuest, selectDailyQuestIds } from "./daily-quests";
import { todayISO } from "./get-today-completions";

export type CompleteDailyQuestResponse = {
  data:
    | (AwardXpResult & {
        questId: string;
        questTitle: string;
        /** true, если квест уже был закрыт сегодня и XP не начислялся повторно. */
        alreadyCompleted: boolean;
        /**
         * Снимок стрика после действия. null, если touchStreak упал —
         * UI просто не показывает обновление серии. Также null в ветке
         * `alreadyCompleted`, где стрик уже был учтён ранее сегодня.
         */
        streak: StreakUpdate | null;
        companion: CompanionFeedback;
      })
    | null;
  error: string | null;
};

export async function completeDailyQuestAction(
  questId: string,
): Promise<CompleteDailyQuestResponse> {
  const quest = findDailyQuest(questId);
  if (!quest) {
    return { data: null, error: "Контракт не найден." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: "Не авторизован." };
  }

  const supabase = await createSupabaseServerClient();
  const today = todayISO();

  // D017: квест можно заявить, только если он в сегодняшней подборке.
  // Подборка — детерминированная чистая функция от (userId, дата),
  // поэтому сервер пересчитывает её сам и не доверяет клиенту.
  // Проверка стоит ДО любого чтения/записи в БД.
  const selectedIds = selectDailyQuestIds(user.id, today);
  if (!selectedIds.includes(quest.id)) {
    return { data: null, error: "Этот контракт сегодня не активен." };
  }

  // Снимок XP до INSERT: сохраняется в записи о завершении. В ветке 23505
  // позволяет определить, был ли XP начислен при первой попытке, и
  // восстановить его, если нет. См. логику восстановления ниже.
  const { data: preProfile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .maybeSingle();
  const xpBefore = Number(preProfile?.xp ?? 0);

  const { error: insertError } = await supabase
    .from("daily_quest_completions")
    .insert({
      user_id: user.id,
      quest_id: quest.id,
      completed_on: today,
      xp_awarded: quest.rewards.xp,
      xp_before: xpBefore,
    });

  // 23505 = unique_violation → квест уже закрыт сегодня. Это нормально:
  // не считаем за ошибку, не начисляем XP повторно, отдаём текущее состояние
  // профиля, чтобы UI ровно перешёл в reward_claimed.
  if (insertError && insertError.code !== "23505") {
    console.error("[completeDailyQuestAction] insert", insertError);
    return { data: null, error: "Не удалось закрыть контракт." };
  }

  if (insertError && insertError.code === "23505") {
    // Запись о завершении уже существует. Проверяем, был ли XP начислен
    // при первой попытке: сравниваем текущий xp профиля с xp_before +
    // xp_awarded из существующей записи. Если XP не был начислен —
    // восстанавливаем его здесь же, не требуя повторного действия от юзера.
    const { data: existingRow } = await supabase
      .from("daily_quest_completions")
      .select("xp_before")
      .eq("user_id", user.id)
      .eq("quest_id", quest.id)
      .eq("completed_on", today)
      .maybeSingle();

    const snapshot = await readProgressionSnapshot(supabase, user.id);
    if (!snapshot) {
      return { data: null, error: "Не удалось прочитать профиль." };
    }

    const recordXpBefore = Number(existingRow?.xp_before ?? 0);
    const xpWasApplied = snapshot.totalXp >= recordXpBefore + quest.rewards.xp;

    if (xpWasApplied) {
      // XP was applied on the first attempt, but touchStreak may have failed then.
      // Call it now — it is idempotent: already-counted today returns a no-op.
      const streakRes = await touchStreak(supabase, user.id);
      if (streakRes.error) {
        console.error("[completeDailyQuestAction] retry touchStreak", streakRes.error);
      }
      return {
        data: {
          ...snapshot,
          questId: quest.id,
          questTitle: quest.title,
          alreadyCompleted: true,
          streak: streakRes.data,
          companion: buildCompanionFeedback({ leveledUp: false, evolved: false }),
        },
        error: null,
      };
    }

    // XP не был начислен при первой попытке — восстанавливаем.
    console.warn("[completeDailyQuestAction] recovering XP after prior awardXp failure");
    const { data: recoveredData, error: recoveredError } = await awardXp(
      supabase,
      user.id,
      { amount: quest.rewards.xp, reason: `daily_quest:${quest.id}` },
    );

    if (recoveredError || !recoveredData) {
      console.error("[completeDailyQuestAction] recovery awardXp", recoveredError);
      return { data: null, error: "Не удалось начислить XP." };
    }

    const recoveredStreakRes = await touchStreak(supabase, user.id);
    if (recoveredStreakRes.error) {
      console.error("[completeDailyQuestAction] recovery touchStreak", recoveredStreakRes.error);
    }

    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/avatar");
    revalidatePath("/quests");

    return {
      data: {
        ...recoveredData,
        questId: quest.id,
        questTitle: quest.title,
        alreadyCompleted: false,
        streak: recoveredStreakRes.data,
        companion: buildCompanionFeedback({
          leveledUp: recoveredData.leveledUp,
          evolved: recoveredData.evolved,
          streak: recoveredStreakRes.data ?? undefined,
        }),
      },
      error: null,
    };
  }

  const { data, error } = await awardXp(supabase, user.id, {
    amount: quest.rewards.xp,
    reason: `daily_quest:${quest.id}`,
  });

  if (error || !data) {
    console.error("[completeDailyQuestAction] awardXp", error);
    return { data: null, error: "Не удалось начислить XP." };
  }

  // Закрытие квеста — такое же «зачётное» действие, как и тренировка.
  // Падение стрика не валит начисление XP: ошибку логируем, в ответе
  // отдадим streak: null и UI не покажет обновление серии.
  const streakRes = await touchStreak(supabase, user.id);
  if (streakRes.error) {
    console.error("[completeDailyQuestAction] touchStreak", streakRes.error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/avatar");
  revalidatePath("/quests");

  return {
    data: {
      ...data,
      questId: quest.id,
      questTitle: quest.title,
      alreadyCompleted: false,
      streak: streakRes.data,
      companion: buildCompanionFeedback({
        leveledUp: data.leveledUp,
        evolved: data.evolved,
        streak: streakRes.data ?? undefined,
      }),
    },
    error: null,
  };
}

/**
 * Снимок XP/уровня без начисления — нужен только для пути «уже закрыт сегодня»,
 * чтобы клиент мог показать тот же результат, что увидел бы при первом нажатии.
 */
async function readProgressionSnapshot(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<AwardXpResult | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("xp, level")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const level = Number(data.level ?? 1);
  return {
    xpGained: 0,
    totalXp: Number(data.xp ?? 0),
    previousLevel: level,
    newLevel: level,
    leveledUp: false,
    evolved: false,
    evolution: getAvatarEvolutionForLevel(level),
  };
}
