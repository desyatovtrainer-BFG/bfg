import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/app/components/onboarding/onboarding-flow";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getOnboardingState } from "@/lib/onboarding";
import { ensureBfgProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Начало пути — BFG",
};

/**
 * /onboarding — pre-app поверхность (D078, §23): вне (app)-группы,
 * без нижней навигации.
 *
 * Гварды:
 *   - неавторизованный → /login;
 *   - завершённый онбординг → /dashboard (повторного прохода нет —
 *     правки позже в Профиле, D080);
 *   - незавершённый → поток с резюмом с раннего неотвеченного экрана.
 *
 * D077 (OTP-гейт) сознательно ещё НЕ здесь: signup → onboarding напрямую —
 * временное отклонение rebuild-ветки; точка вставки гейта сохранена.
 */
export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Страховка: строки profiles/avatars могли ещё не создаться
  // (signup с подтверждением почты) — bootstrap идемпотентен.
  const { error: ensureError } = await ensureBfgProfile(supabase, user);
  if (ensureError) {
    console.error("[OnboardingPage] ensureBfgProfile", ensureError);
  }

  const state = await getOnboardingState(supabase, user.id);
  if (state.screen === "done") {
    redirect("/dashboard");
  }

  return <OnboardingFlow initial={state} />;
}
