/**
 * Каталог косметических наград MVP.
 *
 * Идея (см. AVATAR_SYSTEM.md и PROGRESSION_SYSTEM.md):
 *   - косметика — это эмоциональная метка пути, не магазин;
 *   - всё открывается строго через прогресс (уровень/стадия эволюции);
 *   - нет валют, нет инвентаря, нет покупок.
 *
 * Каталог детерминирован: один и тот же level + stage всегда дают
 * один и тот же список «открыто/закрыто». Поэтому хранить отдельную
 * таблицу в Supabase не нужно — UI считает всё на лету из
 * `profiles.level` и `avatars.evolution_stage`.
 */

export type CosmeticRewardKind = "aura" | "title" | "mark";

export type CosmeticReward = {
  /** Стабильный id, не зависит от языка. */
  id: string;
  kind: CosmeticRewardKind;
  /** Локализованное имя для UI. */
  label: string;
  /** Короткое эмоциональное описание. */
  description: string;
  /** Требование разблокировки: минимальный уровень. */
  minLevel?: number;
  /** Требование разблокировки: минимальная стадия аватара (1..5). */
  minStage?: number;
};

/**
 * Варианты ауры. Привязаны к стадии аватара — это естественный мост
 * с уже существующей лестницей эволюции (см. avatar-evolution.ts).
 * Когда меняется стадия — у пользователя «расцветает» новая аура.
 */
export const AURA_REWARDS: ReadonlyArray<CosmeticReward> = [
  {
    id: "aura.soft",
    kind: "aura",
    label: "Мягкое свечение",
    description: "Первый свет внутри. Тихий, но устойчивый.",
    minStage: 1,
  },
  {
    id: "aura.focused",
    kind: "aura",
    label: "Сфокусированный свет",
    description: "Линии стали чётче. Намерение собрано в одну точку.",
    minStage: 2,
  },
  {
    id: "aura.radiant",
    kind: "aura",
    label: "Сияние",
    description: "Свет вышел за контур. Тебя видно даже в тишине.",
    minStage: 3,
  },
  {
    id: "aura.prismatic",
    kind: "aura",
    label: "Призматический свет",
    description: "Аура распадается на цвета. Ты звучишь шире.",
    minStage: 4,
  },
  {
    id: "aura.stellar",
    kind: "aura",
    label: "Звёздная аура",
    description: "Форма ровно горит. Путь стал твоей орбитой.",
    minStage: 5,
  },
];

/**
 * Визуальные титулы. Привязаны к уровню — это «именование пути».
 * Намеренно не привязываем к stage, чтобы между эволюциями тоже
 * случались маленькие эмоциональные события.
 */
export const TITLE_REWARDS: ReadonlyArray<CosmeticReward> = [
  {
    id: "title.spark",
    kind: "title",
    label: "Искра",
    description: "Ты сделал первый шаг. Этого уже достаточно.",
    minLevel: 1,
  },
  {
    id: "title.seeker",
    kind: "title",
    label: "Идущий",
    description: "Привычка нашла твой ритм.",
    minLevel: 3,
  },
  {
    id: "title.flowing",
    kind: "title",
    label: "В потоке",
    description: "Движение перестало быть усилием.",
    minLevel: 7,
  },
  {
    id: "title.keeper",
    kind: "title",
    label: "Хранитель пути",
    description: "Ты держишь линию, даже когда никто не смотрит.",
    minLevel: 12,
  },
  {
    id: "title.light",
    kind: "title",
    label: "Носитель света",
    description: "Твой ритм стал ориентиром.",
    minLevel: 20,
  },
  {
    id: "title.ascending",
    kind: "title",
    label: "Восходящий",
    description: "Путь продолжается, и ты его форма.",
    minLevel: 30,
  },
];

/**
 * Символические метки. Привязаны к стадии — это «знак» рядом с
 * аватаром, который накапливается с эволюцией. Простой SVG-глиф.
 */
export type CosmeticMark = CosmeticReward & {
  /** SVG path для маленькой иконки 24×24. */
  glyph: string;
};

export const MARK_REWARDS: ReadonlyArray<CosmeticMark> = [
  {
    id: "mark.spark",
    kind: "mark",
    label: "Метка искры",
    description: "Начало пути.",
    minStage: 1,
    glyph:
      "M12 3l1.6 4.7L18 9l-4.4 1.3L12 15l-1.6-4.7L6 9l4.4-1.3L12 3z",
  },
  {
    id: "mark.ring",
    kind: "mark",
    label: "Метка кольца",
    description: "Замкнутый круг привычки.",
    minStage: 2,
    glyph:
      "M12 4a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 110 10 5 5 0 010-10z",
  },
  {
    id: "mark.flow",
    kind: "mark",
    label: "Метка потока",
    description: "Движение без усилия.",
    minStage: 3,
    glyph:
      "M4 9c3 0 3 3 6 3s3-3 6-3 3 3 6 3v3c-3 0-3-3-6-3s-3 3-6 3-3-3-6-3V9zm0 6c3 0 3 3 6 3s3-3 6-3 3 3 6 3v-1c-3 0-3-3-6-3s-3 3-6 3-3-3-6-3v1z",
  },
  {
    id: "mark.star",
    kind: "mark",
    label: "Метка звезды",
    description: "Свет, ставший формой.",
    minStage: 4,
    glyph:
      "M12 2l2.6 6.3L21 9l-5 4.4L17.3 20 12 16.8 6.7 20 8 13.4 3 9l6.4-.7L12 2z",
  },
  {
    id: "mark.crown",
    kind: "mark",
    label: "Метка короны",
    description: "Орбита удержана.",
    minStage: 5,
    glyph:
      "M3 8l4 4 5-7 5 7 4-4-1 11H4L3 8zm2 13h14v2H5v-2z",
  },
];

export const COSMETIC_REWARDS: ReadonlyArray<CosmeticReward | CosmeticMark> = [
  ...AURA_REWARDS,
  ...TITLE_REWARDS,
  ...MARK_REWARDS,
];
