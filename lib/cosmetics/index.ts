/**
 * Косметические награды BFG (MVP).
 *
 * Принципы:
 *   - всё открывается только через прогресс (уровень/стадия аватара);
 *   - никаких платежей, маркетов, валюты;
 *   - детерминированный расчёт без отдельной БД-таблицы.
 *
 *   import {
 *     getUnlockedCosmetics,
 *     type UnlockedCosmetics,
 *   } from "@/lib/cosmetics";
 */

export {
  AURA_REWARDS,
  COSMETIC_REWARDS,
  MARK_REWARDS,
  TITLE_REWARDS,
  type CosmeticMark,
  type CosmeticReward,
  type CosmeticRewardKind,
} from "./catalog";

export {
  getUnlockedCosmetics,
  type UnlockableCosmetic,
  type UnlockedCosmetics,
} from "./get-unlocked";
