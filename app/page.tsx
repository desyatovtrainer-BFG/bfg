import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { OnboardingScreen } from "./components/onboarding-screen";

/**
 * Корневой роут `/`.
 *
 * Поведение:
 *  - залогиненного юзера сразу уводим на `/dashboard`
 *    (онбординг ему уже не нужен — путь начат);
 *  - незалогиненный остаётся на онбординге, откуда сам выбирает
 *    «Старт» (→ /dashboard, далее app-layout редиректнёт на /login)
 *    или «Есть аккаунт» (→ /profile / login).
 *
 * Серверный компонент: проверка сессии должна происходить до отрисовки,
 * чтобы не было «мигания» онбординга у уже залогиненного пользователя.
 */
export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return <OnboardingScreen />;
}
