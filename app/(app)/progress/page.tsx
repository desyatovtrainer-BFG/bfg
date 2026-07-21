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
 * Визуальное направление и appearance-слот читает общий AvatarStateProvider;
 * Home и Progress разрешают одну сохранённую конфигурацию через один resolver.
 * История/Статистика/Достижения — placeholder-входы без логики.
 */

export default async function ProgressPage() {
  const user = await getCurrentUser();

  // Layout-гард уже отрезает анонимов; fallback — страховка на случай
  // гонки сессии: спокойные «нулевые» значения, без падения.
  let totalXp = 0;
  let streak = 0;
  let historyCount = 0;

  if (user) {
    const supabase = await createSupabaseServerClient();
    const [profileRes, historyRes] = await Promise.all([
      supabase.from("profiles").select("xp, streak").eq("id", user.id).maybeSingle(),
      // Лёгкая сводка Хроники (D072 Additional/History): общее число
      // завершённых тренировок. Read-only count, без системы истории.
      supabase
        .from("workout_completions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);
    if (profileRes.error) {
      console.error("[ProgressPage] read profile", profileRes.error);
    }
    if (historyRes.error) {
      console.error("[ProgressPage] count completions", historyRes.error);
    }
    totalXp = Number(profileRes.data?.xp ?? 0);
    streak = Number(profileRes.data?.streak ?? 0);
    historyCount = historyRes.count ?? 0;
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
      historyCount={historyCount}
    />
  );
}
