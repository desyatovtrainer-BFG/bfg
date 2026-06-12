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
 * Каталог — это пул контента, дневная подборка — активная поверхность
 * (D017/D033): пользователь получает 3 квеста в день, детерминированно
 * от (userId, дата), без повторов категории. Сервер пересчитывает
 * подборку сам — клиент не может заявить квест вне неё.
 *
 * ВНИМАНИЕ для редакторов каталога: подборка — функция от состава
 * каталога. Изменение каталога посреди дня меняет дневную подборку
 * пользователей в тот же день.
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

/** Размер дневной подборки (D017). */
export const DAILY_QUEST_SELECTION_SIZE = 3;

/**
 * Seed дневной подборки для неавторизованного fallback-рендера
 * (страховка на гонку сессии за layout-гардом). Display-only:
 * клейм всё равно требует сессию.
 */
export const DAILY_QUEST_GUEST_SEED = "guest";

export function findDailyQuest(id: string): DailyQuestTemplate | undefined {
  return DAILY_QUESTS.find((q) => q.id === id);
}

/** FNV-1a 32-bit — детерминированный seed из строки. Не криптография. */
function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — крошечный seeded PRNG; Math.random запрещён (детерминизм). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Дневная подборка квестов: детерминированная чистая функция от
 * (userId, dateISO). Один и тот же день → одна и та же подборка на
 * каждом экране и в Server Action — поэтому серверная валидация
 * не требует ни таблицы, ни cron.
 *
 * Категорийная дедупликация (D033): первый проход берёт только квесты
 * с ещё не использованной категорией. На текущем каталоге (все
 * категории различны) повтор категории невозможен. Добор без учёта
 * категории — только запасной путь для будущих каталогов, где
 * различных категорий меньше трёх («where possible»).
 */
export function selectDailyQuestIds(userId: string, dateISO: string): string[] {
  const rand = mulberry32(hashSeed(`${userId}:${dateISO}`));

  // Fisher–Yates на копии каталога — порядок розыгрыша дня.
  const pool = [...DAILY_QUESTS];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }

  const picked: DailyQuestTemplate[] = [];
  const usedCategories = new Set<QuestCategory>();
  for (const tpl of pool) {
    if (picked.length >= DAILY_QUEST_SELECTION_SIZE) break;
    if (usedCategories.has(tpl.category)) continue;
    usedCategories.add(tpl.category);
    picked.push(tpl);
  }

  // Запасной добор (только если различных категорий в каталоге < 3).
  if (picked.length < DAILY_QUEST_SELECTION_SIZE) {
    for (const tpl of pool) {
      if (picked.length >= DAILY_QUEST_SELECTION_SIZE) break;
      if (!picked.includes(tpl)) picked.push(tpl);
    }
  }

  // Карточки рисуем в стабильном каталожном порядке — случайна сама
  // подборка, а не порядок на экране.
  const orderIndex = new Map(DAILY_QUEST_ORDER.map((id, i) => [id, i]));
  return picked
    .map((tpl) => tpl.id)
    .sort((a, b) => (orderIndex.get(a) ?? 0) - (orderIndex.get(b) ?? 0));
}

/**
 * Собирает DailyQuest[] для UI из дневной подборки и закрытых сегодня id.
 *
 * Правила отображения:
 *   - показываются квесты подборки + закрытые сегодня вне подборки
 *     (закрытая карточка не исчезает, даже если подборка изменилась);
 *   - id без шаблона в каталоге (legacy, например старый «workout»)
 *     молча пропускается;
 *   - id из `completedIds` → `reward_claimed`, иначе `active`.
 */
export function buildDailyQuestList(
  selectedIds: ReadonlyArray<string>,
  completedIds: ReadonlyArray<string>,
): DailyQuest[] {
  const done = new Set(completedIds);
  const shown = new Set(selectedIds);

  const ids = [...selectedIds];
  for (const id of completedIds) {
    if (!shown.has(id)) ids.push(id);
  }

  const orderIndex = new Map(DAILY_QUEST_ORDER.map((qid, i) => [qid, i]));
  ids.sort((a, b) => (orderIndex.get(a) ?? 99) - (orderIndex.get(b) ?? 99));

  const result: DailyQuest[] = [];
  for (const id of ids) {
    const tpl = findDailyQuest(id);
    if (!tpl) continue;

    if (done.has(id)) {
      result.push({
        id: tpl.id,
        kind: tpl.kind,
        category: tpl.category,
        title: tpl.title,
        subtitle: tpl.subtitle,
        rewards: tpl.rewards,
        state: "reward_claimed",
      });
    } else {
      result.push({
        id: tpl.id,
        kind: tpl.kind,
        category: tpl.category,
        title: tpl.title,
        subtitle: tpl.subtitle,
        rewards: tpl.rewards,
        state: "active",
        progress: tpl.defaultProgress,
      });
    }
  }
  return result;
}
