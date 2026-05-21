/**
 * Триггеры эволюции аватара.
 *
 * MVP-правило (см. AVATAR_SYSTEM.md): эволюция должна ощущаться плавной
 * и заработанной. Поэтому стадия аватара = функция от уровня, а не
 * отдельная экономика. Один источник истины: уровень растёт → аватар
 * меняет ауру, форму и яркость свечения.
 *
 * Это чистый helper. Сам апдейт строки `avatars` делает `awardXp`
 * (или будущий avatar-сервис) — здесь только описание стадий.
 */

export type AvatarEvolution = {
  stage: number;
  form: string;
  aura: string;
  /** 1..5 — насколько ярко светится. Совпадает с stage для простоты. */
  glowIntensity: number;
};

/**
 * Лестница стадий. Намеренно короткая (5 шагов на MVP) — чтобы каждое
 * перевоплощение было заметным событием, а не косметической мелочью.
 * Пороги по уровню: 1 / 5 / 10 / 20 / 35.
 */
const EVOLUTION_LADDER: ReadonlyArray<{ minLevel: number } & AvatarEvolution> = [
  { minLevel: 1, stage: 1, form: "starter", aura: "soft_glow", glowIntensity: 1 },
  { minLevel: 5, stage: 2, form: "awakened", aura: "focused_glow", glowIntensity: 2 },
  { minLevel: 10, stage: 3, form: "attuned", aura: "radiant_glow", glowIntensity: 3 },
  { minLevel: 20, stage: 4, form: "ascendant", aura: "prismatic_glow", glowIntensity: 4 },
  { minLevel: 35, stage: 5, form: "transcendent", aura: "stellar_glow", glowIntensity: 5 },
];

/** Какая стадия аватара соответствует данному уровню. */
export function getAvatarEvolutionForLevel(level: number): AvatarEvolution {
  let current = EVOLUTION_LADDER[0]!;
  for (const tier of EVOLUTION_LADDER) {
    if (level >= tier.minLevel) current = tier;
  }
  const { stage, form, aura, glowIntensity } = current;
  return { stage, form, aura, glowIntensity };
}

/**
 * Произошла ли эволюция между двумя уровнями. Используется awardXp,
 * чтобы решить, стоит ли трогать таблицу `avatars` и/или показывать
 * пользователю эмоциональный момент эволюции.
 */
export function hasEvolved(previousLevel: number, newLevel: number): boolean {
  return getAvatarEvolutionForLevel(previousLevel).stage !==
    getAvatarEvolutionForLevel(newLevel).stage;
}

export type EvolutionProgress = {
  current: AvatarEvolution;
  /** null, если current — уже последняя стадия лестницы. */
  next: AvatarEvolution | null;
  /** 0..100 — прогресс между порогами текущей и следующей стадии. На максимуме = 100. */
  progressPercent: number;
};

/**
 * Прогресс эволюции для UI: где между current и next стадиями находится игрок
 * по своему текущему `level`. Чистая функция от уровня — поэтому годится
 * и для серверного рендера, и для тестов, и для будущих recomputation-задач.
 */
export function getEvolutionProgress(level: number): EvolutionProgress {
  let currentIdx = 0;
  for (let i = 0; i < EVOLUTION_LADDER.length; i += 1) {
    if (level >= EVOLUTION_LADDER[i]!.minLevel) currentIdx = i;
  }
  const currentTier = EVOLUTION_LADDER[currentIdx]!;
  const nextTier = EVOLUTION_LADDER[currentIdx + 1];

  const current: AvatarEvolution = {
    stage: currentTier.stage,
    form: currentTier.form,
    aura: currentTier.aura,
    glowIntensity: currentTier.glowIntensity,
  };

  if (!nextTier) {
    return { current, next: null, progressPercent: 100 };
  }

  const span = nextTier.minLevel - currentTier.minLevel;
  const into = Math.max(0, level - currentTier.minLevel);
  const progressPercent =
    span <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((into / span) * 100)));

  return {
    current,
    next: {
      stage: nextTier.stage,
      form: nextTier.form,
      aura: nextTier.aura,
      glowIntensity: nextTier.glowIntensity,
    },
    progressPercent,
  };
}

/**
 * Русские подписи стадий — UI рисует их рядом с аватаром.
 * Маппинг по `form`, чтобы не зависеть от номера стадии при правках лестницы.
 */
const AVATAR_FORM_LABEL_RU: Record<string, string> = {
  starter: "Искра пути",
  awakened: "Пробуждение",
  attuned: "Поток силы",
  ascendant: "Восхождение",
  transcendent: "Превосходство",
};

export function getAvatarFormLabel(form: string): string {
  return AVATAR_FORM_LABEL_RU[form] ?? form;
}

/**
 * Русские подписи аур. Маппинг по строке из БД, чтобы UI говорил
 * «Сияние», а не «radiant_glow».
 */
const AVATAR_AURA_LABEL_RU: Record<string, string> = {
  soft_glow: "Мягкое свечение",
  focused_glow: "Сфокусированный свет",
  radiant_glow: "Сияние",
  prismatic_glow: "Призматический свет",
  stellar_glow: "Звёздная аура",
};

export function getAvatarAuraLabel(aura: string): string {
  return AVATAR_AURA_LABEL_RU[aura] ?? aura;
}

/**
 * Короткие эмоциональные подписи к стадиям. Не «лор», а ощущение —
 * AVATAR_SYSTEM.md: эволюция должна чувствоваться, а не объясняться.
 * Маппинг по номеру стадии, потому что это естественная шкала
 * (1..5) и не ломается, если в `avatars` где-то рассинхронизирован `form`.
 */
const AVATAR_STAGE_FLAVOR_RU: Record<number, string> = {
  1: "Искра только зажглась. Каждый шаг закрепляет твой путь.",
  2: "Свет внутри становится устойчивым. Тело учится слышать намерение.",
  3: "Ты входишь в поток. Сила стала привычкой.",
  4: "Образ становится ярче. Ты узнаваем по движению.",
  5: "Твоя форма звучит как звезда. Путь продолжается.",
};

export function getAvatarStageFlavor(stage: number): string {
  return (
    AVATAR_STAGE_FLAVOR_RU[stage] ??
    "Эволюция продолжается. Каждый день — это новое движение."
  );
}
