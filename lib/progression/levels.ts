/**
 * Чистые helper-функции уровня и XP. Без БД, без сайд-эффектов —
 * чтобы можно было звать и на сервере, и в UI, и в тестах.
 *
 * Экономика по принятым решениям D012/D013 (docs/BFG_PRODUCT_DECISIONS.md):
 * каждый уровень стоит ровно 50 XP, стоимость не растёт. Вертикальных
 * уровней ровно 100 — уровень 100 совпадает со стадией 10 и закрывает
 * вертикальную прогрессию (дальше — горизонтальные системы, не уровни).
 */

/** Стоимость одного уровня (D013). */
const XP_PER_LEVEL = 50;

/** Последний вертикальный уровень (D012). */
const MAX_LEVEL = 100;

/** Сколько суммарного XP нужно, чтобы быть НА уровне `level`. Level 1 = 0. */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return XP_PER_LEVEL * (Math.min(level, MAX_LEVEL) - 1);
}

/** Уровень, на котором находится пользователь с данным суммарным XP. */
export function calculateLevel(totalXp: number): number {
  if (totalXp <= 0) return 1;
  return Math.min(MAX_LEVEL, Math.floor(totalXp / XP_PER_LEVEL) + 1);
}

export type LevelProgress = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  /** 0..1 — для прогресс-бара. На максимальном уровне = 1. */
  progress: number;
};

/** Прогресс внутри текущего уровня — то, что рисует UI прогресс-бара. */
export function getLevelProgress(totalXp: number): LevelProgress {
  const level = calculateLevel(totalXp);
  const currentLevelXp = xpRequiredForLevel(level);
  const nextLevelXp = xpRequiredForLevel(level + 1);
  const xpForNextLevel = nextLevelXp - currentLevelXp;
  const xpIntoLevel = Math.max(0, totalXp - currentLevelXp);
  const progress = xpForNextLevel === 0 ? 1 : Math.min(1, xpIntoLevel / xpForNextLevel);
  return { level, xpIntoLevel, xpForNextLevel, progress };
}
