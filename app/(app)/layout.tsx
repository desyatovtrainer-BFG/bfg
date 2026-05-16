import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
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

  return (
    <div className="relative min-h-dvh bg-black text-zinc-100">
      {children}
      <BottomNav />
    </div>
  );
}
