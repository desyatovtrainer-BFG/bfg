import type { Metadata } from "next";
import { WorkoutsScreen } from "@/app/components/workouts/workouts-screen";

export const metadata: Metadata = {
  title: "Тренировки — BFG",
};

export default function WorkoutsPage() {
  return <WorkoutsScreen />;
}
