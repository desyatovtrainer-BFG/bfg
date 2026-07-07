import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getActiveWorkoutSession,
  getLatestCompletedWorkoutSession,
} from "@/lib/workout-sessions";
import type { Workout } from "@/lib/workouts";

/**
 * Journey-указатель (D043/D046/D051/D058/D059) — ЕДИНАЯ read-only логика
 * для Home (Continue Journey) и Activity (маркеры карточек), чтобы обе
 * поверхности всегда сходились в одном «где я в цикле».
 *
 * Порядок разрешения (D046) и старшинство источников указателя:
 *   1. активная (незавершённая) сессия → вернуться к ней (D058);
 *   2. последняя ЗАВЕРШЁННАЯ workout-сессия (finished_at, D050) — она
 *      фиксирует каждое реальное прохождение, включая повтор уже
 *      засчитанной сегодня тренировки: XP-идемпотентность и указатель —
 *      разные вещи, цикл двигается от фактически завершённой (D051);
 *   3. fallback для данных до миграции 0011 — последняя строка
 *      идемпотентной workout_completions;
 *   4. ноль завершений → Тренировка 1 (D059).
 *
 * ВРЕМЕННЫЙ МОСТ: «программа» = текущий упорядоченный активный каталог
 * (display_order). Настоящая Program-модель (D061/D085) не реализована;
 * при её появлении меняется только источник списка workouts.
 */

export type JourneyPointer = {
  /** Тренировка с активной сессией (D058); приоритет над «следующей» (D057). */
  activeWorkoutId: string | null;
  /** Следующая по циклу (D046/D051/D059); null — каталог пуст. */
  nextWorkoutId: string | null;
  /** Индекс следующей в переданном списке; -1 — каталог пуст. */
  nextIndex: number;
  /** true — у пользователя есть хотя бы одно завершение (не первый путь). */
  hasAnyCompletion: boolean;
};

export async function resolveJourneyPointer(
  supabase: SupabaseClient,
  userId: string,
  /** Активный каталог в порядке программы (listActiveWorkouts). */
  workouts: Workout[],
): Promise<JourneyPointer> {
  const [active, latestSession, legacyCompletedId] = await Promise.all([
    getActiveWorkoutSession(supabase, userId),
    getLatestCompletedWorkoutSession(supabase, userId),
    readLastCompletedWorkoutId(supabase, userId),
  ]);

  // Ключ указателя (D051): предпочитаем последнюю завершённую СЕССИЮ —
  // она двигается и при повторном прохождении уже засчитанной сегодня
  // тренировки (идемпотентная workout_completions строк не добавляет).
  // Fallback на workout_completions — совместимость с данными до 0011.
  const pointerWorkoutId = latestSession?.workoutId ?? legacyCompletedId;

  // Завершённая вне активного каталога (контент отретирован) →
  // безопасный откат к Тренировке 1 (D059): findIndex = -1 → next = 0.
  const lastIdx = pointerWorkoutId
    ? workouts.findIndex((w) => w.id === pointerWorkoutId)
    : -1;
  const nextIndex = workouts.length > 0 ? (lastIdx + 1) % workouts.length : -1;

  return {
    activeWorkoutId: active?.workoutId ?? null,
    nextWorkoutId: nextIndex >= 0 ? (workouts[nextIndex]?.id ?? null) : null,
    nextIndex,
    hasAnyCompletion: pointerWorkoutId !== null,
  };
}

/** Указатель для случая без пользователя (страховка гонки сессии). */
export function emptyJourneyPointer(workouts: Workout[]): JourneyPointer {
  const nextIndex = workouts.length > 0 ? 0 : -1;
  return {
    activeWorkoutId: null,
    nextWorkoutId: nextIndex >= 0 ? (workouts[0]?.id ?? null) : null,
    nextIndex,
    hasAnyCompletion: false,
  };
}

/** Последняя фактически завершённая тренировка (ключ указателя D051). */
async function readLastCompletedWorkoutId(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("workout_completions")
    .select("workout_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[resolveJourneyPointer] read last completion", error);
    return null;
  }
  return data ? String(data.workout_id) : null;
}
