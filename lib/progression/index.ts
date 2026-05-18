/**
 * Единая точка входа в прогрессию BFG.
 *
 *   import { awardXp, calculateLevel, XP_REWARDS } from "@/lib/progression";
 *
 * Внутри:
 *   - levels.ts            — чистая математика XP/уровня
 *   - xp-rewards.ts        — таблица наград (баланс в одном месте)
 *   - avatar-evolution.ts  — лестница стадий аватара по уровню
 *   - award-xp.ts          — серверный апдейт profiles/avatars
 *   - streak.ts            — серия активных дней (touchStreak)
 */

export {
  calculateLevel,
  getLevelProgress,
  xpRequiredForLevel,
  type LevelProgress,
} from "./levels";

export { XP_REWARDS, getXpReward, type XpRewardSource } from "./xp-rewards";

export {
  getAvatarAuraLabel,
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getAvatarStageFlavor,
  hasEvolved,
  type AvatarEvolution,
} from "./avatar-evolution";

export { awardXp, type AwardXpInput, type AwardXpResult } from "./award-xp";

export {
  touchStreak,
  todayUtcISO,
  yesterdayOf,
  type StreakUpdate,
} from "./streak";
