"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DailyCompletionBanner } from "./daily-completion-banner";
import { QuestCard } from "./quest-card";
import type { DailyQuest, QuestState } from "./types";

function initialQuests(): DailyQuest[] {
  return [
    {
      id: "steps",
      kind: "steps",
      title: "Пройти шаги",
      subtitle: "Поле силы под ногами — каждый шаг кормит твою легенду.",
      state: "active",
      progress: { current: 7800, max: 10000 },
      rewards: { xp: 80, coins: 25, streakBoostPercent: 2 },
    },
    {
      id: "workout",
      kind: "workout",
      title: "Сделать тренировку",
      subtitle: "Один сеанс — и ты уже не тот, кто проснулся утром.",
      state: "completed",
      rewards: { xp: 140, coins: 45, streakBoostPercent: 5 },
    },
    {
      id: "stretch",
      kind: "stretch",
      title: "Выполнить растяжку",
      subtitle: "Мягкое продление — чтобы завтра ударить сильнее.",
      state: "locked",
      lockReason:
        "Контракт скрыт, пока не зафиксирована тренировка. Сначала закрой «Тренировку» — и путь откроется.",
      rewards: { xp: 60, coins: 20 },
    },
    {
      id: "streak",
      kind: "streak_hold",
      title: "Удержать серию",
      subtitle: "Не дай пламени дня погаснуть — один вход, одно действие.",
      state: "active",
      rewards: { xp: 50, coins: 15, streakBoostPercent: 8 },
    },
    {
      id: "hydration",
      kind: "hydration",
      title: "Гидратация",
      subtitle: "Вода — как мана: без неё заклинания тела слабеют.",
      state: "active",
      progress: { current: 1200, max: 2000, unitLabel: "мл" },
      rewards: { xp: 40, coins: 18 },
    },
  ];
}

function unlockStretchWhenWorkoutClaimed(list: DailyQuest[]): DailyQuest[] {
  const workoutDone = list.find((q) => q.id === "workout")?.state === "reward_claimed";
  return list.map((q) => {
    if (q.id !== "stretch" || q.state !== "locked") return q;
    if (!workoutDone) return q;
    return {
      ...q,
      state: "active" as QuestState,
      lockReason: undefined,
      progress: { current: 0, max: 15, unitLabel: "мин" },
    };
  });
}

export function DailyQuestsScreen() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reducedMotion = mounted && prefersReduced === true;

  const [quests, setQuests] = useState<DailyQuest[]>(initialQuests);

  const questsView = useMemo(() => unlockStretchWhenWorkoutClaimed(quests), [quests]);

  const allRewardsClaimed = useMemo(
    () => questsView.length > 0 && questsView.every((q) => q.state === "reward_claimed"),
    [questsView],
  );

  const completeQuest = useCallback((id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id && q.state === "active" ? { ...q, state: "completed" as const } : q)),
    );
  }, []);

  const claimReward = useCallback((id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id && q.state === "completed" ? { ...q, state: "reward_claimed" as const } : q)),
    );
  }, []);

  const order = ["steps", "workout", "stretch", "streak", "hydration"];

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(95%_70%_at_50%_-18%,rgba(56,189,248,0.11),transparent_52%),radial-gradient(80%_55%_at_100%_35%,rgba(167,139,250,0.09),transparent_48%),radial-gradient(65%_50%_at_0%_90%,rgba(251,191,36,0.05),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/55 via-transparent to-black" />
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]" />

      <div className="relative z-[1] mx-auto max-w-lg px-4 pb-32 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex items-center justify-between gap-3"
        >
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 [font-family:var(--font-onest)]"
          >
            ← Главная
          </Link>
          <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-300/90 [font-family:var(--font-onest)]">
            Контракты дня
          </span>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-extrabold leading-tight text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            Ежедневная{" "}
            <span className="bg-gradient-to-r from-sky-200 via-amber-200 to-violet-200 bg-clip-text text-transparent">
              эволюция
            </span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
            Это не список дел — это цепочка сделок с вселенной. Каждый закрытый контракт усиливает привычку
            возвращаться: награда близко, пульс прогресса на экране.
          </p>
        </motion.header>

        <DailyCompletionBanner show={allRewardsClaimed} reducedMotion={reducedMotion} />

        <motion.section
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
          className="space-y-4"
        >
          {order
            .map((id) => questsView.find((q) => q.id === id))
            .filter((q): q is DailyQuest => Boolean(q))
            .map((quest) => (
              <motion.div
                key={quest.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              >
                <QuestCard
                  quest={quest}
                  reducedMotion={reducedMotion}
                  onComplete={completeQuest}
                  onClaimReward={claimReward}
                />
              </motion.div>
            ))}
        </motion.section>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 text-center text-xs leading-relaxed text-zinc-600 [font-family:var(--font-onest)]"
        >
          Предвкушение — часть награды. Загляни завтра первым: вселенная любит тех, кто не пропускает открытие
          контрактов.
        </motion.p>
      </div>
    </div>
  );
}
