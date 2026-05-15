/** Модель ежедневных квестов BFG (frontend foundation). */

export type QuestKind =
  | "steps"
  | "workout"
  | "stretch"
  | "streak_hold"
  | "hydration";

export type QuestState = "locked" | "active" | "completed" | "reward_claimed";

export type QuestRewards = {
  xp: number;
  coins: number;
  /** Доп. процент к множителю серии (визуал), целое */
  streakBoostPercent?: number;
};

export type QuestProgress = {
  current: number;
  max: number;
  /** Подпись к прогрессу, напр. «мл» */
  unitLabel?: string;
};

export type DailyQuest = {
  id: string;
  kind: QuestKind;
  title: string;
  subtitle: string;
  state: QuestState;
  progress?: QuestProgress;
  rewards: QuestRewards;
  /** Для locked — игровая причина, не сухой «недоступно» */
  lockReason?: string;
};

export const QUEST_KIND_LABEL: Record<QuestKind, string> = {
  steps: "Шаги",
  workout: "Тренировка",
  stretch: "Растяжка",
  streak_hold: "Серия",
  hydration: "Гидратация",
};
