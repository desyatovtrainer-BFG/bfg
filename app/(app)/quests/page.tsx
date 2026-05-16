import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getTodayCompletedQuestIds } from "@/lib/quests";
import { createSupabaseServerClient } from "@/lib/supabase";
import { DailyQuestsScreen } from "../../components/daily-quests/daily-quests-screen";

export const metadata: Metadata = {
  title: "Контракты дня — BFG",
  description: "Ежедневные квесты, награды и завершение дня в Big Fitness Game.",
};

export default async function DailyQuestsPage() {
  // Гард на /app слое уже отрезает анонимов; здесь нам нужен userId,
  // чтобы подтянуть закрытые сегодня контракты для предзаполнения UI.
  const user = await getCurrentUser();
  const initialCompletedIds = user
    ? await getTodayCompletedQuestIds(await createSupabaseServerClient(), user.id)
    : [];

  return <DailyQuestsScreen initialCompletedIds={initialCompletedIds} />;
}
