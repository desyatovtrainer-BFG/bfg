/**
 * Источники и размеры XP-наград MVP.
 *
 * Держим в одном месте, чтобы баланс правился без поиска по коду.
 * Числа — намеренно небольшие и круглые: PROGRESSION_SYSTEM.md просит
 * избегать инфляции и «ощущения гринда».
 */

export const XP_REWARDS = {
  /** Завершён воркаут — главный «удар» XP за день. */
  WORKOUT_COMPLETE: 100,
  /** Закрыт ежедневный квест. */
  DAILY_QUEST: 50,
  /** Просто зашёл и забрал ежедневную награду. */
  DAILY_LOGIN: 20,
  /** Бонус за поддержание серии (поверх дневной награды). */
  STREAK_BONUS: 50,
  /** Эмоциональная веха (первый воркаут, возвращение и т.п.). */
  MILESTONE: 75,
} as const;

export type XpRewardSource = keyof typeof XP_REWARDS;

/** Удобный getter — на случай, если позже захотим динамический баланс. */
export function getXpReward(source: XpRewardSource): number {
  return XP_REWARDS[source];
}
