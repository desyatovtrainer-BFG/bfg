"use client";

import { AnimatePresence, motion } from "framer-motion";

type DailyCompletionBannerProps = {
  show: boolean;
  reducedMotion?: boolean;
};

export function DailyCompletionBanner({ show, reducedMotion = false }: DailyCompletionBannerProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="day-done"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="relative mb-6 overflow-hidden rounded-3xl border border-amber-400/35 bg-gradient-to-b from-amber-500/20 via-amber-950/20 to-violet-950/30 p-5 shadow-[0_0_48px_-12px_rgba(251,191,36,0.35)] sm:p-6"
        >
          {!reducedMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-1/3 top-0 h-full w-2/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ["-20%", "180%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
            />
          ) : null}
          <div className="relative text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-200/90 [font-family:var(--font-onest)]">
              День закрыт контрактом
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
              Ты выиграл сегодняшний раунд
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-amber-100/85 [font-family:var(--font-onest)]">
              Вселенная BFG запомнила твой рывок. Дофамин закономерен — а завтра здесь снова ждут сокровища и новый
              слой эволюции. Вернись за следующей порцией победы.
            </p>
            <p className="mt-4 text-xs font-medium text-zinc-500 [font-family:var(--font-onest)]">
              Новые контракты — в 00:00. Один заход завтра — и цепь привычки станет крепче.
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
