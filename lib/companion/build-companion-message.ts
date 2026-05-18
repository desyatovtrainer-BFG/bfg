/**
 * MVP «память» компаньона.
 *
 * Никаких LLM и внешних API — фразы строятся локально, детерминированно,
 * по уже существующим данным из `public.profiles` (level/xp/streak/last_active_on).
 * Это важно по двум причинам:
 *   1) работает в России без VPN (никаких сетевых вызовов наружу);
 *   2) одинаковое состояние всегда даёт один и тот же текст в течение дня —
 *      компаньон ощущается как присутствие, а не как лотерея фраз.
 *
 * Тон строго соответствует COMPANION_SYSTEM.md и BFG_RULES.md:
 *   спокойно, коротко, атмосферно, без шейминга и токсичной мотивации.
 *
 * Возвращение после паузы — всегда «безопасное» событие. Мы НИКОГДА
 * не пишем «ты пропустил N дней», «ты потерял серию» и т.п.
 */

import { yesterdayOf } from "@/lib/progression";

export type CompanionState =
  /** Ещё ни одной зачётной активности — `last_active_on` пустой. */
  | "first_step"
  /** Был активен сегодня — компаньон отражает текущий момент. */
  | "present_today"
  /** Был активен вчера, сегодня ещё не двигался — серия жива, но «на паузе» внутри дня. */
  | "in_streak"
  /** 2–6 дней без активности — мягкое возвращение. */
  | "soft_return"
  /** 7+ дней без активности — тёплое возвращение, без давления. */
  | "warm_return";

export type CompanionMessage = {
  state: CompanionState;
  /** Сколько дней прошло с последней активности (UTC). null = ещё не было. */
  daysSinceActive: number | null;
  /** Короткий лейбл состояния — для подписи карточки. */
  stateLabel: string;
  /** Главная реплика — одна короткая фраза. */
  primary: string;
  /** Уточняющая реплика — про прогресс/серию/уровень. Может быть пустой строкой. */
  secondary: string;
};

export type BuildCompanionMessageInput = {
  /** Стабильный идентификатор пользователя — нужен только как соль для детерминированного выбора фразы. */
  userId: string;
  /** YYYY-MM-DD по UTC; если не передан — берём сегодняшний день. */
  todayIso?: string;
  level: number;
  /** XP внутри текущего уровня (0..xpForNextLevel). */
  xpInLevel: number;
  /** XP, необходимые на весь текущий уровень. */
  xpForNextLevel: number;
  streak: number;
  /** YYYY-MM-DD из `profiles.last_active_on`, либо null. */
  lastActiveOn: string | null;
};

/** Считает целое число UTC-дней между двумя датами в формате YYYY-MM-DD. */
function daysBetweenUtc(fromIso: string, toIso: string): number {
  const a = Date.UTC(
    Number(fromIso.slice(0, 4)),
    Number(fromIso.slice(5, 7)) - 1,
    Number(fromIso.slice(8, 10)),
  );
  const b = Date.UTC(
    Number(toIso.slice(0, 4)),
    Number(toIso.slice(5, 7)) - 1,
    Number(toIso.slice(8, 10)),
  );
  return Math.round((b - a) / 86_400_000);
}

/**
 * Маленький стабильный хеш строки (FNV-1a, 32 бита). Достаточно равномерный
 * для выбора одной из 3–5 фраз и полностью детерминирован — ровно то, что
 * нужно: пользователь не видит «прыгающего» компаньона при перезагрузке.
 */
function hash32(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pickStable<T>(lines: ReadonlyArray<T>, seed: string): T {
  if (lines.length === 0) throw new Error("pickStable: empty lines");
  const idx = hash32(seed) % lines.length;
  return lines[idx]!;
}

// --- Фразы по состояниям -----------------------------------------------------

const FIRST_STEP_LINES = [
  "Здесь начинается путь.",
  "Тишина перед первым движением.",
  "Ты пришёл. Этого уже достаточно.",
] as const;

const PRESENT_TODAY_LINES = [
  "Ты сегодня в движении.",
  "Сегодня ты сделал шаг.",
  "Путь продолжается.",
] as const;

const IN_STREAK_LINES = [
  "История продолжается.",
  "Ритм не разорван.",
  "Серия живёт.",
] as const;

const SOFT_RETURN_LINES = [
  "Ты снова здесь. Это уже многое.",
  "Тишина закончилась.",
  "Путь не исчез — он ждал.",
] as const;

const WARM_RETURN_LINES = [
  "Хорошо, что ты вернулся. Спокойно, без спешки.",
  "Долгая тишина. И всё же — ты здесь.",
  "Возвращение — тоже движение.",
] as const;

// --- «Эмоциональные вехи» — вторая реплика ----------------------------------

/** Особые числа серии. Совпадают с lib/workouts/companion-feedback.ts по духу. */
const STREAK_MILESTONES: Record<number, string> = {
  3: "Третий день — тишина звучит иначе.",
  7: "Семь дней. Это уже не случайность.",
  14: "Две недели. Путь становится частью тебя.",
  30: "Тридцать дней. Ты живёшь это.",
  100: "Сто дней. Ты — другой.",
};

/** Уровни, на которых компаньон тихо признаёт «ступень». */
const LEVEL_MILESTONES: Record<number, string> = {
  5: "Пятый уровень. Форма обретает плотность.",
  10: "Десятый уровень. Ты заметно устойчивее.",
  20: "Двадцатый уровень. Это уже другая глава.",
  50: "Пятидесятый. Редкий путь.",
};

function buildSecondary(input: {
  state: CompanionState;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  streak: number;
}): string {
  const { state, level, xpInLevel, xpForNextLevel, streak } = input;

  // Вехи серии показываем только когда серия «жива»: сегодня или вчера.
  // На возвращении после паузы говорить про «N дней подряд» бессмысленно
  // и эмоционально неверно.
  if (state === "present_today" || state === "in_streak") {
    const milestone = STREAK_MILESTONES[streak];
    if (milestone) return milestone;
  }

  // Вехи уровня — нейтральный факт, можно показывать в любом состоянии,
  // включая возвращение: «ты по-прежнему на этой ступени».
  const levelMilestone = LEVEL_MILESTONES[level];
  if (levelMilestone) return levelMilestone;

  // Подсветка близости к следующему уровню — только если что-то уже накоплено.
  if (xpForNextLevel > 0 && xpInLevel > 0) {
    const progress = xpInLevel / xpForNextLevel;
    if (progress >= 0.8) {
      return "Следующий уровень совсем близко.";
    }
  }

  // Очень начало пути — мягкая подсветка эволюции, без давления.
  if (level === 1 && xpInLevel === 0 && state !== "first_step") {
    return "Эволюция только начинается.";
  }

  // Спокойная серия без круглой вехи.
  if ((state === "present_today" || state === "in_streak") && streak >= 2) {
    return "Серия держится. День за днём.";
  }

  return "";
}

// --- Главный вход ------------------------------------------------------------

function todayUtcIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function buildCompanionMessage(
  input: BuildCompanionMessageInput,
): CompanionMessage {
  const today = input.todayIso ?? todayUtcIso();
  const lastActive = input.lastActiveOn
    ? String(input.lastActiveOn).slice(0, 10)
    : null;

  const daysSinceActive =
    lastActive === null ? null : Math.max(0, daysBetweenUtc(lastActive, today));

  const state = resolveState({
    today,
    lastActive,
    daysSinceActive,
  });

  // Сид — пользователь + день + состояние. Внутри одного дня фраза стабильна;
  // на следующий день — освежится; при смене состояния — обновится сразу.
  const seed = `${input.userId}|${today}|${state}`;

  let primary: string;
  let stateLabel: string;
  switch (state) {
    case "first_step":
      primary = pickStable(FIRST_STEP_LINES, seed);
      stateLabel = "Начало пути";
      break;
    case "present_today":
      primary = pickStable(PRESENT_TODAY_LINES, seed);
      stateLabel = "Ты сегодня здесь";
      break;
    case "in_streak":
      primary = pickStable(IN_STREAK_LINES, seed);
      stateLabel = "Серия жива";
      break;
    case "soft_return":
      primary = pickStable(SOFT_RETURN_LINES, seed);
      stateLabel = "Возвращение";
      break;
    case "warm_return":
      primary = pickStable(WARM_RETURN_LINES, seed);
      stateLabel = "С возвращением";
      break;
  }

  const secondary = buildSecondary({
    state,
    level: input.level,
    xpInLevel: input.xpInLevel,
    xpForNextLevel: input.xpForNextLevel,
    streak: input.streak,
  });

  return { state, daysSinceActive, stateLabel, primary, secondary };
}

function resolveState(args: {
  today: string;
  lastActive: string | null;
  daysSinceActive: number | null;
}): CompanionState {
  const { today, lastActive, daysSinceActive } = args;
  if (lastActive === null || daysSinceActive === null) return "first_step";
  if (daysSinceActive === 0) return "present_today";
  if (lastActive === yesterdayOf(today)) return "in_streak";
  if (daysSinceActive >= 7) return "warm_return";
  return "soft_return";
}
