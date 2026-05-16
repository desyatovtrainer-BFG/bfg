/**
 * Чистые helper-функции уровня и XP. Без БД, без сайд-эффектов —
 * чтобы можно было звать и на сервере, и в UI, и в тестах.
 *
 * Кривая роста сознательно мягкая: первые уровни даются легко
 * (это эмоциональный onboarding), дальше — линейно тяжелее. Никакой
 * экспоненты, никакой инфляции — соответствует PROGRESSION_SYSTEM.md
 * («XP должен ощущаться значимым, не grind»).
 */

/** Сколько суммарного XP нужно, чтобы быть НА уровне `level`. Level 1 = 0. */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  // Линейно растущая стоимость следующего уровня:
  //   level 1 → 2 : 100 XP
  //   level 2 → 3 : 150 XP
  //   level 3 → 4 : 200 XP
  // Сумма арифметической прогрессии = 100*(n-1) + 25*(n-1)*(n-2).
  const n = level - 1;
  return 100 * n + 25 * n * (n - 1);
}

/** Уровень, на котором находится пользователь с данным суммарным XP. */
export function calculateLevel(totalXp: number): number {
  if (totalXp <= 0) return 1;
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXp) {
    level += 1;
    // Жёсткий предохранитель — всё равно не должны сюда дойти.
    if (level > 999) break;
  }
  return level;
}

export type LevelProgress = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  /** 0..1 — для прогресс-бара. На максимально достигнутом уровне = 1. */
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
