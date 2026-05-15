"use client";

import { motion } from "framer-motion";
import { GameCard } from "../ui/game-card";

export type StreakPanelProps = {
  days: number;
  /** Текст про «защиту» серии */
  protectionHint: string;
  motivationalLine: string;
  reducedMotion?: boolean;
};

export function StreakPanel({
  days,
  protectionHint,
  motivationalLine,
  reducedMotion = false,
}: StreakPanelProps) {
  return (
    <GameCard glow="rose" className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-500/12 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/25 bg-gradient-to-br from-orange-500/25 to-rose-600/20 text-3xl shadow-[0_0_28px_-8px_rgba(251,146,60,0.45)]"
            animate={
              reducedMotion
                ? undefined
                : {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 28px -8px rgba(251,146,60,0.35)",
                      "0 0 36px -4px rgba(251,146,60,0.55)",
                      "0 0 28px -8px rgba(251,146,60,0.35)",
                    ],
                  }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            🔥
          </motion.div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
              Серия активности
            </p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold tabular-nums text-white [font-family:var(--font-unbounded)]">
                {days}
              </span>
              <span className="text-sm font-medium text-zinc-400 [font-family:var(--font-onest)]">
                {days === 1 ? "день" : days < 5 ? "дня" : "дней"} подряд
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-black/30 px-3 py-2.5 sm:max-w-[14rem]">
          <ShieldIcon className="mt-0.5 h-8 w-8 shrink-0 text-sky-400/90" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-300/90 [font-family:var(--font-onest)]">
              Защита серии
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
              {protectionHint}
            </p>
          </div>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-zinc-300 [font-family:var(--font-onest)]">
        {motivationalLine}
      </p>
    </GameCard>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 3L6 7v9c0 6.5 4.3 12.5 10 14 5.7-1.5 10-7.5 10-14V7l-10-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        className="opacity-90"
      />
      <path
        d="M16 9v8l4 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-60"
      />
    </svg>
  );
}
