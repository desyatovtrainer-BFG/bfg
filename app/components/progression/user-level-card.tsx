"use client";

import { motion } from "framer-motion";
import { GameCard } from "../ui/game-card";
import { XpProgressBar, type XpProgressMood } from "./xp-progress-bar";

export type UserLevelCardProps = {
  level: number;
  title: string;
  xpCurrent: number;
  xpToNextLevel: number;
  motivationalStatus: string;
  /** Текст статуса под титулом (короткий эмоциональный хук) */
  statusTag?: string;
  reducedMotion?: boolean;
};

function xpMood(xpCurrent: number, xpToNextLevel: number): XpProgressMood {
  if (xpToNextLevel <= 0) return "calm";
  const p = xpCurrent / xpToNextLevel;
  if (p >= 0.95) return "burst";
  if (p >= 0.72) return "rising";
  return "calm";
}

export function UserLevelCard({
  level,
  title,
  xpCurrent,
  xpToNextLevel,
  motivationalStatus,
  statusTag = "В резонансе с целью",
  reducedMotion = false,
}: UserLevelCardProps) {
  const mood = xpMood(xpCurrent, xpToNextLevel);
  const remaining = Math.max(0, xpToNextLevel - xpCurrent);

  return (
    <GameCard glow={mood === "burst" ? "gold" : "violet"} className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-sky-600/12 blur-3xl" />

      {mood === "burst" && !reducedMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl border border-amber-400/20"
          animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.01, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
            Твой уровень
          </p>
          <div className="mt-2 flex items-end gap-2">
            <motion.span
              className="text-5xl font-extrabold leading-none text-white tabular-nums [font-family:var(--font-unbounded)] sm:text-6xl"
              initial={reducedMotion ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {level}
            </motion.span>
            <span className="mb-1 text-sm font-medium text-sky-300/90 [font-family:var(--font-onest)]">LVL</span>
          </div>
          <p className="mt-3 text-lg font-bold text-white [font-family:var(--font-unbounded)]">{title}</p>
          <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-violet-200/90 [font-family:var(--font-onest)]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            {statusTag}
          </p>
        </div>

        <div className="max-w-sm rounded-xl border border-white/[0.06] bg-black/35 px-4 py-3 sm:max-w-xs">
          <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            {motivationalStatus}
          </p>
          <p className="mt-2 text-xs text-zinc-600 [font-family:var(--font-onest)]">
            До следующего уровня:{" "}
            <span className="font-semibold tabular-nums text-zinc-400">
              {remaining.toLocaleString("ru-RU")} XP
            </span>
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <XpProgressBar
          current={xpCurrent}
          max={xpToNextLevel}
          label="Путь к следующей ступени"
          mood={mood}
          reducedMotion={reducedMotion}
        />
      </div>

      {mood === "burst" ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-4 text-center text-xs font-semibold text-amber-200/95 [font-family:var(--font-onest)]"
        >
          Уровень почти твой — ещё один рывок.
        </motion.p>
      ) : null}
    </GameCard>
  );
}
