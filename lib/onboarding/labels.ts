import type {
  FitnessLevel,
  Goal,
  Sex,
  TrainingFormat,
  TrainingStructure,
  WeeklyFrequency,
} from "./types";

/**
 * Русские подписи принятых enum-значений онбординга (D079/D085/D086).
 *
 * Чистый слой «значение → подпись» без серверных зависимостей — безопасен
 * и для Server Components, и для клиентских листьев (Профиль, D086).
 * Сырые enum-значения пользователю не показываются никогда.
 */

export const GOAL_LABELS: Record<Goal, string> = {
  weight_loss: "Снижение веса",
  muscle_gain: "Наращивание мышечной массы",
  endurance: "Улучшение выносливости",
  general_fitness: "Общая физическая форма",
  body_recomposition: "Рекомпозиция тела",
};

export const FITNESS_LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: "Только начинаю",
  intermediate: "Тренируюсь менее года",
  advanced: "Тренируюсь регулярно больше года",
};

export const TRAINING_FORMAT_LABELS: Record<TrainingFormat, string> = {
  home: "Дома",
  gym: "В зале",
};

export const WEEKLY_FREQUENCY_LABELS: Record<WeeklyFrequency, string> = {
  2: "2 раза в неделю",
  3: "3 раза в неделю",
  4: "4 раза в неделю",
};

export const TRAINING_STRUCTURE_LABELS: Record<TrainingStructure, string> = {
  full_body: "Фулбоди",
  split: "Сплит",
};

/** Направление аватара из Герой/Героиня (D079/D083): без сырых male/female. */
export const SEX_DIRECTION_LABELS: Record<Sex, string> = {
  male: "Герой",
  female: "Героиня",
};
