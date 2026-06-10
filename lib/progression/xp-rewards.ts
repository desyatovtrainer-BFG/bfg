/**
 * Источники и размеры XP-наград MVP.
 *
 * Держим в одном месте, чтобы баланс правился без поиска по коду.
 * Значения — по принятым решениям D015/D016 (docs/BFG_PRODUCT_DECISIONS.md):
 * тренировка — главный источник прогрессии, квесты — поддержка.
 * XP ежедневных квестов задаётся в каталоге (lib/quests/daily-quests.ts),
 * в диапазоне 3–5 XP за квест.
 */

export const XP_REWARDS = {
  /** Завершён воркаут — главный источник XP (D015). */
  WORKOUT_COMPLETE: 10,
  /**
   * Эмоциональная веха (первый воркаут, возвращение и т.п.).
   * Не подключено ни к одному действию. Значение будет определено вместе
   * с onboarding-милстоуном D014 (P1) — не использовать до этого решения.
   */
  MILESTONE: 75,
} as const;

export type XpRewardSource = keyof typeof XP_REWARDS;

/** Удобный getter — на случай, если позже захотим динамический баланс. */
export function getXpReward(source: XpRewardSource): number {
  return XP_REWARDS[source];
}
