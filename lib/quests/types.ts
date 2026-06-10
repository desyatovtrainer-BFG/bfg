/**
 * Типы ежедневных квестов (MVP).
 *
 * Живут в `lib/quests/`, потому что используются и серверным слоем
 * (каталог в `daily-quests.ts`, action в `actions.ts`), и UI-слоем
 * (`app/components/daily-quests/*`). По правилам архитектуры BFG
 * cross-component типы фичи лежат в `lib/<feature>/types.ts`, а
 * `app/components/<feature>` импортирует их из публичной поверхности
 * через `@/lib/quests`.
 *
 * Квесты «тренировка» и «удержать серию» удалены по решениям D018/D019
 * (docs/BFG_PRODUCT_DECISIONS.md): тренировка награждается один раз через
 * WORKOUT_COMPLETE, а серия никогда не даёт XP.
 */

export type QuestKind =
  | "steps"
  | "stretch"
  | "hydration"
  | "walk"
  | "breathing"
  | "recovery";

/**
 * Поведенческая категория квеста (D033). Дневная подборка не должна
 * содержать два квеста одной категории — категории и обеспечивают
 * разнообразие здоровых действий. Список растёт вместе с каталогом.
 */
export type QuestCategory =
  | "training"
  | "mobility"
  | "walking"
  | "recovery"
  | "hydration"
  | "breathing";

export type QuestState = "locked" | "active" | "completed" | "reward_claimed";

export type QuestRewards = {
  xp: number;
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
  category: QuestCategory;
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
  stretch: "Растяжка",
  hydration: "Гидратация",
  walk: "Прогулка",
  breathing: "Дыхание",
  recovery: "Восстановление",
};
