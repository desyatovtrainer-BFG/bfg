"use server";

/**
 * Server Action: завершение тренировки.
 *
 * MVP-петля: нажали «Завершить» → проверили идемпотентность в БД →
 * начислили XP через awardXp → собрали короткий ответ для UI
 * (XP, новый уровень, эволюция, реплика компаньона). Никакой истории
 * тренировок и никакого планирования сессий — это придёт, когда
 * у тренировок появятся настоящие данные.
 *
 * Защита от XP-фарма: вставляем строку в `workout_completions` ДО
 * начисления XP. UNIQUE (user_id, workout_id, completed_on) гарантирует,
 * что повторный клик по «Завершить» одной и той же тренировки в течение
 * дня вернёт `alreadyCompleted: true` и XP больше не начислится.
 * См. supabase/migrations/0006_workout_completions.sql.
 *
 * Авторизация: `awardXp` ходит в Supabase под сессией текущего юзера,
 * поэтому RLS — наш страховочный слой. Здесь дополнительно отсекаем
 * незалогиненных, чтобы не делать лишнего раунд-трипа.
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  awardXp,
  getAvatarEvolutionForLevel,
  todayUtcISO,
  touchStreak,
  XP_REWARDS,
  type AwardXpResult,
  type StreakUpdate,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  buildCompanionFeedback,
  type CompanionFeedback,
} from "./companion-feedback";
import { getWorkoutById } from "./queries";

export type CompleteWorkoutResponse = {
  data:
    | (AwardXpResult & {
        workoutId: string;
        workoutTitle: string;
        companion: CompanionFeedback;
        /** true, если эта тренировка уже была закрыта сегодня и XP не начислялся повторно. */
        alreadyCompleted: boolean;
        /**
         * Снимок стрика после действия. null, если touchStreak упал —
         * UI просто не покажет обновление серии, прогрессия всё равно
         * начислена. Также null в ветке `alreadyCompleted`, где стрик
         * уже был учтён ранее сегодня.
         */
        streak: StreakUpdate | null;
      })
    | null;
  error: string | null;
};

export async function completeWorkoutAction(
  workoutId: string,
): Promise<CompleteWorkoutResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: "Не авторизован." };
  }

  const supabase = await createSupabaseServerClient();

  // Проверяем существование тренировки по БД (а не по статическому списку):
  // так RLS и флаг is_active автоматически отсекают неактивный/удалённый
  // контент. Если миграция 0004 ещё не применена — getWorkoutById вернёт
  // null, и мы корректно сообщим пользователю.
  const workout = await getWorkoutById(supabase, workoutId);
  if (!workout) {
    return { data: null, error: "Тренировка не найдена." };
  }

  const today = todayUtcISO();

  // Снимок XP до INSERT: сохраняется в записи о завершении. В ветке 23505
  // позволяет определить, был ли XP начислен при первой попытке, и
  // восстановить его, если нет. См. логику восстановления ниже.
  const { data: preProfile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .maybeSingle();
  const xpBefore = Number(preProfile?.xp ?? 0);

  // Идемпотентный шаг: вставляем запись о завершении ДО awardXp. UNIQUE
  // (user_id, workout_id, completed_on) даёт 23505 на повторе — это не
  // ошибка, а корректное «уже было сегодня». XP не начисляем, отдаём
  // текущий снимок прогрессии, как при первом закрытии.
  const xpAmount = XP_REWARDS.WORKOUT_COMPLETE;
  const { error: insertError } = await supabase
    .from("workout_completions")
    .insert({
      user_id: user.id,
      workout_id: workout.id,
      completed_on: today,
      xp_awarded: xpAmount,
      xp_before: xpBefore,
    });

  if (insertError && insertError.code === "23505") {
    // Запись о завершении уже существует. Проверяем, был ли XP начислен
    // при первой попытке: сравниваем текущий xp профиля с xp_before +
    // xp_awarded из существующей записи. Если XP не был начислен —
    // восстанавливаем его здесь же, не требуя повторного действия от юзера.
    const { data: existingRow } = await supabase
      .from("workout_completions")
      .select("xp_before")
      .eq("user_id", user.id)
      .eq("workout_id", workout.id)
      .eq("completed_on", today)
      .maybeSingle();

    const snapshot = await readProgressionSnapshot(supabase, user.id);
    if (!snapshot) {
      return { data: null, error: "Не удалось прочитать профиль." };
    }

    const recordXpBefore = Number(existingRow?.xp_before ?? 0);
    const xpWasApplied = snapshot.totalXp >= recordXpBefore + xpAmount;

    if (xpWasApplied) {
      const companion = buildCompanionFeedback({
        leveledUp: false,
        evolved: false,
        streak: undefined,
      });
      return {
        data: {
          ...snapshot,
          workoutId: workout.id,
          workoutTitle: workout.title,
          companion,
          alreadyCompleted: true,
          streak: null,
        },
        error: null,
      };
    }

    // XP не был начислен при первой попытке — восстанавливаем.
    console.warn("[completeWorkoutAction] recovering XP after prior awardXp failure");
    const { data: recoveredData, error: recoveredError } = await awardXp(
      supabase,
      user.id,
      { source: "WORKOUT_COMPLETE" },
    );

    if (recoveredError || !recoveredData) {
      console.error("[completeWorkoutAction] recovery awardXp", recoveredError);
      return { data: null, error: "Не удалось начислить XP." };
    }

    const recoveredStreakRes = await touchStreak(supabase, user.id);
    if (recoveredStreakRes.error) {
      console.error("[completeWorkoutAction] recovery touchStreak", recoveredStreakRes.error);
    }

    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/avatar");

    const recoveredCompanion = buildCompanionFeedback({
      leveledUp: recoveredData.leveledUp,
      evolved: recoveredData.evolved,
      streak: recoveredStreakRes.data
        ? {
            increased: recoveredStreakRes.data.increased,
            newStreak: recoveredStreakRes.data.newStreak,
          }
        : undefined,
    });

    return {
      data: {
        ...recoveredData,
        workoutId: workout.id,
        workoutTitle: workout.title,
        companion: recoveredCompanion,
        alreadyCompleted: false,
        streak: recoveredStreakRes.data,
      },
      error: null,
    };
  }

  if (insertError) {
    console.error("[completeWorkoutAction] insert", insertError);
    return { data: null, error: "Не удалось завершить тренировку." };
  }

  const { data, error } = await awardXp(supabase, user.id, {
    source: "WORKOUT_COMPLETE",
  });

  if (error || !data) {
    console.error("[completeWorkoutAction] awardXp", error);
    return { data: null, error: "Не удалось начислить XP." };
  }

  // Серия активных дней — отдельный апдейт. Падение тут не должно ломать
  // основной поток: XP уже начислён, эволюция возможно тоже произошла.
  // В таком случае просто не двигаем стрик и отдаём streak: null в UI.
  const streakRes = await touchStreak(supabase, user.id);
  if (streakRes.error) {
    console.error("[completeWorkoutAction] touchStreak", streakRes.error);
  }

  // Обновим серверные экраны, которые показывают XP/уровень/аватар/серию,
  // чтобы при следующем заходе они уже отрисовали актуальное состояние.
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/avatar");

  const companion = buildCompanionFeedback({
    leveledUp: data.leveledUp,
    evolved: data.evolved,
    streak: streakRes.data
      ? {
          increased: streakRes.data.increased,
          newStreak: streakRes.data.newStreak,
        }
      : undefined,
  });

  return {
    data: {
      ...data,
      workoutId: workout.id,
      workoutTitle: workout.title,
      companion,
      alreadyCompleted: false,
      streak: streakRes.data,
    },
    error: null,
  };
}

/**
 * Снимок XP/уровня без начисления — нужен только для пути «уже закрыт сегодня»,
 * чтобы клиент мог показать тот же результат, что увидел бы при первом нажатии.
 * Структурно совпадает с readProgressionSnapshot в lib/quests/actions.ts.
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

  if (error || !data) {
    if (error) {
      console.error("[completeWorkoutAction] readProgressionSnapshot", error);
    }
    return null;
  }

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
