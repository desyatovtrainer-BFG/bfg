import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActiveWorkoutSession } from "./types";

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
