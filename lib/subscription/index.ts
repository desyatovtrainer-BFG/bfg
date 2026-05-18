/**
 * Подписка BFG — единая точка входа.
 *
 *   import {
 *     getCurrentSubscription,
 *     hasPremiumAccess,
 *     computeSubscriptionState,
 *   } from "@/lib/subscription";
 *
 * Внутри:
 *   - types.ts             — типы (provider-agnostic).
 *   - state.ts             — чистая функция расчёта состояния + TRIAL_DURATION_DAYS.
 *   - get-subscription.ts  — серверные геттеры (профиль текущего юзера / по id).
 *   - access.ts            — гейтинг (`hasPremiumAccess`, `requirePremium`).
 */

export type {
  SubscriptionRow,
  SubscriptionState,
  SubscriptionStatus,
} from "./types";

export { TRIAL_DURATION_DAYS, computeSubscriptionState } from "./state";

export {
  getCurrentSubscription,
  getSubscriptionForUser,
} from "./get-subscription";

export { hasPremiumAccess, requirePremium } from "./access";
