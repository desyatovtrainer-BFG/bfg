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
export default async function ProfilePage() {
  const user = await getCurrentUser();
  const subscription = await getCurrentSubscription();

  return (
    <ProfileScreen
      email={user?.email ?? null}
      subscription={subscription}
      avatarName={null}
      directionLabel={null}
    />
  );
}
