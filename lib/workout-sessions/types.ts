/**
 * Типы workout-сессий (границы D049/D050, эксклюзивность D058).
 *
 * Строка в public.workout_sessions со status='active' = «тренировка
 * В процессе». Единственность активной сессии гарантирует частичный
 * уникальный индекс workout_sessions_one_active (миграция 0011).
 */

export type ActiveWorkoutSession = {
  id: string;
  workoutId: string;
  /** ISO-таймстамп границы старта (D049/D040). */
  startedAt: string;
};

/** Результат старта тренировки (граница D049 + разрешение конфликта D058). */
export type StartWorkoutOutcome =
  /** Создана новая активная сессия. */
  | { outcome: "started"; workoutId: string }
  /** Эта тренировка уже была активна — возобновляем её (идемпотентно). */
  | { outcome: "resumed"; workoutId: string }
  /** Активна ДРУГАЯ тренировка (D058) — UI ведёт «Вернуться к тренировке». */
  | { outcome: "active_elsewhere"; activeWorkoutId: string };
