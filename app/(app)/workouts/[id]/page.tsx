import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkoutFlow } from "@/app/components/workouts/workout-flow";
import {
  getExerciseVideoEmbedUrl,
  getWorkoutById,
  getWorkoutWithExercises,
} from "@/lib/workouts";
import { getCurrentUser } from "@/lib/auth/get-user";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getActiveWorkoutSession } from "@/lib/workout-sessions";

type SessionPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: SessionPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const workout = await getWorkoutById(supabase, id);
  if (!workout) return { title: "Тренировка — BFG" };
  return { title: `${workout.title} — BFG` };
}

/**
 * Экран одной тренировки (сессия).
 *
 * Тренировка теперь — это последовательность упражнений (см. миграцию
 * 0005). Тянем шапку + список активных упражнений одним composer-ом;
 * RLS не пустит к чужим/неактивным. 404 для битых/неактивных id.
 *
 * Embed-URL по каждому упражнению считаем на сервере, чтобы клиент не
 * тащил видео-хелперы и плеер не ререндерился при смене состояния сессии.
 */
export default async function WorkoutSessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const data = await getWorkoutWithExercises(supabase, id);
  if (!data) {
    notFound();
  }

  const { workout, exercises } = data;
  const exercisesWithEmbed = exercises.map((exercise) => ({
    exercise,
    embedUrl: getExerciseVideoEmbedUrl(exercise),
  }));

  // 7B: источник правды «В процессе» — серверная сессия (D058), не UI-state.
  const user = await getCurrentUser();
  const activeSession = user ? await getActiveWorkoutSession(supabase, user.id) : null;

  // Маршрут открывается Экраном старта (D062); сессия-слайдер запускается
  // кнопкой «Начать тренировку» (граница старта, D049) либо «Вернуться
  // к тренировке», если эта тренировка уже активна.
  return (
    <WorkoutFlow
      workout={workout}
      exercises={exercisesWithEmbed}
      activeWorkoutId={activeSession?.workoutId ?? null}
    />
  );
}
