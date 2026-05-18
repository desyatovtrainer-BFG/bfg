import type { Metadata } from "next";
import { WorkoutsScreen } from "@/app/components/workouts/workouts-screen";
import { listActiveWorkouts } from "@/lib/workouts";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Тренировки — BFG",
};

/**
 * Каталог тренировок берём из Supabase (таблица `workouts`).
 * Страница — server component, чтобы не таскать данные через клиент
 * и чтобы RLS отрабатывала под сессией текущего юзера.
 *
 * Если миграция 0004_workouts.sql ещё не применена — список будет
 * пустым, и экран покажет спокойное empty-state без падений.
 */
export default async function WorkoutsPage() {
  const supabase = await createSupabaseServerClient();
  const workouts = await listActiveWorkouts(supabase);
  return <WorkoutsScreen workouts={workouts} />;
}
