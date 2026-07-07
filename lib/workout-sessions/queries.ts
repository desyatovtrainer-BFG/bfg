import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActiveWorkoutSession } from "./types";

/** Последняя завершённая workout-сессия (реальная граница Finish, D050). */
export type LatestCompletedWorkoutSession = {
  workoutId: string;
  /** ISO-таймстамп finished_at. */
  finishedAt: string;
};

/**
 * Read-only чтение активной workout-сессии текущего пользователя.
 *
 * Используется server-рендером Activity (маркер «В процессе», D057)
 * и Экраном старта (вариант кнопки, D058). Никаких записей.
 * RLS «свои строки» действует; максимум одна активная строка на
 * пользователя — гарантия частичного уникального индекса (0011).
 */
export async function getActiveWorkoutSession(
  supabase: SupabaseClient,
  userId: string,
): Promise<ActiveWorkoutSession | null> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("id, workout_id, started_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("[getActiveWorkoutSession]", error);
    return null;
  }
  if (!data) return null;

  return {
    id: String(data.id),
    workoutId: String(data.workout_id),
    startedAt: String(data.started_at),
  };
}

/**
 * Read-only: последняя ЗАВЕРШЁННАЯ workout-сессия пользователя.
 *
 * Источник journey-указателя (D051): в отличие от идемпотентной
 * workout_completions (одна строка на тренировку в день — повтор не
 * добавляет строк), сессии фиксируют КАЖДУЮ реальную границу
 * Start→Finish, включая повторное прохождение уже засчитанной сегодня
 * тренировки. Побеждает новейший finished_at.
 */
export async function getLatestCompletedWorkoutSession(
  supabase: SupabaseClient,
  userId: string,
): Promise<LatestCompletedWorkoutSession | null> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("workout_id, finished_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getLatestCompletedWorkoutSession]", error);
    return null;
  }
  if (!data) return null;

  return {
    workoutId: String(data.workout_id),
    finishedAt: String(data.finished_at),
  };
}
