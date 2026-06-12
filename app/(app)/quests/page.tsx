import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  buildDailyQuestList,
  DAILY_QUEST_GUEST_SEED,
  getTodayCompletedQuestIds,
  selectDailyQuestIds,
  todayISO,
} from "@/lib/quests";
import { createSupabaseServerClient } from "@/lib/supabase";
import { DailyQuestsScreen } from "../../components/daily-quests/daily-quests-screen";

export const metadata: Metadata = {
  title: "Контракты дня — BFG",
  description: "Ежедневные квесты, награды и завершение дня в Big Fitness Game.",
};

export default async function DailyQuestsPage() {
  // Гард на /app слое уже отрезает анонимов; здесь нам нужен userId,
  // чтобы собрать дневную подборку (D017) и подтянуть закрытые сегодня
  // контракты для предзаполнения UI. Anon-fallback (гонка сессии) —
  // display-only подборка по guest-seed: клейм всё равно требует сессию.
  const user = await getCurrentUser();
  const selectedIds = selectDailyQuestIds(user?.id ?? DAILY_QUEST_GUEST_SEED, todayISO());
  const initialCompletedIds = user
    ? await getTodayCompletedQuestIds(await createSupabaseServerClient(), user.id)
    : [];

  return <DailyQuestsScreen initialQuests={buildDailyQuestList(selectedIds, initialCompletedIds)} />;
}
