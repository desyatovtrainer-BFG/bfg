/**
 * Подбор короткой реплики компаньона после завершения тренировки.
 *
 * Никаких LLM на MVP — берём фразу из заранее заготовленного набора по
 * приоритету события (эволюция > level up > обычное завершение). Тон
 * соответствует COMPANION_SYSTEM.md: спокойно, кратко, без давления.
 *
 * Возвращаем ещё и `tone` — UI использует его, чтобы выбрать акцент
 * карточки фидбека (золотой для эволюции, фиолетовый для level up,
 * нейтральный для остального).
 */

export type CompanionTone = "evolution" | "levelUp" | "calm";

export type CompanionFeedback = {
  tone: CompanionTone;
  message: string;
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

function pick<T>(lines: ReadonlyArray<T>): T {
  // Math.random — этого достаточно для эмоциональной вариативности.
  const i = Math.floor(Math.random() * lines.length);
  return lines[i] ?? lines[0]!;
}

export function buildCompanionFeedback(input: {
  leveledUp: boolean;
  evolved: boolean;
}): CompanionFeedback {
  if (input.evolved) {
    return { tone: "evolution", message: pick(EVOLUTION_LINES) };
  }
  if (input.leveledUp) {
    return { tone: "levelUp", message: pick(LEVEL_UP_LINES) };
  }
  return { tone: "calm", message: pick(CALM_LINES) };
}
