import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { buildCompanionMessage } from "@/lib/companion";
import {
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getLevelProgress,
} from "@/lib/progression";
import {
  buildDailyQuestList,
  DAILY_QUEST_GUEST_SEED,
  DAILY_QUEST_SELECTION_SIZE,
  getTodayCompletedQuestIds,
  selectDailyQuestIds,
  todayISO,
} from "@/lib/quests";
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
    // Display-only подборка по guest-seed (D017): детерминированна по дню,
    // клейм всё равно требует сессию. 50 XP — стоимость уровня по D013.
    const guestSelectedIds = selectDailyQuestIds(DAILY_QUEST_GUEST_SEED, todayISO());
    const fallbackMsg = buildCompanionMessage({
      userId: "anon",
      level: 1,
      xpInLevel: 0,
      xpForNextLevel: 50,
      streak: 0,
      lastActiveOn: null,
    });
    return (
      <DashboardScreen
        userName="Воин"
        level={1}
        xpInLevel={0}
        xpForNextLevel={50}
        progressPercent={0}
        streak={0}
        evolutionStage={evolution.stage}
        evolutionFormLabel={getAvatarFormLabel(evolution.form)}
        questsCompletedToday={0}
        questsTotal={DAILY_QUEST_SELECTION_SIZE}
        quests={buildDailyQuestList(guestSelectedIds, [])}
        companionPrimary={fallbackMsg.primary}
      />
    );
  }

  const supabase = await createSupabaseServerClient();

  const [profileRes, completedIds] = await Promise.all([
    supabase
      .from("profiles")
      .select("xp, streak, last_active_on")
      .eq("id", user.id)
      .maybeSingle(),
    getTodayCompletedQuestIds(supabase, user.id),
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

  // Дневная подборка (D017) + закрытые сегодня. Счётчик «N из 3» считаем
  // по отрисованному списку, а не по сырым completedIds: legacy-завершения
  // вне подборки не должны давать «4 из 3».
  const selectedIds = selectDailyQuestIds(user.id, todayISO());
  const quests = buildDailyQuestList(selectedIds, completedIds);
  const questsCompletedToday = quests.filter((q) => q.state === "reward_claimed").length;

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
      questsCompletedToday={questsCompletedToday}
      questsTotal={DAILY_QUEST_SELECTION_SIZE}
      quests={quests}
      companionPrimary={companionMsg.primary}
    />
  );
}

/** Берём локальную часть e-mail как имя; если нет — нейтральное «Воин». */
function pickUserName(email: string | null | undefined): string {
  const local = email?.split("@")[0]?.trim();
  if (!local) return "Воин";
  return local.charAt(0).toUpperCase() + local.slice(1);
}
