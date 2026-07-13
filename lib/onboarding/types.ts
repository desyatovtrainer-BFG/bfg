/**
 * Типы MVP-онбординга (D078/D079/D080/D085).
 *
 * Enum-значения — принятые внутренние значения D079; русские подписи
 * живут в UI. Все поля в БД nullable: null = «ещё не отвечено», точка
 * резюма потока (D078) выводится из того, какие поля ещё пусты.
 */

export const GOALS = [
  "weight_loss",
  "muscle_gain",
  "endurance",
  "general_fitness",
  "body_recomposition",
] as const;
export type Goal = (typeof GOALS)[number];

export const SEXES = ["male", "female"] as const;
export type Sex = (typeof SEXES)[number];

export const FITNESS_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type FitnessLevel = (typeof FITNESS_LEVELS)[number];

export const TRAINING_FORMATS = ["home", "gym"] as const;
export type TrainingFormat = (typeof TRAINING_FORMATS)[number];

export const WEEKLY_FREQUENCIES = [2, 3, 4] as const;
export type WeeklyFrequency = (typeof WEEKLY_FREQUENCIES)[number];

export const TRAINING_STRUCTURES = ["full_body", "split"] as const;
export type TrainingStructure = (typeof TRAINING_STRUCTURES)[number];

/**
 * Предел длины имени аватара (S4-наречение, D079). Единый лимит для
 * онбординга и редактирования в Профиле (D080/D086): 1–40 символов
 * после trim.
 */
export const AVATAR_NAME_MAX_LENGTH = 40;

/** Матрица допустимых частот по уровню (D085; одинаково для дома и зала). */
export const ALLOWED_FREQUENCIES: Record<FitnessLevel, readonly WeeklyFrequency[]> = {
  beginner: [2, 3],
  intermediate: [3],
  advanced: [3, 4],
};

/**
 * Кому показывается выбор Фулбоди/Сплит (D085): только Зал + не-новичок.
 * Всем остальным вопрос НЕ показывается вовсе, значение остаётся null —
 * это честное состояние, а не пропуск.
 */
export function isStructureEligible(
  format: TrainingFormat | null,
  level: FitnessLevel | null,
): boolean {
  return format === "gym" && (level === "intermediate" || level === "advanced");
}

/** Экран потока; резюм — с самого раннего неотвеченного (D078). */
export type OnboardingScreen = "s1" | "s2" | "s3" | "s4" | "done";

export type OnboardingState = {
  screen: OnboardingScreen;
  goals: Goal[];
  sex: Sex | null;
  fitnessLevel: FitnessLevel | null;
  trainingFormat: TrainingFormat | null;
  weeklyFrequency: WeeklyFrequency | null;
  trainingStructure: TrainingStructure | null;
  avatarName: string | null;
};

/** Направление Presence из выбора Герой/Героиня (D079/D083). */
export function directionFromSex(sex: Sex | null): "hero" | "heroine" | "neutral" {
  if (sex === "male") return "hero";
  if (sex === "female") return "heroine";
  return "neutral";
}
