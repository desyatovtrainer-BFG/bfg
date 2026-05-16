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
import { findDailyQuest } from "./daily-quests";
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

  const { error: insertError } = await supabase
    .from("daily_quest_completions")
    .insert({
      user_id: user.id,
      quest_id: quest.id,
      completed_on: today,
      xp_awarded: quest.rewards.xp,
    });

  // 23505 = unique_violation → квест уже закрыт сегодня. Это нормально:
  // не считаем за ошибку, не начисляем XP повторно, отдаём текущее состояние
  // профиля, чтобы UI ровно перешёл в reward_claimed.
  if (insertError && insertError.code !== "23505") {
    console.error("[completeDailyQuestAction] insert", insertError);
    return { data: null, error: insertError.message };
  }

  if (insertError && insertError.code === "23505") {
    const snapshot = await readProgressionSnapshot(supabase, user.id);
    return {
      data: snapshot
        ? {
            ...snapshot,
            questId: quest.id,
            questTitle: quest.title,
            alreadyCompleted: true,
            // Стрик за сегодня уже был зачтён первым успешным действием —
            // повторно трогать БД не нужно. UI показывает текущее значение
            // из `profiles` (через DashboardPage / прогресс-экран).
            streak: null,
          }
        : null,
      error: snapshot ? null : "Не удалось прочитать профиль.",
    };
  }

  const { data, error } = await awardXp(supabase, user.id, {
    amount: quest.rewards.xp,
    reason: `daily_quest:${quest.id}`,
  });

  if (error || !data) {
    return { data: null, error: error ?? "Не удалось начислить XP." };
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
