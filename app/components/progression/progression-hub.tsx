"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AvatarEvolutionBlock } from "./avatar-evolution-block";
import { DailyRewardPanel } from "./daily-reward-panel";
import { StreakPanel } from "./streak-panel";
import { UserLevelCard } from "./user-level-card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const section = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28 },
  },
};

/** Демо-состояние: позже заменить на данные с бэкенда / стора */
const DEMO = {
  level: 12,
  title: "Сияющий искатель",
  xpInLevel: 3120,
  xpForNextLevel: 3600,
  motivationalStatus:
    "Ты держишь ритм сильнее, чем вчера. Каждое действие — голос вселенной BFG: «ты можешь ещё».",
  streakDays: 12,
  streakProtection:
    "Щит серии активен: сегодняшний вход уже засчитан. Пропуск дня не обнуляет путь — но пламя станет тише.",
  streakMotivation:
    "Возвращайся завтра — и пламя снова взметнется выше. Ты создаёшь привычку побеждать.",
  dailyXp: 150,
  streakBonusXp: 50,
  evolution: {
    current: "Пульс поля",
    next: "Страж потока",
    progress: 67,
    flavor:
      "Тело запоминает смелость. Чем стабильнее движение, тем ярче следующий силуэт — это не косметика, а твоя история силы.",
  },
};

export function ProgressionHub() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reducedMotion = mounted && prefersReduced === true;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_65%_at_50%_-15%,rgba(56,189,248,0.1),transparent_52%),radial-gradient(85%_50%_at_100%_40%,rgba(167,139,250,0.08),transparent_50%),radial-gradient(70%_45%_at_0%_85%,rgba(251,113,133,0.06),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-black" />
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.55)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-[1] mx-auto max-w-lg px-4 pb-32 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5"
      >
        <motion.div variants={section} className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 [font-family:var(--font-onest)]"
          >
            ← Главная
          </Link>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
            Эволюция
          </span>
        </motion.div>

        <motion.header variants={section} className="mb-2">
          <h1 className="text-2xl font-extrabold leading-tight text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            Твой рост —{" "}
            <span className="bg-gradient-to-r from-sky-200 via-violet-200 to-rose-200 bg-clip-text text-transparent">
              живая игра
            </span>
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
            Не трекер шагов — система уровней, наград и смысла. Заходи каждый день: вселенная помнит твой прогресс.
          </p>
        </motion.header>

        <motion.div variants={section} className="mb-5">
          <UserLevelCard
            level={DEMO.level}
            title={DEMO.title}
            xpCurrent={DEMO.xpInLevel}
            xpToNextLevel={DEMO.xpForNextLevel}
            motivationalStatus={DEMO.motivationalStatus}
            statusTag="На волне прогресса"
            reducedMotion={reducedMotion}
          />
        </motion.div>

        <motion.div variants={section} className="mb-5">
          <DailyRewardPanel
            dailyXp={DEMO.dailyXp}
            streakBonusXp={DEMO.streakBonusXp}
            reducedMotion={reducedMotion}
          />
        </motion.div>

        <motion.div variants={section} className="mb-5">
          <StreakPanel
            days={DEMO.streakDays}
            protectionHint={DEMO.streakProtection}
            motivationalLine={DEMO.streakMotivation}
            reducedMotion={reducedMotion}
          />
        </motion.div>

        <motion.div variants={section} className="mb-8">
          <AvatarEvolutionBlock
            currentFormLabel={DEMO.evolution.current}
            nextFormLabel={DEMO.evolution.next}
            progressPercent={DEMO.evolution.progress}
            flavorText={DEMO.evolution.flavor}
            reducedMotion={reducedMotion}
          />
        </motion.div>

        <motion.footer variants={section} className="text-center">
          <p className="text-xs leading-relaxed text-zinc-600 [font-family:var(--font-onest)]">
            Завтра здесь снова будет что забрать. Один вход — и ты уже на шаг впереди вчерашнего себя.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
