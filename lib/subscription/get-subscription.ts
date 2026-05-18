import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth/get-user";
import { createSupabaseServerClient } from "@/lib/supabase";
import { computeSubscriptionState } from "./state";
import type { SubscriptionRow, SubscriptionState } from "./types";

/**
 * Серверный helper: вернуть состояние подписки текущего пользователя.
 *
 * Если юзер не залогинен или строки в `profiles` ещё нет — отдаём дефолт
 * (свежий триал «начинающийся сейчас»). Это безопасно: layout-гард всё равно
 * отрежет анонимов, а `ensureBfgProfile` создаст строку при следующем заходе.
 */
export async function getCurrentSubscription(): Promise<SubscriptionState> {
  const user = await getCurrentUser();
  if (!user) return computeSubscriptionState(null);

  const supabase = await createSupabaseServerClient();
  return getSubscriptionForUser(supabase, user.id);
}

/**
 * Тот же расчёт, но для произвольного user_id и переданного клиента —
 * удобно, когда supabase-клиент уже создан выше по стеку (см. dashboard).
 */
export async function getSubscriptionForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionState> {
  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status, trial_started_at, subscription_expires_at")
    .eq("id", userId)
    .maybeSingle<SubscriptionRow>();

  if (error) {
    console.error("[getSubscriptionForUser] read profile", error);
    return computeSubscriptionState(null);
  }

  return computeSubscriptionState(data);
}
