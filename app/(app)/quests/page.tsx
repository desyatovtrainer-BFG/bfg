import type { Metadata } from "next";
import { DailyQuestsScreen } from "../../components/daily-quests/daily-quests-screen";

export const metadata: Metadata = {
  title: "Контракты дня — BFG",
  description: "Ежедневные квесты, награды и завершение дня в Big Fitness Game.",
};

export default function DailyQuestsPage() {
  return <DailyQuestsScreen />;
}
