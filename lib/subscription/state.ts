import type {
  SubscriptionRow,
  SubscriptionState,
  SubscriptionStatus,
} from "./types";

/** Длительность бесплатного триала. */
export const TRIAL_DURATION_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Чистая функция: по строке профиля и текущему времени вычисляет
 * реальное состояние подписки.
 *
 * Почему не верим колонке `subscription_status` напрямую:
 * у free_trial срок неявный (30 дней от `trial_started_at`), у active —
 * хранится в `subscription_expires_at`. БД сама себя по времени не двигает,
 * поэтому факт «триал закончился» определяем здесь, при чтении.
 *
 * Когда подключим российский эквайринг, провайдер будет ставить
 * `subscription_status = "active"` и `subscription_expires_at`. Эта функция
 * сама поймёт, когда срок истёк, и вернёт `expired`.
 */
export function computeSubscriptionState(
  row: Partial<SubscriptionRow> | null | undefined,
  now: Date = new Date(),
): SubscriptionState {
  const rawStatus = (row?.subscription_status ?? "free_trial") as SubscriptionStatus;

  const trialStart = parseDate(row?.trial_started_at) ?? now;
  const trialEndsAt = new Date(trialStart.getTime() + TRIAL_DURATION_DAYS * DAY_MS);
  const subscriptionExpiresAt = parseDate(row?.subscription_expires_at);

  // 1) Оплаченная подписка. Если срок не истёк — premium активен.
  if (rawStatus === "active") {
    if (!subscriptionExpiresAt || subscriptionExpiresAt.getTime() > now.getTime()) {
      return {
        status: "active",
        isPremium: true,
        trialDaysLeft: 0,
        trialEndsAt: null,
        subscriptionExpiresAt,
      };
    }
    return {
      status: "expired",
      isPremium: false,
      trialDaysLeft: 0,
      trialEndsAt: null,
      subscriptionExpiresAt,
    };
  }

  // 2) Явно помеченный expired — не воскрешаем триалом.
  if (rawStatus === "expired") {
    return {
      status: "expired",
      isPremium: false,
      trialDaysLeft: 0,
      trialEndsAt: null,
      subscriptionExpiresAt,
    };
  }

  // 3) Триал. Сравниваем `now` с дедлайном.
  if (trialEndsAt.getTime() > now.getTime()) {
    const msLeft = trialEndsAt.getTime() - now.getTime();
    return {
      status: "free_trial",
      isPremium: true,
      trialDaysLeft: Math.max(0, Math.ceil(msLeft / DAY_MS)),
      trialEndsAt,
      subscriptionExpiresAt,
    };
  }

  return {
    status: "expired",
    isPremium: false,
    trialDaysLeft: 0,
    trialEndsAt,
    subscriptionExpiresAt,
  };
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
