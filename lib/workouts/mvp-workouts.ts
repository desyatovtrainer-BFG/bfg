/**
 * Временный набор тренировок для MVP.
 *
 * Никакой БД, никакой системы планирования — мы пока просто хотим
 * замкнуть петлю «нажал → получил XP → увидел реакцию». Когда появится
 * реальный каталог тренировок, этот файл уходит целиком.
 *
 * Список держим коротким, чтобы экран не превращался в ленту: 3 опции
 * — это уже выбор настроения, но ещё не «выбор паралича».
 */

export type MvpWorkout = {
  id: string;
  title: string;
  subtitle: string;
  /** Короткий тег длительности — рисуем рядом с заголовком. */
  duration: string;
  /** Цветовой акцент карточки (соответствует glow GameCard). */
  accent: "cyan" | "violet" | "rose";
};

export const MVP_WORKOUTS: ReadonlyArray<MvpWorkout> = [
  {
    id: "morning-flow",
    title: "Утренний поток",
    subtitle: "Лёгкая мобильность и пробуждение тела",
    duration: "10 мин",
    accent: "cyan",
  },
  {
    id: "strength-mini",
    title: "Силовой мини-сет",
    subtitle: "Базовые движения с собственным весом",
    duration: "20 мин",
    accent: "violet",
  },
  {
    id: "cardio-pulse",
    title: "Кардио-импульс",
    subtitle: "Короткий взрыв активности",
    duration: "15 мин",
    accent: "rose",
  },
];

export function findMvpWorkout(id: string): MvpWorkout | undefined {
  return MVP_WORKOUTS.find((w) => w.id === id);
}
