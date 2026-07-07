import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { buildCompanionMessage } from "@/lib/companion";
import { emptyJourneyPointer, resolveJourneyPointer } from "@/lib/journey";
import {
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getLevelProgress,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import { listActiveWorkouts } from "@/lib/workouts";
import { HomeScreen } from "../../components/home/home-screen";

export const metadata: Metadata = {
  title: "Home — BFG",
  description: "Твоё Presence и продолжение пути в Big Fitness Game.",
};

/**
 * Серверная сборка Home (D071/D082 + резолвер D043, слайс 10).
 *
 * Continue Journey (D043/D046/D058/D059) — через общий lib/journey:
 *   активная сессия → «Вернуться к тренировке» (к активной);
 *   иначе → «Продолжить путь» к следующей по циклу от фактически
 *   завершённой; ноль завершений → Тренировка 1; пустой каталог →
 *   спокойно на /workouts.
 *
 * Кольца (D071): внутреннее — реальный прогресс уровня (getLevelProgress);
 * внешнее — реальные завершения текущей UTC-недели (1 тренировка = 1 акт,
 * 1 квест = 1 акт), знаменатель = 21 + длина цикла.
 *
 * Voice Slot (D036–D038/D071) — событийный, вычисляется на сервере
 * детерминированно (без random в рендере):
 *   активная тренировка → спокойная констатация (без «тяги» — Doctrine §X);
 *   первый путь (ни одной активности) → first_step-реплика движка;
 *   иначе — тишина (пустой Home — нормальное состояние).
 *
 * ВРЕМЕННЫЕ МОСТЫ (до соответствующих слайсов):
 *   - «цикл программы» = длина активного каталога, зажатая в принятый
 *     диапазон 2–5 (D061); Program-модель (D061/D085) не реализована;
 *   - направление аватара = "hero" (Герой/Героиня — онбординг, D079/D083);
 *   - имя аватара = null → «Твой спутник» (наречение — S4, D079);
 *   - копия Voice-строк — временная implementation copy.
 * D070-память колец НЕ реализована: кольца показывают текущее состояние
 * без catch-up-анимации (initial={false}) — конфликтов с будущей памятью нет.
 */

/** Временное направление Presence до онбординга (D079/D083). */
const TEMP_DIRECTION = "hero" as const;

/** Принятый диапазон длины цикла программы (D061) для временного моста. */
const CYCLE_MIN = 2;
const CYCLE_MAX = 5;

type DashboardPageProps = {
  /** ?evolution=1 — одноразовый сигнал прибытия эволюции (D067→D069). */
  searchParams: Promise<{ evolution?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getCurrentUser();
  const sp = await searchParams;
  const evolutionArrival = sp?.evolution === "1";

  const supabase = await createSupabaseServerClient();
  const workouts = await listActiveWorkouts(supabase);

  // Знаменатель недельной активности (D071): 21 квест-слот (3×7, D017)
  // + длина цикла. Временный мост: длина активного каталога, зажатая
  // в принятый диапазон 2–5 (D061) — до появления Program-модели.
  const cycleLength = Math.min(CYCLE_MAX, Math.max(CYCLE_MIN, workouts.length));
  const weeklyCapacity = 21 + cycleLength;

  // Layout-гард уже отрезает анонимов; fallback — страховка гонки сессии.
  if (!user) {
    const evolution = getAvatarEvolutionForLevel(1);
    const pointer = emptyJourneyPointer(workouts);
    return (
      <HomeScreen
        level={1}
        levelProgress={0}
        weeklyDone={0}
        weeklyCapacity={weeklyCapacity}
        evolutionStage={evolution.stage}
        evolutionFormLabel={getAvatarFormLabel(evolution.form)}
        avatarName={null}
        voiceLine={null}
        direction="neutral"
        evolutionArrival={false}
        ctaHref={pointer.nextWorkoutId ? `/workouts/${pointer.nextWorkoutId}` : "/workouts"}
        ctaLabel="Продолжить путь"
      />
    );
  }

  const [profileRes, weeklyDoneRaw, pointer] = await Promise.all([
    supabase
      .from("profiles")
      .select("xp, streak, last_active_on")
      .eq("id", user.id)
      .maybeSingle(),
    readWeeklyActivityCount(supabase, user.id),
    resolveJourneyPointer(supabase, user.id, workouts),
  ]);

  if (profileRes.error) {
    console.error("[DashboardPage] read profile", profileRes.error);
  }

  const totalXp = Number(profileRes.data?.xp ?? 0);
  const streak = Number(profileRes.data?.streak ?? 0);
  const lastActiveOn = profileRes.data?.last_active_on
    ? String(profileRes.data.last_active_on).slice(0, 10)
    : null;
  const lp = getLevelProgress(totalXp);
  const evolution = getAvatarEvolutionForLevel(lp.level);

  // ── Continue Journey (D043/D046/D058/D059) ─────────────────────────
  const ctaHref = pointer.activeWorkoutId
    ? `/workouts/${pointer.activeWorkoutId}`
    : pointer.nextWorkoutId
      ? `/workouts/${pointer.nextWorkoutId}`
      : "/workouts";
  const ctaLabel = pointer.activeWorkoutId
    ? "Вернуться к тренировке"
    : "Продолжить путь";

  // ── Событийный Voice Slot (D036–D038/D071) ─────────────────────────
  // Детерминированно на сервере; тишина — нормальное состояние Home.
  let voiceLine: string | null = null;
  if (pointer.activeWorkoutId) {
    // Констатация, не «тяга»: Presence никогда не тянет (Doctrine §X).
    voiceLine = "Тренировка ещё идёт.";
  } else if (lastActiveOn === null && !pointer.hasAnyCompletion) {
    // Первый путь: детерминированная first_step-реплика движка Голоса.
    const msg = buildCompanionMessage({
      userId: user.id,
      level: lp.level,
      xpInLevel: lp.xpIntoLevel,
      xpForNextLevel: lp.xpForNextLevel,
      streak,
      lastActiveOn,
    });
    voiceLine = msg.state === "first_step" ? msg.primary : null;
  }

  // Кап переполнения (D071): показываем не больше знаменателя.
  const weeklyDone = Math.min(weeklyDoneRaw, weeklyCapacity);

  return (
    <HomeScreen
      level={lp.level}
      levelProgress={lp.progress}
      weeklyDone={weeklyDone}
      weeklyCapacity={weeklyCapacity}
      evolutionStage={evolution.stage}
      evolutionFormLabel={getAvatarFormLabel(evolution.form)}
      avatarName={null}
      voiceLine={voiceLine}
      direction={TEMP_DIRECTION}
      evolutionArrival={evolutionArrival}
      ctaHref={ctaHref}
      ctaLabel={ctaLabel}
    />
  );
}

/**
 * Завершённые действия текущей UTC-недели: 1 закрытый квест = 1 активность,
 * 1 завершённая тренировка = 1 активность; считаются только завершённые
 * действия (D071). Read-only count-запросы, RLS «свои строки» действует.
 */
async function readWeeklyActivityCount(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<number> {
  const weekStart = mondayUtcISO();

  const [questsRes, workoutsRes] = await Promise.all([
    supabase
      .from("daily_quest_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("completed_on", weekStart),
    supabase
      .from("workout_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("completed_on", weekStart),
  ]);

  if (questsRes.error) {
    console.error("[DashboardPage] weekly quest count", questsRes.error);
  }
  if (workoutsRes.error) {
    console.error("[DashboardPage] weekly workout count", workoutsRes.error);
  }

  return (questsRes.count ?? 0) + (workoutsRes.count ?? 0);
}

/** Понедельник текущей UTC-недели, YYYY-MM-DD (недельная граница D071 — UTC). */
function mondayUtcISO(): string {
  const d = new Date();
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday);
  return d.toISOString().slice(0, 10);
}
