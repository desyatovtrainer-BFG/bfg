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
