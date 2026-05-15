"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GameButton } from "../ui/game-button";
import { GameCard } from "../ui/game-card";

export type DailyRewardPanelProps = {
  dailyXp: number;
  streakBonusXp: number;
  reducedMotion?: boolean;
};

export function DailyRewardPanel({
  dailyXp,
  streakBonusXp,
  reducedMotion = false,
}: DailyRewardPanelProps) {
  const [claimed, setClaimed] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const handleClaim = () => {
    if (claimed) return;
    if (reducedMotion) {
      setClaimed(true);
      return;
    }
    setCelebrate(true);
    window.setTimeout(() => {
      setClaimed(true);
      setCelebrate(false);
    }, 900);
  };

  return (
    <GameCard glow="gold" className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(251,191,36,0.08),transparent_55%)]" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/80 [font-family:var(--font-onest)]">
            Награды дня
          </p>
          <h3 className="mt-2 text-xl font-bold text-white [font-family:var(--font-unbounded)]">Возвращение в игру</h3>
          <p className="mt-1 max-w-xs text-sm text-zinc-400 [font-family:var(--font-onest)]">
            Забери опыт за вход сегодня и бонус за серию — вселенная BFG отмечает твой шаг.
          </p>
        </div>
        <div
          aria-hidden
          className="hidden h-14 w-14 shrink-0 rounded-2xl border border-amber-400/20 bg-amber-400/10 text-2xl sm:flex sm:items-center sm:justify-center"
        >
          ✦
        </div>
      </div>

      <ul className="relative mt-5 space-y-3">
        <li className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/35 px-3 py-2.5">
          <span className="text-sm text-zinc-300 [font-family:var(--font-onest)]">Ежедневный бонус</span>
          <span className="text-sm font-bold tabular-nums text-amber-200 [font-family:var(--font-unbounded)]">
            +{dailyXp} XP
          </span>
        </li>
        <li className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/15 bg-rose-500/[0.06] px-3 py-2.5">
          <span className="text-sm text-zinc-200 [font-family:var(--font-onest)]">Бонус за серию</span>
          <span className="text-sm font-bold tabular-nums text-rose-200 [font-family:var(--font-unbounded)]">
            +{streakBonusXp} XP
          </span>
        </li>
      </ul>

      <div className="relative mt-5">
        <GameButton
          variant="primary"
          className="w-full py-3.5 text-base"
          type="button"
          disabled={claimed}
          onClick={handleClaim}
        >
          {claimed ? "Награды получены" : "Забрать награды"}
        </GameButton>
      </div>

      <AnimatePresence>
        {celebrate ? (
          <motion.div
            key="burst"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full bg-gradient-to-br from-amber-200 to-yellow-400"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * (90 + i * 6),
                  y: Math.sin((i / 12) * Math.PI * 2) * (90 + i * 6),
                  scale: [0, 1.2, 0.4],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-amber-300/40 bg-black/60 px-6 py-3 text-center backdrop-blur-md"
            >
              <p className="text-sm font-bold text-amber-100 [font-family:var(--font-unbounded)]">Получено!</p>
              <p className="text-xs text-amber-200/80 [font-family:var(--font-onest)]">
                +{dailyXp + streakBonusXp} XP на счёт эволюции
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {claimed ? (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-3 text-center text-xs text-zinc-500 [font-family:var(--font-onest)]"
        >
          Завтра снова ждёт награда — загляни первым делом.
        </motion.p>
      ) : null}
    </GameCard>
  );
}
