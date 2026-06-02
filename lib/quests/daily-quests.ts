/**
 * Каталог MVP-ежедневных квестов.
 *
 * Источник правды и для сервера (валидация id, размер XP),
 * и для клиента (UI карточек). Никакой БД для самих квестов —
 * в MVP они одинаковые для всех. Динамика появится позже.
 *
 * Числа XP берём небольшие и круглые: PROGRESSION_SYSTEM просит
 * избегать инфляции. По одному «удару» — это завершение квеста,
 * не цепочка достижений.
 */

import type { DailyQuest, QuestKind, QuestProgress, QuestRewards } from "./types";

export type DailyQuestTemplate = {
  id: string;
  kind: QuestKind;
  title: string;
  subtitle: string;
  rewards: QuestRewards;
  /** Прогресс по умолчанию — для квестов с измеряемой целью. */
  defaultProgress?: QuestProgress;
  /** Зависит ли от другого квеста (MVP — мягкая блокировка). */
  unlocksAfter?: string;
  /** Игровая причина блокировки, если есть `unlocksAfter`. */
  lockReason?: string;
};

export const DAILY_QUESTS: ReadonlyArray<DailyQuestTemplate> = [
  {
    id: "workout",
    kind: "workout",
    title: "Сделать тренировку",
    subtitle: "Один сеанс — и ты уже не тот, кто проснулся утром.",
    rewards: { xp: 140 },
  },
  {
    id: "stretch",
    kind: "stretch",
    title: "Выполнить растяжку",
    subtitle: "Мягкое продление — чтобы завтра ударить сильнее.",
    rewards: { xp: 60 },
    unlocksAfter: "workout",
    lockReason:
      "Контракт скрыт, пока не зафиксирована тренировка. Сначала закрой «Тренировку» — и путь откроется.",
    defaultProgress: { current: 0, max: 15, unitLabel: "мин" },
  },
  {
    id: "streak",
    kind: "streak_hold",
    title: "Удержать серию",
    subtitle: "Не дай пламени дня погаснуть — один вход, одно действие.",
    rewards: { xp: 50 },
  },
  {
    id: "hydration",
    kind: "hydration",
    title: "Гидратация",
    subtitle: "Вода — как мана: без неё заклинания тела слабеют.",
    rewards: { xp: 40 },
    defaultProgress: { current: 1200, max: 2000, unitLabel: "мл" },
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
 *   - id есть в `completedIds` → `reward_claimed` (сегодняшний контракт уже закрыт);
 *   - есть `unlocksAfter` и предыдущий ещё не закрыт → `locked`;
 *   - иначе → `active` со стартовым прогрессом.
 *
 * Состояние `completed` (между «зафиксировать» и «забрать») — чисто клиентское
 * и появляется в UI только локально, в памяти текущей сессии.
 */
export function buildDailyQuestList(completedIds: ReadonlyArray<string>): DailyQuest[] {
  const done = new Set(completedIds);

  return DAILY_QUESTS.map((tpl): DailyQuest => {
    if (done.has(tpl.id)) {
      return {
        id: tpl.id,
        kind: tpl.kind,
        title: tpl.title,
        subtitle: tpl.subtitle,
        rewards: tpl.rewards,
        state: "reward_claimed",
      };
    }

    if (tpl.unlocksAfter && !done.has(tpl.unlocksAfter)) {
      return {
        id: tpl.id,
        kind: tpl.kind,
        title: tpl.title,
        subtitle: tpl.subtitle,
        rewards: tpl.rewards,
        state: "locked",
        lockReason: tpl.lockReason,
      };
    }

    return {
      id: tpl.id,
      kind: tpl.kind,
      title: tpl.title,
      subtitle: tpl.subtitle,
      rewards: tpl.rewards,
      state: "active",
      progress: tpl.defaultProgress,
    };
  });
}
