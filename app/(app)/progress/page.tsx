import type { Metadata } from "next";
import { ProgressionHub } from "../../components/progression/progression-hub";

export const metadata: Metadata = {
  title: "Прогресс и эволюция — BFG",
  description:
    "Опыт, уровни, ежедневные награды, серия и эволюция аватара в Big Fitness Game.",
};

export default function ProgressPage() {
  return <ProgressionHub />;
}
