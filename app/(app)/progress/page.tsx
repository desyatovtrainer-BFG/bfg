import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  getAvatarFormLabel,
  getAvatarStageFlavor,
  getEvolutionProgress,
  getLevelProgress,
  XP_REWARDS,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import { ProgressionHub } from "../../components/progression/progression-hub";

export const metadata: Metadata = {
  title: "Прогресс и эволюция — BFG",
  description:
    "Опыт, уровни, ежедневные награды, серия и эволюция аватара в Big Fitness Game.",
};

/**
 * Серверная сборка экрана прогрессии.
 *
 * Источник правды — `profiles.xp`/`profiles.streak`. Уровень, прогресс и
 * стадия эволюции считаются чистыми helper-ами прогрессии: те же, что
 * использует `awardXp`. Это гарантирует, что после левел-апа здесь
 * показано ровно то же, что на дашборде и в реакции компаньона.
 *
 * Все «эмоциональные» подписи здесь — статические Russian-fallback'и
 * по состоянию (новичок / серия / на пороге уровня). Без компаньона и
 * LLM: экран должен рисоваться без сети, как и весь MVP.
 */
export default async function ProgressPage() {
  const user = await getCurrentUser();

  // Layout-гард уже отрезает анонимов; этот fallback — страховка
  // на случай гонки сессии. UI рисуем «нулевыми» дефолтами, без падения.
  const totalXp = user ? await readTotalXp(user.id) : 0;
  const streak = user ? await readStreak(user.id) : 0;

  const lp = getLevelProgress(totalXp);
  const evo = getEvolutionProgress(lp.level);

  const currentFormLabel = getAvatarFormLabel(evo.current.form);
  const nextFormLabel = evo.next ? getAvatarFormLabel(evo.next.form) : currentFormLabel;
  const evolutionFlavor = getAvatarStageFlavor(evo.current.stage);

  return (
    <ProgressionHub
      level={lp.level}
      title={currentFormLabel}
      xpInLevel={lp.xpIntoLevel}
      xpForNextLevel={lp.xpForNextLevel}
      streakDays={streak}
      dailyXp={XP_REWARDS.DAILY_LOGIN}
      streakBonusXp={XP_REWARDS.STREAK_BONUS}
      evolution={{
        currentFormLabel,
        nextFormLabel,
        progressPercent: evo.progressPercent,
        flavorText: evolutionFlavor,
      }}
      motivationalStatus={buildMotivationalStatus(lp.level, streak)}
      statusTag={buildStatusTag(streak, lp.progress)}
      streakNote={buildStreakNote(streak)}
      streakMotivation={buildStreakMotivation(streak)}
    />
  );
}

async function readTotalXp(userId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[ProgressPage] read xp", error);
    return 0;
  }
  return Number(data?.xp ?? 0);
}

async function readStreak(userId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("streak")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[ProgressPage] read streak", error);
    return 0;
  }
  return Number(data?.streak ?? 0);
}

/** Короткий русский статус под уровнем. Без шейминга, без восклицаний. */
function buildMotivationalStatus(level: number, streak: number): string {
  if (level === 1 && streak === 0) {
    return "Путь только начинается. Один шаг — и вселенная заметит.";
  }
  if (streak >= 7) {
    return "Серия держится дольше недели. Ты создаёшь себя движением.";
  }
  if (streak >= 2) {
    return "Ритм поймал тебя. Сегодня — ещё один слой эволюции.";
  }
  return "Каждое действие — голос вселенной BFG: «ты можешь ещё».";
}

function buildStatusTag(streak: number, progress: number): string {
  if (progress >= 0.8) return "Уровень почти твой";
  if (streak >= 7) return "В сердце серии";
  if (streak >= 2) return "На волне прогресса";
  return "В резонансе с целью";
}

function buildStreakNote(streak: number): string {
  if (streak === 0) {
    return "Серия ещё не запущена. Сделай шаг сегодня — пламя начнёт гореть.";
  }
  return "Сегодняшний вход уже засчитан. Пропуск дня не обнуляет путь — серия мягко начнётся заново.";
}

function buildStreakMotivation(streak: number): string {
  if (streak === 0) {
    return "Возвращайся завтра — и пламя загорится. Ты создаёшь привычку побеждать.";
  }
  if (streak >= 7) {
    return "Семь и больше. Ты живёшь это, а не «делаешь».";
  }
  return "Возвращайся завтра — и пламя снова взметнется выше.";
}
