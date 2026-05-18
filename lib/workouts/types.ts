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
 * Сборка embed-URL для будущего <iframe>.
 *
 * Возвращает null, если у тренировки нет видео — это значит, что UI
 * должен отрендерить карточку без плеера (MVP-режим). Когда появится
 * реальный Kinescope-ролик, эта же функция вернёт пригодный URL
 * без правок типов и схемы БД.
 *
 * Документация: https://docs.kinescope.io/embed/iframe
 */
export function getWorkoutVideoEmbedUrl(workout: Workout): string | null {
  if (!workout.videoId) return null;
  switch (workout.videoProvider) {
    case "kinescope":
      return `https://kinescope.io/embed/${workout.videoId}`;
    case "none":
      return null;
  }
}
