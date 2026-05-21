/**
 * Типы ежедневных квестов (MVP).
 *
 * Живут в `lib/quests/`, потому что используются и серверным слоем
 * (каталог в `daily-quests.ts`, action в `actions.ts`), и UI-слоем
 * (`app/components/daily-quests/*`). По правилам архитектуры BFG
 * cross-component типы фичи лежат в `lib/<feature>/types.ts`, а
 * `app/components/<feature>` импортирует их из публичной поверхности
 * через `@/lib/quests`.
 */

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
