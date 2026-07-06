import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { buildCompanionMessage } from "@/lib/companion";
import {
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getLevelProgress,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import { HomeScreen } from "../../components/home/home-screen";

export const metadata: Metadata = {
  title: "Home — BFG",
  description: "Твоё Presence и продолжение пути в Big Fitness Game.",
};

/**
 * Серверная сборка Home (D071 — визуальная оболочка, слайс 3A).
 *
 * Данные: суммарный XP/стрик-контекст из `profiles` (для реплики Голоса),
 * уровень/стадия — чистыми helper-ами прогрессии (те же, что в awardXp),
 * активность недели — два read-only count-запроса по таблицам завершений
 * (только завершённые действия считаются, D071).
 *
 * ВРЕМЕННАЯ ПРОВОДКА (сознательно, до следующих слайсов):
 *   - знаменатель недельной активности = 24 (21 квест-слот 3×7, D017,
 *     + условный 3-тренировочный цикл): активной Program-модели ещё нет
 *     (D061/D085 — слайс Activity/Onboarding);
 *   - направление аватара = "hero": Герой/Героиня появляется в онбординге
 *     (D079/D083), пока показываем имеющийся временный ассет;
 *   - имя аватара = null → fallback «Твой спутник»: наречение — S4 (D079);
 *   - реплика Голоса — существующий детерминированный buildCompanionMessage;
 *     перевод на событийную модель (PRS §11.7) — отдельная работа.
 */

/**
 * Временный знаменатель недельной активности: 21 (3 квеста × 7 дней, D017)
 * + 3 (условная длина цикла программы до появления D061/D085-модели).
 */
const TEMP_WEEKLY_CAPACITY = 24;

/** Временное направление Presence до онбординга (D079/D083). */
const TEMP_DIRECTION = "hero" as const;

type DashboardPageProps = {
  /** ?evolution=1 — одноразовый сигнал прибытия эволюции (D067→D069). */
  searchParams: Promise<{ evolution?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getCurrentUser();
  const sp = await searchParams;
  const evolutionArrival = sp?.evolution === "1";

  // Layout-гард уже отрезает анонимов; этот fallback — страховка
  // на случай гонки сессии. Рисуем спокойные «нулевые» дефолты.
  if (!user) {
    const evolution = getAvatarEvolutionForLevel(1);
    return (
      <HomeScreen
        level={1}
        levelProgress={0}
        weeklyDone={0}
        weeklyCapacity={TEMP_WEEKLY_CAPACITY}
        evolutionStage={evolution.stage}
        evolutionFormLabel={getAvatarFormLabel(evolution.form)}
        avatarName={null}
        voiceLine={null}
        direction="neutral"
      />
    );
  }

  const supabase = await createSupabaseServerClient();

  const [profileRes, weeklyDoneRaw] = await Promise.all([
    supabase
      .from("profiles")
      .select("xp, streak, last_active_on")
      .eq("id", user.id)
      .maybeSingle(),
    readWeeklyActivityCount(supabase, user.id),
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

  const companionMsg = buildCompanionMessage({
    userId: user.id,
    level: lp.level,
    xpInLevel: lp.xpIntoLevel,
    xpForNextLevel: lp.xpForNextLevel,
    streak,
    lastActiveOn,
  });

  // Кап переполнения (D071): цикл может повториться внутри недели —
  // показываем не больше знаменателя (например, «24/24 АКТ.»).
  const weeklyDone = Math.min(weeklyDoneRaw, TEMP_WEEKLY_CAPACITY);

  return (
    <HomeScreen
      level={lp.level}
      levelProgress={lp.progress}
      weeklyDone={weeklyDone}
      weeklyCapacity={TEMP_WEEKLY_CAPACITY}
      evolutionStage={evolution.stage}
      evolutionFormLabel={getAvatarFormLabel(evolution.form)}
      avatarName={null}
      voiceLine={companionMsg.primary}
      direction={TEMP_DIRECTION}
      evolutionArrival={evolutionArrival}
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
