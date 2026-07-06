"use server";

/**
 * Server Actions границ workout-сессии (D049/D050/D058).
 *
 * startWorkoutAction — граница старта (D049): сессия создаётся ТОЛЬКО по
 * нажатию «Начать тренировку»; просмотр тренировки сюда не пишет.
 * Единственность активной сессии (D058) обеспечена частичным уникальным
 * индексом (0011): конкурентный двойной старт получает 23505 и
 * разрешается как «возобновить существующую», второй сессии не бывает.
 *
 * finishActiveWorkoutAction — граница завершения (D050): ОБЁРТКА над
 * существующим completeWorkoutAction (XP/стрик/идемпотентность —
 * без изменений, тот файл не тронут), затем закрытие активной сессии.
 * Порядок: сначала XP (уже идемпотентно), потом закрытие — если закрытие
 * упало, сессия остаётся активной и следующий «Завершить» дозакроет её
 * без повторного XP (ветка alreadyCompleted).
 *
 * Abandon/cancel-действия НЕТ намеренно (D058 — без системы отмены).
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  completeWorkoutAction,
  getWorkoutById,
  type CompleteWorkoutResponse,
} from "@/lib/workouts";
import { getActiveWorkoutSession } from "./queries";
import type { StartWorkoutOutcome } from "./types";

export type StartWorkoutResponse = {
  data: StartWorkoutOutcome | null;
  error: string | null;
};

export async function startWorkoutAction(
  workoutId: string,
): Promise<StartWorkoutResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: "Не авторизован." };
  }

  const supabase = await createSupabaseServerClient();

  // Существующая безопасная проверка: RLS/is_active отсекают битый контент.
  const workout = await getWorkoutById(supabase, workoutId);
  if (!workout) {
    return { data: null, error: "Тренировка не найдена." };
  }

  const { error: insertError } = await supabase
    .from("workout_sessions")
    .insert({ user_id: user.id, workout_id: workout.id, status: "active" });

  if (insertError && insertError.code !== "23505") {
    console.error("[startWorkoutAction] insert", insertError);
    return { data: null, error: "Не удалось начать тренировку." };
  }

  if (insertError && insertError.code === "23505") {
    // Уже есть активная сессия (D058). Смотрим, чья она.
    const active = await getActiveWorkoutSession(supabase, user.id);
    if (!active) {
      // Гонка: активная закрылась между insert и select — пробуем один раз ещё.
      const retry = await supabase
        .from("workout_sessions")
        .insert({ user_id: user.id, workout_id: workout.id, status: "active" });
      if (retry.error) {
        console.error("[startWorkoutAction] retry insert", retry.error);
        return { data: null, error: "Не удалось начать тренировку." };
      }
      revalidatePath("/workouts");
      return { data: { outcome: "started", workoutId: workout.id }, error: null };
    }
    if (active.workoutId === workout.id) {
      return { data: { outcome: "resumed", workoutId: workout.id }, error: null };
    }
    return {
      data: { outcome: "active_elsewhere", activeWorkoutId: active.workoutId },
      error: null,
    };
  }

  revalidatePath("/workouts");
  return { data: { outcome: "started", workoutId: workout.id }, error: null };
}

export async function finishActiveWorkoutAction(
  workoutId: string,
): Promise<CompleteWorkoutResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: "Не авторизован." };
  }

  // Шаг 1: существующее завершение — XP, стрик, идемпотентность, recovery.
  // Файл действия не изменён; ветка alreadyCompleted тоже проходит сюда.
  const completion = await completeWorkoutAction(workoutId);
  if (completion.error || !completion.data) {
    return completion;
  }

  // Шаг 2: закрытие активной сессии ЭТОЙ тренировки (D050). Ноль строк —
  // не ошибка (legacy-поток без сессии или уже закрыта). Падение здесь
  // не валит завершение: XP уже начислен, следующий вызов дозакроет.
  const supabase = await createSupabaseServerClient();
  const { error: closeError } = await supabase
    .from("workout_sessions")
    .update({ status: "completed", finished_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("workout_id", workoutId)
    .eq("status", "active");

  if (closeError) {
    console.error("[finishActiveWorkoutAction] close session", closeError);
  }

  revalidatePath("/workouts");
  return completion;
}
