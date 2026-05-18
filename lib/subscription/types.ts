/**
 * Типы подписки BFG.
 *
 * Намеренно provider-agnostic: ни одного поля от Stripe / ЮKassa / Tinkoff.
 * Когда подключим конкретный российский эквайринг, провайдер будет только
 * проставлять `subscription_status = "active"` и `subscription_expires_at`.
 */

export type SubscriptionStatus = "free_trial" | "active" | "expired";

/** То, что лежит в `public.profiles` (см. 0003_subscription.sql). */
export type SubscriptionRow = {
  subscription_status: SubscriptionStatus | null;
  trial_started_at: string | null;
  subscription_expires_at: string | null;
};

/** Производное состояние, которое использует приложение. */
export type SubscriptionState = {
  status: SubscriptionStatus;
  /** true для free_trial и active, false для expired. */
  isPremium: boolean;
  /** Сколько дней триала осталось (>=0). 0 если подписка `active` или `expired`. */
  trialDaysLeft: number;
  /** Дата окончания триала (start + 30 дней) или null, если не на триале. */
  trialEndsAt: Date | null;
  /** Срок действия оплаченной подписки или null. */
  subscriptionExpiresAt: Date | null;
};
