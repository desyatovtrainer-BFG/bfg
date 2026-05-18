/**
 * Запросы к каталогу тренировок.
 *
 * RLS открывает чтение только активных тренировок авторизованным юзерам,
 * поэтому здесь сознательно НЕ дублируем `eq('is_active', true)` —
 * это и так делает Postgres. Оставляем фильтр в коде только для случая,
 * когда RLS отключат для отладки: пусть UI всё равно не подсасывает
 * черновики.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { mapWorkoutRow, type Workout, type WorkoutRow } from "./types";

const WORKOUT_COLUMNS =
  "id, title, description, difficulty, duration_min, category, thumbnail_url, video_provider, video_id, is_active";

export async function listActiveWorkouts(
  supabase: SupabaseClient,
): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select(WORKOUT_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[listActiveWorkouts]", error);
    return [];
  }

  return ((data ?? []) as WorkoutRow[]).map(mapWorkoutRow);
}

export async function getWorkoutById(
  supabase: SupabaseClient,
  id: string,
): Promise<Workout | null> {
  const { data, error } = await supabase
    .from("workouts")
    .select(WORKOUT_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getWorkoutById]", error);
    return null;
  }
  if (!data) return null;

  return mapWorkoutRow(data as WorkoutRow);
}
