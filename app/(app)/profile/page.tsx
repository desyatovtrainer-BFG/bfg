import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getCurrentSubscription } from "@/lib/subscription";
import { ProfileScreen } from "../../components/profile/profile-screen";

export const metadata: Metadata = {
  title: "Профиль — BFG",
};

/**
 * Серверная сборка Профиля (D086 — структура, слайс 5A).
 *
 * Данные: почта из текущей сессии, состояние подписки — существующим
 * helper-ом getCurrentSubscription. Поля онбординга (цель/уровень/место/
 * частота/формат, имя/направление аватара — D079/D080) в схеме ещё не
 * существуют → строки рендерятся спокойными плейсхолдерами; их
 * персистентность и D084-редактирование подключаются после слайса
 * Онбординга. Никаких новых таблиц/миграций в этом слайсе.
 */
type ProfilePageProps = {
  /** ?returnTo=/progress — внутренний путь экрана-источника для «Назад». */
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await getCurrentUser();
  const subscription = await getCurrentSubscription();
  const sp = await searchParams;

  return (
    <ProfileScreen
      email={user?.email ?? null}
      subscription={subscription}
      avatarName={null}
      directionLabel={null}
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
