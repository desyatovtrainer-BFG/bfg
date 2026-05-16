"use server";

/**
 * Server Action: завершение тренировки.
 *
 * MVP-петля: нажали «Завершить» → начислили XP через awardXp →
 * собрали короткий ответ для UI (XP, новый уровень, эволюция,
 * реплика компаньона). Никакой истории тренировок и никакого
 * планирования сессий — это придёт, когда у тренировок появятся
 * настоящие данные.
 *
 * Авторизация: `awardXp` ходит в Supabase под сессией текущего юзера,
 * поэтому RLS — наш страховочный слой. Здесь дополнительно отсекаем
 * незалогиненных, чтобы не делать лишнего раунд-трипа.
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  awardXp,
  touchStreak,
  type AwardXpResult,
  type StreakUpdate,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  buildCompanionFeedback,
  type CompanionFeedback,
} from "./companion-feedback";
import { findMvpWorkout } from "./mvp-workouts";

export type CompleteWorkoutResponse = {
  data:
    | (AwardXpResult & {
        workoutId: string;
        workoutTitle: string;
        companion: CompanionFeedback;
        /**
         * Снимок стрика после действия. null, если touchStreak упал —
         * UI просто не покажет обновление серии, прогрессия всё равно
         * начислена.
         */
        streak: StreakUpdate | null;
      })
    | null;
  error: string | null;
};

export async function completeWorkoutAction(
  workoutId: string,
): Promise<CompleteWorkoutResponse> {
  const workout = findMvpWorkout(workoutId);
  if (!workout) {
    return { data: null, error: "Тренировка не найдена." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: "Не авторизован." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await awardXp(supabase, user.id, {
    source: "WORKOUT_COMPLETE",
  });

  if (error || !data) {
    return { data: null, error: error ?? "Не удалось начислить XP." };
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
      streak: streakRes.data,
    },
    error: null,
  };
}
