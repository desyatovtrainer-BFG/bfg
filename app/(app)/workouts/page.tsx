import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  buildDailyQuestList,
  getTodayCompletedQuestIds,
  selectDailyQuestIds,
  todayISO,
} from "@/lib/quests";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getActiveWorkoutSession } from "@/lib/workout-sessions";
import { listActiveWorkouts } from "@/lib/workouts";
import {
  ActivityScreen,
  type ActivityWorkoutItem,
} from "../../components/activity/activity-screen";

export const metadata: Metadata = {
  title: "Активность — BFG",
};

/**
 * Серверная сборка Activity (D042–D059 — визуальная оболочка, слайс 6A).
 *
 * Данные (всё read-only, RLS «свои строки»):
 *   - тренировки: существующий listActiveWorkouts (порядок программы —
 *     display_order);
 *   - число упражнений: один select workout_id по активным
 *     workout_exercises, счёт в JS (карточке нужен Exercise Count, D068);
 *   - «Следующая» (D046/D051/D059): производная от последнего завершения
 *     в workout_completions — следующая по циклу от фактически
 *     завершённой; без завершений — Тренировка 1 (D059). Никакого нового
 *     состояния в БД;
 *   - квесты: существующая дневная подборка (D017) + закрытые сегодня.
 *
 * Состояние In Progress (зелёное) сознательно отложено: требует
 * session-состояния границ Start/Finish (D049/D050/D058) — слайс сессии.
 */
export default async function ActivityPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();

  const [workouts, exerciseCounts, lastCompletedId, completedQuestIds, activeSession] =
    await Promise.all([
      listActiveWorkouts(supabase),
      readExerciseCounts(supabase),
      user ? readLastCompletedWorkoutId(supabase, user.id) : Promise.resolve(null),
      user ? getTodayCompletedQuestIds(supabase, user.id) : Promise.resolve([]),
      user ? getActiveWorkoutSession(supabase, user.id) : Promise.resolve(null),
    ]);

  // Указатель цикла (D051): следующая — после фактически завершённой,
  // по порядку программы, с переходом по кругу (D046). Ноль завершений
  // или завершённая вне активного каталога → Тренировка 1 (D059).
  const lastIdx = lastCompletedId
    ? workouts.findIndex((w) => w.id === lastCompletedId)
    : -1;
  const upcomingIdx = workouts.length > 0 ? (lastIdx + 1) % workouts.length : -1;

  // D057: «В процессе» имеет абсолютный приоритет — пока есть активная
  // сессия, маркер «Следующая» не показывается нигде.
  const activeWorkoutId = activeSession?.workoutId ?? null;

  const items: ActivityWorkoutItem[] = workouts.map((workout, i) => ({
    workout,
    number: i + 1,
    exerciseCount: exerciseCounts.get(workout.id) ?? 0,
    isUpcoming: activeWorkoutId === null && i === upcomingIdx,
    isInProgress: workout.id === activeWorkoutId,
  }));

  // Дневная подборка — display-only без сессии; клейм всё равно серверный.
  const selectedIds = user ? selectDailyQuestIds(user.id, todayISO()) : [];
  const quests = buildDailyQuestList(selectedIds, completedQuestIds);

  return <ActivityScreen workouts={items} quests={quests} />;
}

/** Число активных упражнений по каждой тренировке (Exercise Count, D068). */
async function readExerciseCounts(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const { data, error } = await supabase
    .from("workout_exercises")
    .select("workout_id")
    .eq("is_active", true);
  if (error) {
    console.error("[ActivityPage] read exercise counts", error);
    return counts;
  }
  for (const row of data ?? []) {
    const id = String(row.workout_id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

/** Последняя фактически завершённая тренировка (для указателя D051). */
async function readLastCompletedWorkoutId(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("workout_completions")
    .select("workout_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[ActivityPage] read last completion", error);
    return null;
  }
  return data ? String(data.workout_id) : null;
}
