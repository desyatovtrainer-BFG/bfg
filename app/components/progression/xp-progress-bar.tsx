"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export type XpProgressMood = "calm" | "rising" | "burst";

export type XpProgressBarProps = {
  current: number;
  max: number;
  /** Подпись слева над шкалой */
  label?: string;
  /** Визуальное настроение: burst — почти уровень вверх */
  mood?: XpProgressMood;
  reducedMotion?: boolean;
  className?: string;
};

export function XpProgressBar({
  current,
  max,
  label = "Опыт",
  mood = "calm",
  reducedMotion = false,
  className = "",
}: XpProgressBarProps) {
  const pct = useMemo(() => {
    if (max <= 0) return 0;
    return Math.min(100, Math.round((current / max) * 100));
  }, [current, max]);

  const targetWidth = `${pct}%`;

  const trackRing =
    mood === "burst"
      ? "ring-1 ring-amber-400/40 shadow-[0_0_24px_-4px_rgba(251,191,36,0.35)]"
      : mood === "rising"
        ? "ring-1 ring-sky-500/25 shadow-[0_0_20px_-6px_rgba(56,189,248,0.25)]"
        : "ring-1 ring-white/10";

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs [font-family:var(--font-onest)]">
        <span className="font-medium text-zinc-500">{label}</span>
        <span className="tabular-nums text-zinc-300">
          {current.toLocaleString("ru-RU")}{" "}
          <span className="text-zinc-600">/</span> {max.toLocaleString("ru-RU")}{" "}
          <span className="text-zinc-500">XP</span>
        </span>
      </div>
      <div
        className={`relative h-3 overflow-hidden rounded-full bg-zinc-900/90 ${trackRing} transition-shadow duration-500`}
      >
        <motion.div
          className={`relative h-full rounded-full ${
            mood === "burst"
              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400"
              : mood === "rising"
                ? "bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500"
                : "bg-gradient-to-r from-sky-600 via-sky-400 to-cyan-400"
          }`}
          initial={{ width: reducedMotion ? targetWidth : 0 }}
          animate={{ width: targetWidth }}
          transition={{
            duration: reducedMotion ? 0 : 1.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        {!reducedMotion && mood === "burst" ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-white/35 to-transparent opacity-70"
            animate={{ x: ["-20%", "220%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </div>
      <p className="mt-1 text-right text-[11px] tabular-nums text-zinc-600">{pct}%</p>
    </div>
  );
}
