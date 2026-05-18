import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import { buildCompanionMessage } from "@/lib/companion";
import { getLevelProgress } from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";
import { CompanionScreen } from "../../components/companion/companion-screen";

export const metadata: Metadata = {
  title: "Компаньон — BFG",
  description:
    "Тихий внутренний голос BFG: спокойное отражение твоего пути, серии и эволюции.",
};

/**
 * Серверная сборка экрана компаньона (MVP «память»).
 *
 * Никакого OpenAI и внешних AI-сервисов — компаньон строится локально
 * из уже существующих данных профиля (`level/xp/streak/last_active_on`).
 * Это даёт три важных свойства:
 *   1) работает в России без VPN — нет сетевых вызовов наружу;
 *   2) детерминированно — один и тот же контекст в один день даёт
 *      одну и ту же реплику; компаньон ощущается как присутствие,
 *      а не как генератор случайных мотивашек;
 *   3) тон гарантированно соответствует COMPANION_SYSTEM.md, потому что
 *      все фразы — вручную написанный набор.
 *
 * Уровень считаем helper-ом `getLevelProgress`, как и dashboard:
 * единая точка истины — никаких рассинхронов между экранами.
 */
export default async function CompanionPage() {
  const user = await getCurrentUser();

  // Layout-гард уже отрезает анонимов; этот fallback нужен на случай
  // гонки сессии. Рисуем «нулевой» first_step, без падения.
  if (!user) {
    const fallback = buildCompanionMessage({
      userId: "anon",
      level: 1,
      xpInLevel: 0,
      xpForNextLevel: 100,
      streak: 0,
      lastActiveOn: null,
    });
    return (
      <CompanionScreen
        state={fallback.state}
        stateLabel={fallback.stateLabel}
        primary={fallback.primary}
        secondary={fallback.secondary}
        level={1}
        streak={0}
        xpInLevel={0}
        xpForNextLevel={100}
        daysSinceActive={fallback.daysSinceActive}
      />
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("xp, streak, last_active_on")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    // Не валим экран — компаньон должен быть «всегда тёплым».
    // Логируем и рисуем безопасный first_step.
    console.error("[CompanionPage] read profile", error);
  }

  const totalXp = Number(profile?.xp ?? 0);
  const streak = Number(profile?.streak ?? 0);
  const lastActiveOn = profile?.last_active_on
    ? String(profile.last_active_on).slice(0, 10)
    : null;
  const lp = getLevelProgress(totalXp);

  const message = buildCompanionMessage({
    userId: user.id,
    level: lp.level,
    xpInLevel: lp.xpIntoLevel,
    xpForNextLevel: lp.xpForNextLevel,
    streak,
    lastActiveOn,
  });

  return (
    <CompanionScreen
      state={message.state}
      stateLabel={message.stateLabel}
      primary={message.primary}
      secondary={message.secondary}
      level={lp.level}
      streak={streak}
      xpInLevel={lp.xpIntoLevel}
      xpForNextLevel={lp.xpForNextLevel}
      daysSinceActive={message.daysSinceActive}
    />
  );
}
