"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { GameCard } from "../ui/game-card";

export type AvatarEvolutionBlockProps = {
  currentFormLabel: string;
  nextFormLabel: string;
  /** 0–100: прогресс к следующей форме */
  progressPercent: number;
  flavorText: string;
  reducedMotion?: boolean;
};

function Silhouette({ variant, gid }: { variant: "current" | "next"; gid: string }) {
  const opacity = variant === "current" ? 0.55 : 0.28;
  const scale = variant === "current" ? 1 : 0.92;
  const gradId = variant === "current" ? `evo-c-${gid}` : `evo-n-${gid}`;
  return (
    <svg
      viewBox="0 0 120 200"
      className="mx-auto h-28 w-20 sm:h-32 sm:w-24"
      aria-hidden
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={variant === "current" ? "#38bdf8" : "#a78bfa"} />
          <stop offset="100%" stopColor={variant === "current" ? "#a78bfa" : "#fb7185"} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradId})`}
        d="M60 28c-6 0-11 5-11 11 0 4 2 8 5 10-7 3-12 12-12 22v28h11v-26c0-6 4-11 10-13 1 7 5 13 11 15 1 0 2 1 3 1s2-1 3-1c6-2 10-8 11-15 6 2 10 7 10 13v26h11V71c0-10-5-19-12-22 3-2 5-6 5-10 0-6-5-11-11-11z"
      />
      <path
        fill={`url(#${gradId})`}
        fillOpacity={0.4}
        d="M24 78 L36 58 L54 64 L60 28 L66 64 L84 58 L96 78 L84 86 L78 168 L66 168 L60 120 L54 168 L42 168 L36 86 Z"
      />
    </svg>
  );
}

export function AvatarEvolutionBlock({
  currentFormLabel,
  nextFormLabel,
  progressPercent,
  flavorText,
  reducedMotion = false,
}: AvatarEvolutionBlockProps) {
  const p = Math.min(100, Math.max(0, progressPercent));
  const gid = useId().replace(/:/g, "");

  return (
    <GameCard glow="cyan" className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-sky-500/10 blur-3xl" />

      <div className="relative text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
          Эволюция образа
        </p>
        <h3 className="mt-2 text-lg font-bold text-white [font-family:var(--font-unbounded)] sm:text-xl">
          Твоя следующая форма уже зовёт
        </h3>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-black/30 p-3 text-center">
          <Silhouette variant="current" gid={gid} />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
            Сейчас
          </p>
          <p className="mt-1 text-sm font-semibold text-sky-200 [font-family:var(--font-onest)]">{currentFormLabel}</p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-3 text-center">
          <Silhouette variant="next" gid={gid} />
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
            Дальше
          </p>
          <p className="mt-1 text-sm font-semibold text-violet-200 [font-family:var(--font-onest)]">{nextFormLabel}</p>
        </div>
      </div>

      <div className="relative mt-5">
        <div className="mb-1.5 flex justify-between text-xs text-zinc-500 [font-family:var(--font-onest)]">
          <span>Прогресс трансформации</span>
          <span className="tabular-nums text-zinc-400">{p}%</span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-zinc-900 ring-1 ring-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500"
            initial={{ width: reducedMotion ? `${p}%` : 0 }}
            animate={{ width: `${p}%` }}
            transition={{ duration: reducedMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
        </div>
      </div>

      <p className="relative mt-4 text-center text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
        {flavorText}
      </p>
    </GameCard>
  );
}
