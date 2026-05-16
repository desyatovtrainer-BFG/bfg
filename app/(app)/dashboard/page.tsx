import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getLevelProgress,
} from "@/lib/progression";
import { DAILY_QUEST_ORDER, getTodayCompletedQuestIds } from "@/lib/quests";
import { createSupabaseServerClient } from "@/lib/supabase";
import { DashboardScreen } from "../../components/dashboard/dashboard-screen";

export const metadata: Metadata = {
  title: "Главная — BFG",
  description: "Твой прогресс, квесты и быстрые действия в Big Fitness Game.",
};

/**
 * Серверная сборка дашборда.
 *
 * Тянем минимум: суммарный XP/streak из `profiles`, закрытые сегодня
 * квесты из `daily_quest_completions`. Уровень, прогресс и стадию аватара
 * считаем чистыми helper-ами прогрессии (`getLevelProgress`,
 * `getAvatarEvolutionForLevel`) — это и источник истины awardXp,
 * и значит дашборд всегда совпадает с тем, что увидит игрок после
 * левел-апа на других экранах.
 *
 * Аватар отдельно из БД не читаем: его поля — производная от уровня
 * (см. lib/progression/avatar-evolution.ts), и держать их на двух
 * экранах в синхроне дешевле через helper, чем через лишний select.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Layout-гард уже отрезает анонимов; этот fallback — страховка
  // на случай гонки сессии. UI рисуем «нулевыми» дефолтами, без падения.
  if (!user) {
    const evolution = getAvatarEvolutionForLevel(1);
    return (
      <DashboardScreen
        userName="Воин"
        level={1}
        xpInLevel={0}
        xpForNextLevel={100}
        progressPercent={0}
        streak={0}
        evolutionStage={evolution.stage}
        evolutionFormLabel={getAvatarFormLabel(evolution.form)}
        questsCompletedToday={0}
        questsTotal={DAILY_QUEST_ORDER.length}
      />
    );
  }

  const supabase = await createSupabaseServerClient();

  const [profileRes, completedIds] = await Promise.all([
    supabase
      .from("profiles")
      .select("xp, streak")
      .eq("id", user.id)
      .maybeSingle(),
    getTodayCompletedQuestIds(supabase, user.id),
  ]);

  if (profileRes.error) {
    console.error("[DashboardPage] read profile", profileRes.error);
  }

  const totalXp = Number(profileRes.data?.xp ?? 0);
  const streak = Number(profileRes.data?.streak ?? 0);
  const lp = getLevelProgress(totalXp);
  const evolution = getAvatarEvolutionForLevel(lp.level);

  return (
    <DashboardScreen
      userName={pickUserName(user.email)}
      level={lp.level}
      xpInLevel={lp.xpIntoLevel}
      xpForNextLevel={lp.xpForNextLevel}
      progressPercent={Math.round(lp.progress * 100)}
      streak={streak}
      evolutionStage={evolution.stage}
      evolutionFormLabel={getAvatarFormLabel(evolution.form)}
      questsCompletedToday={completedIds.length}
      questsTotal={DAILY_QUEST_ORDER.length}
    />
  );
}

/** Берём локальную часть e-mail как имя; если нет — нейтральное «Воин». */
function pickUserName(email: string | null | undefined): string {
  const local = email?.split("@")[0]?.trim();
  if (!local) return "Воин";
  return local.charAt(0).toUpperCase() + local.slice(1);
}
