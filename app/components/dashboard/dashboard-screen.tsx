"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DailyQuest, QuestState } from "@/lib/quests";
import { GameButton } from "../ui/game-button";
import { GameCard } from "../ui/game-card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 30 },
  },
};

const HERO_STAGE_COLORS: Record<number, { primary: string; rgb: string; secondary: string }> = {
  1: { primary: "#38bdf8", rgb: "56,189,248",  secondary: "#a78bfa" },
  2: { primary: "#22d3ee", rgb: "34,211,238",  secondary: "#a78bfa" },
  3: { primary: "#a78bfa", rgb: "167,139,250", secondary: "#38bdf8" },
  4: { primary: "#e879f9", rgb: "232,121,249", secondary: "#a78bfa" },
  5: { primary: "#fbbf24", rgb: "251,191,36",  secondary: "#fb7185" },
};

function HeroAvatar({ stage }: { stage: number }) {
  const c = HERO_STAGE_COLORS[Math.min(5, Math.max(1, stage))] ?? HERO_STAGE_COLORS[1]!;
  return (
    <div className="relative mx-auto h-36 w-28 sm:h-40 sm:w-32">
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle at 50% 35%, rgba(${c.rgb},0.25), transparent 62%)` }}
      />
      <svg
        viewBox="0 0 120 200"
        className="relative z-[1] h-full w-full"
        style={{ filter: `drop-shadow(0 0 20px rgba(${c.rgb},0.35))` }}
        aria-hidden
      >
        <defs>
          <linearGradient id="dash-sil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primary} />
            <stop offset="100%" stopColor={c.secondary} />
          </linearGradient>
        </defs>
        <path
          fill="url(#dash-sil)"
          fillOpacity={0.55}
          d="M60 18c-8 0-14 6-14 14 0 5 2 9 6 12-8 4-14 14-14 26v36h12v-32c0-8 6-14 14-14h4c8 0 14 6 14 14v32h12V70c0-12-6-22-14-26 4-3 6-7 6-12 0-8-6-14-14-14z"
        />
        <path
          fill="url(#dash-sil)"
          fillOpacity={0.35}
          d="M36 118 L48 88 L72 96 L60 52 L72 96 L96 88 L108 118 L96 128 L88 188 L72 188 L60 140 L48 188 L32 188 L24 128 Z"
        />
      </svg>
    </div>
  );
}


export type DashboardScreenProps = {
  userName: string;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  streak: number;
  evolutionStage: number;
  evolutionFormLabel: string;
  questsCompletedToday: number;
  questsTotal: number;
  quests: DailyQuest[];
  companionPrimary: string;
};

/** Русская плюрализация для коротких счётчиков (1 день / 2 дня / 5 дней). */
function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}


export function DashboardScreen({
  userName,
  level,
  xpInLevel,
  xpForNextLevel,
  progressPercent,
  streak,
  evolutionStage,
  evolutionFormLabel,
  questsCompletedToday,
  questsTotal,
  quests,
  companionPrimary,
}: DashboardScreenProps) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = mounted && prefersReduced === true;

  const xpCurrent = xpInLevel;
  const xpMax = xpForNextLevel;
  const xpPct = Math.max(0, Math.min(100, progressPercent));
  const streakWord = pluralRu(streak, "день", "дня", "дней");

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_70%_at_50%_-20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(80%_50%_at_100%_30%,rgba(167,139,250,0.08),transparent_50%),radial-gradient(70%_45%_at_0%_80%,rgba(251,113,133,0.06),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-black" />
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-[1] mx-auto max-w-lg px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5"
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="bg-gradient-to-r from-sky-200 to-violet-200 bg-clip-text text-lg font-extrabold tracking-[0.18em] text-transparent [font-family:var(--font-unbounded)]">
              BFG
            </p>
            <h1 className="mt-2 text-xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-2xl">
              Привет, {userName}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 [font-family:var(--font-onest)]">
              Big Fitness Game · твоя вселенная прогресса
            </p>
          </div>
          <GameCard glow="cyan" className="shrink-0 px-3 py-2.5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
              Серия
            </p>
            <p className="mt-0.5 flex items-center justify-center gap-1 text-lg font-bold text-sky-300 [font-family:var(--font-unbounded)]">
              <span className="text-base" aria-hidden>
                🔥
              </span>
              {streak}
            </p>
            <p className="text-[10px] text-zinc-500">{streakWord} подряд</p>
          </GameCard>
        </motion.header>

        {/* Hero */}
        <motion.section variants={fadeUp} className="mb-8">
          <GameCard glow="violet" className="relative overflow-hidden p-5 sm:p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <HeroAvatar stage={evolutionStage} />
              <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-sky-200 [font-family:var(--font-onest)]">
                Уровень <span className="text-white [font-family:var(--font-unbounded)]">{level}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300">{evolutionFormLabel}</span>
              </div>

              <div className="mt-5 w-full max-w-xs">
                <div className="mb-1.5 flex justify-between text-xs text-zinc-400 [font-family:var(--font-onest)]">
                  <span>Опыт</span>
                  <span className="tabular-nums text-zinc-300">
                    {xpCurrent.toLocaleString("ru-RU")} / {xpMax.toLocaleString("ru-RU")} XP
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800/80 ring-1 ring-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-400"
                    initial={reduced ? { width: `${xpPct}%` } : { width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="mt-1 text-right text-[11px] text-zinc-500 tabular-nums">{xpPct}%</p>
              </div>

              <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
                {companionPrimary}
              </p>
            </div>
          </GameCard>
        </motion.section>

        {/* Daily quests */}
        <motion.section variants={fadeUp} className="mb-8">
          <div className="mb-3 flex items-end justify-between gap-2">
            <h2 className="text-lg font-bold text-white [font-family:var(--font-unbounded)]">Ежедневные квесты</h2>
            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/quests"
                className="text-xs font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
              >
                Все контракты →
              </Link>
              <span className="text-xs font-medium text-zinc-500 [font-family:var(--font-onest)]">обновление 00:00</span>
            </div>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quests.map((quest) => {
              const isLocked = quest.state === "locked";
              const isDone = quest.state === "reward_claimed" || quest.state === "completed";
              return (
                <GameCard
                  key={quest.id}
                  glow={questCardGlow(quest.state)}
                  className={[
                    "min-w-[82%] shrink-0 snap-center p-4 sm:min-w-[48%]",
                    isLocked ? "opacity-50" : "",
                    isDone ? "border-amber-400/20" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <p className={[
                    "text-[10px] font-bold uppercase tracking-wider [font-family:var(--font-onest)]",
                    isDone ? "text-amber-300/90" : isLocked ? "text-zinc-600" : "text-sky-300/90",
                  ].join(" ")}>
                    {isDone ? "✓ Выполнено" : isLocked ? "🔒 Закрыт" : "Контракт активен"}
                  </p>
                  <h3 className={[
                    "mt-1 font-semibold [font-family:var(--font-onest)]",
                    isLocked ? "text-zinc-500" : isDone ? "text-zinc-400" : "text-white",
                  ].join(" ")}>
                    {quest.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 [font-family:var(--font-onest)]">
                    {quest.subtitle}
                  </p>
                  {!isLocked ? (
                    <p className={[
                      "mt-3 text-xs font-semibold tabular-nums [font-family:var(--font-onest)]",
                      isDone ? "text-amber-300/60" : "text-amber-200/80",
                    ].join(" ")}>
                      +{quest.rewards.xp} XP
                    </p>
                  ) : null}
                </GameCard>
              );
            })}
          </div>
        </motion.section>

        {/* Progress */}
        <motion.section variants={fadeUp} className="mb-8">
          <div className="mb-3 flex items-end justify-between gap-2">
            <h2 className="text-lg font-bold text-white [font-family:var(--font-unbounded)]">Прогресс</h2>
            <Link
              href="/progress"
              className="text-xs font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
            >
              Эволюция и награды →
            </Link>
          </div>
          <GameCard className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-2">
            <StatPill label="Уровень" value={String(level)} accent />
            <StatPill label="Стадия" value={String(evolutionStage)} sub={evolutionFormLabel} />
            <StatPill label="Серия" value={String(streak)} sub={streakWord} />
            <StatPill
              label="Квесты"
              value={`${questsCompletedToday}/${questsTotal}`}
              sub="сегодня"
            />
          </GameCard>
        </motion.section>

        {/* Quick actions */}
        <motion.section variants={fadeUp} className="mb-4">
          <h2 className="mb-3 text-lg font-bold text-white [font-family:var(--font-unbounded)]">Быстрые действия</h2>
          <div className="flex flex-col gap-3">
            <GameButton href="/workouts" variant="primary" className="w-full py-3.5 text-base">
              Начать тренировку
            </GameButton>
            <div className="grid grid-cols-2 gap-3">
              <GameButton href="/avatar" variant="secondary" className="w-full py-3 text-sm">
                Аватар
              </GameButton>
              <GameButton href="/companion" variant="secondary" className="w-full py-3 text-sm">
                Компаньон
              </GameButton>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}

function questCardGlow(state: QuestState): "cyan" | "gold" | "none" {
  if (state === "active") return "cyan";
  if (state === "completed" || state === "reward_claimed") return "gold";
  return "none";
}

function StatPill({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-black/25 px-3 py-3 text-center ${
        accent ? "ring-1 ring-sky-500/25" : ""
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 [font-family:var(--font-onest)]">
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-bold tabular-nums [font-family:var(--font-unbounded)] ${
          accent ? "text-sky-300" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-[10px] text-zinc-600 [font-family:var(--font-onest)]">{sub}</p> : null}
    </div>
  );
}
