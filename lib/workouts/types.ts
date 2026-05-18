/**
 * Доменные типы каталога тренировок и хелперы видео-провайдеров.
 *
 * Архитектурная подготовка под Kinescope: реальной интеграции пока нет,
 * но в БД и в коде уже зарезервированы поля `video_provider` + `video_id`.
 * Когда контент-редактор проставит у тренировки provider='kinescope' и
 * id ролика, embed-URL соберётся через `getWorkoutVideoEmbedUrl` —
 * никаких миграций и правок схемы не понадобится.
 *
 * Почему именно Kinescope: это российский видеохостинг (kinescope.io),
 * доступен в РФ без VPN, в отличие от YouTube/Vimeo — приоритет MVP.
 * Поэтому 'kinescope' — единственный «настоящий» провайдер; 'none'
 * означает «карточка без видео, просто описание».
 *
 * Как наполнять контент вручную через Supabase Table Editor —
 * см. `WORKOUT_CONTENT_GUIDE.md` в корне репозитория.
 */

/** Сложность тренировки. Совпадает с CHECK-констрейнтом в БД. */
export type WorkoutDifficulty = "easy" | "medium" | "hard";

/** Видео-провайдер. Расширяется без миграции только если хостинг
 *  работает в РФ без VPN. */
export type WorkoutVideoProvider = "none" | "kinescope";

/** Доменная модель тренировки (camelCase, для UI и actions). */
export type Workout = {
  id: string;
  title: string;
  description: string;
  difficulty: WorkoutDifficulty;
  /** Длительность в минутах. В БД — `duration_min`. */
  durationMin: number;
  /** Свободный текст-категория ('cardio', 'strength', 'mobility', …). */
  category: string;
  thumbnailUrl: string | null;
  videoProvider: WorkoutVideoProvider;
  videoId: string | null;
  isActive: boolean;
};

/** Сырой ряд из Supabase. Используется только внутри queries.ts. */
export type WorkoutRow = {
  id: string;
  title: string;
  description: string;
  difficulty: WorkoutDifficulty;
  duration_min: number;
  category: string;
  thumbnail_url: string | null;
  video_provider: WorkoutVideoProvider;
  video_id: string | null;
  is_active: boolean;
};

export function mapWorkoutRow(row: WorkoutRow): Workout {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    durationMin: row.duration_min,
    category: row.category,
    thumbnailUrl: row.thumbnail_url,
    videoProvider: row.video_provider,
    videoId: row.video_id,
    isActive: row.is_active,
  };
}

/** Русские лейблы сложности — единственное место, где их форматируем. */
export const WORKOUT_DIFFICULTY_LABELS: Record<WorkoutDifficulty, string> = {
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Высокая",
};

/**
 * Цветовой акцент карточки по сложности. GameCard принимает
 * 'cyan' | 'violet' | 'rose' | 'gold' — переиспользуем ту же палитру.
 */
export const WORKOUT_DIFFICULTY_ACCENT: Record<
  WorkoutDifficulty,
  "cyan" | "violet" | "rose"
> = {
  easy: "cyan",
  medium: "violet",
  hard: "rose",
};

/** Короткий тег длительности для UI: '10 мин'. */
export function formatWorkoutDuration(durationMin: number): string {
  return `${durationMin} мин`;
}

/**
 * Доменная модель упражнения внутри тренировки (camelCase, для UI).
 *
 * Тренировка теперь — это упорядоченная последовательность упражнений
 * (см. миграцию 0005). Поля workouts.video_provider / workouts.video_id
 * больше не используются в UI сессии, но в схеме остаются — миграции
 * в проде идут вручную, и сносить колонки лишний раз опасно.
 */
export type WorkoutExercise = {
  id: string;
  workoutId: string;
  orderIndex: number;
  title: string;
  description: string;
  /** Длительность шага в секундах. В БД — `duration_sec`. */
  durationSec: number;
  videoProvider: WorkoutVideoProvider;
  videoId: string | null;
  isActive: boolean;
};

export type WorkoutExerciseRow = {
  id: string;
  workout_id: string;
  order_index: number;
  title: string;
  description: string;
  duration_sec: number;
  video_provider: WorkoutVideoProvider;
  video_id: string | null;
  is_active: boolean;
};

export function mapWorkoutExerciseRow(
  row: WorkoutExerciseRow,
): WorkoutExercise {
  return {
    id: row.id,
    workoutId: row.workout_id,
    orderIndex: row.order_index,
    title: row.title,
    description: row.description,
    durationSec: row.duration_sec,
    videoProvider: row.video_provider,
    videoId: row.video_id,
    isActive: row.is_active,
  };
}

/** Короткий тег длительности упражнения: '45 сек', '2 мин', '1 мин 30 сек'. */
export function formatExerciseDuration(durationSec: number): string {
  if (durationSec < 60) return `${durationSec} сек`;
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  if (seconds === 0) return `${minutes} мин`;
  return `${minutes} мин ${seconds} сек`;
}

/**
 * Внутренний сборщик embed-URL по провайдеру и id.
 *
 * Один источник истины для всех видео в проекте — и для самой тренировки,
 * и для отдельного упражнения. Возвращает null, если видео не назначено;
 * UI в этом случае рисует спокойный плейсхолдер.
 *
 * Документация: https://docs.kinescope.io/embed/iframe
 */
function buildVideoEmbedUrl(
  provider: WorkoutVideoProvider,
  videoId: string | null,
): string | null {
  if (!videoId) return null;
  switch (provider) {
    case "kinescope":
      return `https://kinescope.io/embed/${videoId}`;
    case "none":
      return null;
  }
}

/** Embed-URL для шапки тренировки (legacy — на случай, если контент-редактор
 *  всё-таки проставит видео на уровне тренировки). UI сессии теперь рисует
 *  плеер по упражнениям, см. `getExerciseVideoEmbedUrl`. */
export function getWorkoutVideoEmbedUrl(workout: Workout): string | null {
  return buildVideoEmbedUrl(workout.videoProvider, workout.videoId);
}

/** Embed-URL для конкретного упражнения. */
export function getExerciseVideoEmbedUrl(
  exercise: WorkoutExercise,
): string | null {
  return buildVideoEmbedUrl(exercise.videoProvider, exercise.videoId);
}
