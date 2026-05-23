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
import {
  mapWorkoutExerciseRow,
  mapWorkoutRow,
  type Workout,
  type WorkoutExercise,
  type WorkoutExerciseRow,
  type WorkoutRow,
} from "./types";
import { validateSupersetContent } from "./superset";

const WORKOUT_COLUMNS =
  "id, title, description, difficulty, duration_min, category, thumbnail_url, video_provider, video_id, is_active";

const WORKOUT_EXERCISE_COLUMNS =
  "id, workout_id, order_index, title, description, duration_sec, video_provider, video_id, is_active, superset_group_id";

export async function listActiveWorkouts(
  supabase: SupabaseClient,
): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select(WORKOUT_COLUMNS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
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

/**
 * Активные упражнения тренировки в нужном порядке.
 *
 * RLS пропускает только `is_active = true`, но фильтр оставляем в коде
 * на случай отладочного отключения RLS — UI всё равно не должен видеть
 * черновики. Сортируем по `order_index` (уникален в рамках workout_id),
 * получаем стабильный детерминированный порядок без рандомных сюрпризов.
 */
export async function listWorkoutExercises(
  supabase: SupabaseClient,
  workoutId: string,
): Promise<WorkoutExercise[]> {
  const { data, error } = await supabase
    .from("workout_exercises")
    .select(WORKOUT_EXERCISE_COLUMNS)
    .eq("workout_id", workoutId)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[listWorkoutExercises]", error);
    return [];
  }

  const exercises = ((data ?? []) as WorkoutExerciseRow[]).map(mapWorkoutExerciseRow);

  for (const violation of validateSupersetContent(workoutId, exercises)) {
    console.warn("[listWorkoutExercises]", violation);
  }

  return exercises;
}

/**
 * Тренировка + её активные упражнения одним вызовом.
 *
 * Удобный composer для экрана сессии: два запроса параллельно, чтобы
 * не платить за лишний раунд-трип. Если миграция 0005 ещё не накатана —
 * exercises вернутся пустым массивом, и UI отрисует empty-state без падения.
 */
export async function getWorkoutWithExercises(
  supabase: SupabaseClient,
  id: string,
): Promise<{ workout: Workout; exercises: WorkoutExercise[] } | null> {
  const [workout, exercises] = await Promise.all([
    getWorkoutById(supabase, id),
    listWorkoutExercises(supabase, id),
  ]);
  if (!workout) return null;
  return { workout, exercises };
}
