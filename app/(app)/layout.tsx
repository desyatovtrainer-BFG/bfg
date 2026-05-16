import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { ensureBfgProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase";
import { BottomNav } from "../components/dashboard/bottom-nav";

/**
 * Guard для всех приватных экранов BFG:
 * dashboard, avatar, progress, quests, workouts, companion, profile.
 *
 * Незалогиненных уводим на /login. Никакой кастомной логики — простой
 * server-side check; ниже по дереву можно полагаться на наличие сессии
 * (плюс RLS в Supabase как второй рубеж).
 */
export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Ленивое создание BFG-профиля и аватара: страхуем кейс, когда signUp
  // прошёл с email confirmation и строки не успели создаться сразу,
  // а также бэкфилим старых пользователей без avatars. Вызов идемпотентный
  // (select → insert), поэтому стоит копейки. Ошибки логируем, но рендер
  // не блокируем — иначе залогиненный юзер не увидит вообще ничего.
  const supabase = await createSupabaseServerClient();
  const { error: ensureError } = await ensureBfgProfile(supabase, user);
  if (ensureError) {
    console.error("[AppShellLayout] ensureBfgProfile failed", ensureError);
  }

  return (
    <div className="relative min-h-dvh bg-black text-zinc-100">
      {children}
      <BottomNav />
    </div>
  );
}
