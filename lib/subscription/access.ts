import { redirect } from "next/navigation";
import { getCurrentSubscription } from "./get-subscription";
import type { SubscriptionState } from "./types";

/**
 * Гейтинг премиум-фич. Намеренно тонкий слой поверх `getCurrentSubscription`:
 * UI-слою хватает одной булевой проверки, а серверные действия могут
 * звать `requirePremium()` и доверять результату.
 *
 * Сейчас фич за пейволлом нет — это фундамент, чтобы потом просто
 * обернуть нужные action-ы / route-ы одной строкой.
 */
export async function hasPremiumAccess(): Promise<boolean> {
  const state = await getCurrentSubscription();
  return state.isPremium;
}

/**
 * Если подписка истекла — отправляем на /profile (там показывается статус).
 * Маршрут специально хардкодим, а не выносим в env: один помощник, одно место,
 * легко поменяем, когда появится отдельный экран /subscription.
 */
export async function requirePremium(): Promise<SubscriptionState> {
  const state = await getCurrentSubscription();
  if (!state.isPremium) {
    redirect("/profile");
  }
  return state;
}
