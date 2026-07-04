import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getLevelProgress,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import { ProgressScreen } from "../../components/progress/progress-screen";

export const metadata: Metadata = {
  title: "Прогресс — BFG",
  description: "Кем ты стал и что накопилось на пути — спокойный архив Big Fitness Game.",
};

/**
 * Серверная сборка Прогресса (D072 — визуальная оболочка, слайс 4A).
 *
 * Данные: один read-only select `profiles.xp/streak`; уровень и стадия —
 * теми же чистыми helper-ами, что использует awardXp и Home, поэтому
 * все экраны показывают одно и то же состояние.
 *
 * ВРЕМЕННАЯ ПРОВОДКА (как на Home, слайс 3A): направление аватара —
 * "hero" до онбординга (D079/D083); портрет обязан визуально совпадать
 * с Home-Presence, поэтому константа зеркалит TEMP_DIRECTION дашборда.
 * История/Статистика/Достижения — placeholder-входы без логики.
 */

/** Временное направление Presence — зеркалит Home (см. dashboard/page.tsx). */
const TEMP_DIRECTION = "hero" as const;

export default async function ProgressPage() {
  const user = await getCurrentUser();

  // Layout-гард уже отрезает анонимов; fallback — страховка на случай
  // гонки сессии: спокойные «нулевые» значения, без падения.
  let totalXp = 0;
  let streak = 0;

  if (user) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("xp, streak")
      .eq("id", user.id)
      .maybeSingle();
    if (error) {
      console.error("[ProgressPage] read profile", error);
    }
    totalXp = Number(data?.xp ?? 0);
    streak = Number(data?.streak ?? 0);
  }

  const lp = getLevelProgress(totalXp);
  const evolution = getAvatarEvolutionForLevel(lp.level);

  return (
    <ProgressScreen
      level={lp.level}
      xpIntoLevel={lp.xpIntoLevel}
      xpForNextLevel={lp.xpForNextLevel}
      levelProgress={lp.progress}
      streak={streak}
      evolutionStage={evolution.stage}
      evolutionFormLabel={getAvatarFormLabel(evolution.form)}
      direction={user ? TEMP_DIRECTION : "neutral"}
    />
  );
}
