/**
 * Каталог MVP-ежедневных квестов.
 *
 * Источник правды и для сервера (валидация id, размер XP),
 * и для клиента (UI карточек). Никакой БД для самих квестов —
 * в MVP они одинаковые для всех. Динамика появится позже.
 *
 * Экономика по D016/D020 (docs/BFG_PRODUCT_DECISIONS.md): квест даёт
 * 3–5 XP — заметно меньше тренировки (10 XP). Квесты поддерживают
 * тренировку, а не заменяют её. Квесты «тренировка» и «удержать серию»
 * удалены (D018/D019).
 *
 * ВРЕМЕННО: у всех квестов единое значение 4 XP — точные значения
 * по сложности (3–5) не утверждены. Тексты новых квестов — DRAFT,
 * ожидают контент-ревью.
 *
 * Каталог — это пул контента. Дневная подборка из 3 квестов с
 * категорийной дедупликацией (D017/D033) появится в P0B; до этого
 * все квесты каталога доступны ежедневно.
 */

import type { DailyQuest, QuestCategory, QuestKind, QuestProgress, QuestRewards } from "./types";

export type DailyQuestTemplate = {
  id: string;
  kind: QuestKind;
  category: QuestCategory;
  title: string;
  subtitle: string;
  rewards: QuestRewards;
  /** Прогресс по умолчанию — для квестов с измеряемой целью. */
  defaultProgress?: QuestProgress;
};

export const DAILY_QUESTS: ReadonlyArray<DailyQuestTemplate> = [
  {
    id: "stretch",
    kind: "stretch",
    category: "mobility",
    title: "Выполнить растяжку",
    subtitle: "Мягкое продление — чтобы завтра ударить сильнее.",
    rewards: { xp: 4 },
    defaultProgress: { current: 0, max: 15, unitLabel: "мин" },
  },
  {
    id: "hydration",
    kind: "hydration",
    category: "hydration",
    title: "Гидратация",
    subtitle: "Вода — как мана: без неё заклинания тела слабеют.",
    rewards: { xp: 4 },
    defaultProgress: { current: 1200, max: 2000, unitLabel: "мл" },
  },
  {
    // DRAFT copy — pending content review
    id: "walk",
    kind: "walk",
    category: "walking",
    title: "Прогулка",
    subtitle: "Двадцать минут шага — и мысли сами встают по местам.",
    rewards: { xp: 4 },
    defaultProgress: { current: 0, max: 20, unitLabel: "мин" },
  },
  {
    // DRAFT copy — pending content review
    id: "breathing",
    kind: "breathing",
    category: "breathing",
    title: "Дыхание",
    subtitle: "Пять минут ровного дыхания — тихая перезагрузка.",
    rewards: { xp: 4 },
    defaultProgress: { current: 0, max: 5, unitLabel: "мин" },
  },
  {
    // DRAFT copy — pending content review
    id: "recovery",
    kind: "recovery",
    category: "recovery",
    title: "Восстановление",
    subtitle: "Сон — тихая тренировка. Дай телу её провести.",
    rewards: { xp: 4 },
  },
];

/** Порядок отрисовки на экране — фиксируем, чтобы карточки не «прыгали». */
export const DAILY_QUEST_ORDER: ReadonlyArray<string> = DAILY_QUESTS.map((q) => q.id);

export function findDailyQuest(id: string): DailyQuestTemplate | undefined {
  return DAILY_QUESTS.find((q) => q.id === id);
}

/**
 * Собирает DailyQuest[] для UI из шаблонов и множества уже закрытых сегодня id.
 *
 * Правила состояния:
 *   - id есть в `completedIds` → `reward_claimed`;
 *   - иначе → `active` со стартовым прогрессом.
 */
export function buildDailyQuestList(completedIds: ReadonlyArray<string>): DailyQuest[] {
  const done = new Set(completedIds);

  return DAILY_QUESTS.map((tpl): DailyQuest => {
    if (done.has(tpl.id)) {
      return {
        id: tpl.id,
        kind: tpl.kind,
        category: tpl.category,
        title: tpl.title,
        subtitle: tpl.subtitle,
        rewards: tpl.rewards,
        state: "reward_claimed",
      };
    }

    return {
      id: tpl.id,
      kind: tpl.kind,
      category: tpl.category,
      title: tpl.title,
      subtitle: tpl.subtitle,
      rewards: tpl.rewards,
      state: "active",
      progress: tpl.defaultProgress,
    };
  });
}
