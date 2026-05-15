import type { Metadata } from "next";
import { DashboardScreen } from "../../components/dashboard/dashboard-screen";

export const metadata: Metadata = {
  title: "Главная — BFG",
  description: "Твой прогресс, квесты и быстрые действия в Big Fitness Game.",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
