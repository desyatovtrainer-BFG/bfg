import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { EntryScreen } from "./components/entry/entry-screen";

/**
 * Корневой роут `/` — Entry / Auth Start (D074).
 *
 * Поведение:
 *  - авторизованный пользователь сразу уводится на `/dashboard`
 *    (Entry — только неавторизованная поверхность);
 *  - неавторизованный видит спокойный Entry-экран: Seed Form,
 *    единственный primary CTA → /signup и тихая ссылка → /login.
 *
 * Серверный компонент: проверка сессии происходит до отрисовки,
 * чтобы не было «мигания» Entry у уже вошедшего пользователя.
 */
export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return <EntryScreen />;
}
