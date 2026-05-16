/**
 * Подбор короткой реплики компаньона после «зачётного» события
 * (тренировка, потенциально — закрытие квеста).
 *
 * Никаких LLM на MVP — берём фразу из заранее заготовленного набора
 * по приоритету события:
 *   evolution > level up > продолжение серии > обычное завершение.
 *
 * Тон соответствует COMPANION_SYSTEM.md: спокойно, кратко, без давления,
 * без шейминга. Возвращение и пропуск дня — всегда «безопасное» событие
 * (см. lib/progression/streak.ts: пропущенный день = streak становится 1,
 * без сообщения о потере). Здесь мы просто не реагируем на restart —
 * пусть для пользователя это будет обычный «спокойный» вход.
 *
 * `tone` UI использует, чтобы выбрать акцент карточки фидбека
 * (золотой для эволюции, фиолетовый для level up, нейтральный для остального).
 */

export type CompanionTone = "evolution" | "levelUp" | "calm";

export type CompanionFeedback = {
  tone: CompanionTone;
  message: string;
};

export type StreakHint = {
  /** Стрик увеличился сегодня (продолжение серии). */
  increased: boolean;
  /** Новое значение стрика после touchStreak. */
  newStreak: number;
};

const EVOLUTION_LINES = [
  "Что-то меняется в тебе.",
  "Ты больше, чем был вчера.",
  "Аура отзывается. Путь продолжается.",
];

const LEVEL_UP_LINES = [
  "Уровень пройден. Тишина закончилась.",
  "Ты стал устойчивее.",
  "Шаг вверх. Спокойно и заслуженно.",
];

const CALM_LINES = [
  "Ты снова в движении.",
  "История продолжается.",
  "Сегодня ты сделал шаг.",
  "Путь не исчез.",
];

const STREAK_LINES = [
  "Серия живёт.",
  "Огонь не гаснет.",
  "Ритм продолжается.",
  "День за днём. Спокойно.",
];

/**
 * Особые реплики для «круглых» дней серии. Без давления —
 * это признание, а не призыв «не сорвись».
 */
const STREAK_MILESTONES: Record<number, string> = {
  3: "Третий день. Тишина начинает звучать иначе.",
  7: "Семь дней. Это уже не случайность.",
  14: "Две недели. Путь становится частью тебя.",
  30: "Тридцать дней. Ты живёшь это.",
  100: "Сто дней. Ты — другой.",
};

function pick<T>(lines: ReadonlyArray<T>): T {
  // Math.random — этого достаточно для эмоциональной вариативности.
  const i = Math.floor(Math.random() * lines.length);
  return lines[i] ?? lines[0]!;
}

export function buildCompanionFeedback(input: {
  leveledUp: boolean;
  evolved: boolean;
  /**
   * Опционально: что произошло со стриком после этого действия.
   * Если стрик увеличился — компаньон отметит продолжение серии.
   * Если был рестарт — никакой особой реакции, обычный «calm».
   */
  streak?: StreakHint;
}): CompanionFeedback {
  if (input.evolved) {
    return { tone: "evolution", message: pick(EVOLUTION_LINES) };
  }
  if (input.leveledUp) {
    return { tone: "levelUp", message: pick(LEVEL_UP_LINES) };
  }

  if (input.streak?.increased) {
    const milestone = STREAK_MILESTONES[input.streak.newStreak];
    if (milestone) {
      return { tone: "calm", message: milestone };
    }
    if (input.streak.newStreak >= 2) {
      return { tone: "calm", message: pick(STREAK_LINES) };
    }
  }

  return { tone: "calm", message: pick(CALM_LINES) };
}
