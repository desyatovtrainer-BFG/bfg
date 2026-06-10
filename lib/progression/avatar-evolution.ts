/**
 * Триггеры эволюции аватара.
 *
 * Правило (D010/D011, docs/BFG_PRODUCT_DECISIONS.md): эволюция должна
 * ощущаться плавной и заработанной. Поэтому стадия аватара = функция от
 * уровня, а не отдельная экономика. Один источник истины: уровень растёт →
 * аватар меняет ауру, форму и яркость свечения.
 *
 * Лестница: 10 стадий, пороги — квадраты уровней (stage N начинается на
 * уровне N²): 1 / 4 / 9 / 16 / 25 / 36 / 49 / 64 / 81 / 100.
 * Стадия 10 — финальная вертикальная эволюция.
 *
 * Это чистый helper. Сам апдейт строки `avatars` делает `awardXp`
 * (или будущий avatar-сервис) — здесь только описание стадий.
 *
 * ВРЕМЕННО: имена форм/аур и подписи стадий 2–10 — плейсхолдеры
 * (`stage2`…`stage10`). Финальные имена не утверждены; при утверждении
 * меняется только этот файл — awardXp выровняет строки в БД при следующем
 * начислении XP (reconciliation), плюс запланирован pre-launch reset.
 */

export type AvatarEvolution = {
  stage: number;
  /** 1..10 — насколько ярко светится. Совпадает со stage для простоты. */
  glowIntensity: number;
  form: string;
  aura: string;
};

const EVOLUTION_LADDER: ReadonlyArray<{ minLevel: number } & AvatarEvolution> = [
  { minLevel: 1, stage: 1, form: "starter", aura: "soft_glow", glowIntensity: 1 },
  { minLevel: 4, stage: 2, form: "stage2", aura: "aura2", glowIntensity: 2 },
  { minLevel: 9, stage: 3, form: "stage3", aura: "aura3", glowIntensity: 3 },
  { minLevel: 16, stage: 4, form: "stage4", aura: "aura4", glowIntensity: 4 },
  { minLevel: 25, stage: 5, form: "stage5", aura: "aura5", glowIntensity: 5 },
  { minLevel: 36, stage: 6, form: "stage6", aura: "aura6", glowIntensity: 6 },
  { minLevel: 49, stage: 7, form: "stage7", aura: "aura7", glowIntensity: 7 },
  { minLevel: 64, stage: 8, form: "stage8", aura: "aura8", glowIntensity: 8 },
  { minLevel: 81, stage: 9, form: "stage9", aura: "aura9", glowIntensity: 9 },
  { minLevel: 100, stage: 10, form: "stage10", aura: "aura10", glowIntensity: 10 },
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
 *
 * ВРЕМЕННО: подписи stage2–stage10 — плейсхолдеры до утверждения имён.
 * Старые ключи (awakened и т.д.) оставлены для строк БД, записанных до
 * pre-launch reset — graceful-отображение, не источник истины.
 */
const AVATAR_FORM_LABEL_RU: Record<string, string> = {
  starter: "Искра пути",
  stage2: "Стадия 2",
  stage3: "Стадия 3",
  stage4: "Стадия 4",
  stage5: "Стадия 5",
  stage6: "Стадия 6",
  stage7: "Стадия 7",
  stage8: "Стадия 8",
  stage9: "Стадия 9",
  stage10: "Стадия 10",
  // legacy-значения (до reset) — старая 5-ступенчатая лестница
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
 *
 * ВРЕМЕННО: aura2–aura10 — плейсхолдеры до утверждения имён.
 */
const AVATAR_AURA_LABEL_RU: Record<string, string> = {
  soft_glow: "Мягкое свечение",
  aura2: "Аура второй стадии",
  aura3: "Аура третьей стадии",
  aura4: "Аура четвёртой стадии",
  aura5: "Аура пятой стадии",
  aura6: "Аура шестой стадии",
  aura7: "Аура седьмой стадии",
  aura8: "Аура восьмой стадии",
  aura9: "Аура девятой стадии",
  aura10: "Аура десятой стадии",
  // legacy-значения (до reset)
  focused_glow: "Сфокусированный свет",
  radiant_glow: "Сияние",
  prismatic_glow: "Призматический свет",
  stellar_glow: "Звёздная аура",
};

export function getAvatarAuraLabel(aura: string): string {
  return AVATAR_AURA_LABEL_RU[aura] ?? aura;
}

/**
 * Короткие эмоциональные подписи к стадиям. Не «лор», а ощущение.
 * Маппинг по номеру стадии (1..10).
 *
 * ВРЕМЕННО: тексты стадий 2–10 — нейтральные плейсхолдеры до утверждения
 * финального флейвора; стадия 1 сохраняет утверждённый текст.
 */
const AVATAR_STAGE_FLAVOR_RU: Record<number, string> = {
  1: "Искра только зажглась. Каждый шаг закрепляет твой путь.",
  2: "Форма меняется. Путь продолжается.",
  3: "Форма меняется. Путь продолжается.",
  4: "Форма меняется. Путь продолжается.",
  5: "Форма меняется. Путь продолжается.",
  6: "Форма меняется. Путь продолжается.",
  7: "Форма меняется. Путь продолжается.",
  8: "Форма меняется. Путь продолжается.",
  9: "Форма меняется. Путь продолжается.",
  10: "Форма меняется. Путь продолжается.",
};

export function getAvatarStageFlavor(stage: number): string {
  return (
    AVATAR_STAGE_FLAVOR_RU[stage] ??
    "Эволюция продолжается. Каждый день — это новое движение."
  );
}
