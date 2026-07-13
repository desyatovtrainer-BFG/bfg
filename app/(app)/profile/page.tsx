import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getOnboardingState } from "@/lib/onboarding";
import { getCurrentSubscription } from "@/lib/subscription";
import { createSupabaseServerClient } from "@/lib/supabase";
import { ProfileScreen } from "../../components/profile/profile-screen";

export const metadata: Metadata = {
  title: "Профиль — BFG",
};

/**
 * Серверная сборка Профиля (D086, слайс 16 — реальные данные онбординга).
 *
 * Данные: почта из текущей сессии; подписка — существующим helper-ом
 * getCurrentSubscription; поля онбординга (цель/уровень/место/частота/
 * формат, имя/направление — D079/D080) — существующим loader-ом
 * getOnboardingState по канонической схеме (profiles.* + avatars.name,
 * миграция 0012). Null-поля легаси-аккаунтов — честное «Не указано»
 * в экране, без редиректа в онбординг и без записи дефолтов.
 * Никаких новых таблиц/миграций.
 */
type ProfilePageProps = {
  /** ?returnTo=/progress — внутренний путь экрана-источника для «Назад». */
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await getCurrentUser();
  const subscription = await getCurrentSubscription();
  const sp = await searchParams;

  // Layout-гард уже отрезает анонимов; fallback — страховка гонки сессии.
  const onboarding = user
    ? await getOnboardingState(await createSupabaseServerClient(), user.id)
    : null;

  return (
    <ProfileScreen
      email={user?.email ?? null}
      subscription={subscription}
      goals={onboarding?.goals ?? []}
      fitnessLevel={onboarding?.fitnessLevel ?? null}
      trainingFormat={onboarding?.trainingFormat ?? null}
      weeklyFrequency={onboarding?.weeklyFrequency ?? null}
      trainingStructure={onboarding?.trainingStructure ?? null}
      avatarName={onboarding?.avatarName ?? null}
      sex={onboarding?.sex ?? null}
      backHref={sanitizeReturnTo(sp?.returnTo)}
    />
  );
}

/**
 * Санитизация returnTo против open-redirect: допускаем только внутренние
 * пути приложения ("/..."), отклоняя внешние/протокольные/протокол-
 * относительные ("//host") и с backslash-трюками. Иначе — /dashboard.
 */
function sanitizeReturnTo(raw: string | undefined): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  if (raw.includes("\\") || raw.includes(":")) return "/dashboard";
  return raw;
}
