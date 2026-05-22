"use client";

/**
 * FeedbackOverlay — полноэкранный результирующий оверлей после завершения тренировки.
 * Показывается поверх слайдера через AnimatePresence в WorkoutSessionScreen.
 * FeedbackChip — вспомогательный бейдж XP / уровня / эволюции внутри оверлея.
 * FeedbackState — производный тип ответа сервера, публичный для оркестратора.
 */

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { type CompleteWorkoutResponse } from "@/lib/workouts";
import { GameButton } from "../ui/game-button";
import { getAvatarFormLabel } from "@/lib/progression/avatar-evolution";

export type FeedbackState = NonNullable<CompleteWorkoutResponse["data"]>;

export function FeedbackOverlay({ feedback }: { feedback: FeedbackState }) {
  const shouldReduceMotion = useReducedMotion();

  const { companion, xpGained, newLevel, leveledUp, evolved, evolution, alreadyCompleted } =
    feedback;

  const headline = alreadyCompleted
    ? "Сегодня уже засчитано"
    : evolved
      ? "Эволюция аватара"
      : leveledUp
        ? "Новый уровень"
        : "Тренировка завершена";

  // Soft violet atmospheric glow for evolution — fades in gently, no flash.
  const evolvedGlow =
    evolved && !shouldReduceMotion ? "0 0 80px 8px rgba(139, 92, 246, 0.10)" : "none";

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
    >
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
        animate={{ opacity: 1, y: 0, boxShadow: evolvedGlow }}
        transition={{
          default: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
          boxShadow: { duration: 0.8, delay: 0.3, ease: "easeOut" },
        }}
        className="w-full max-w-sm"
      >
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400 [font-family:var(--font-onest)]">
          {headline}
        </p>
        <p className="mt-5 text-balance text-center text-xl font-medium leading-relaxed text-white [font-family:var(--font-unbounded)]">
          {companion.message}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {alreadyCompleted ? (
            <FeedbackChip>XP уже начислен</FeedbackChip>
          ) : (
            <FeedbackChip>+{xpGained} опыта</FeedbackChip>
          )}
          {leveledUp ? (
            <FeedbackChip accent="violet" pulse reducedMotion={shouldReduceMotion}>
              Уровень {newLevel}
            </FeedbackChip>
          ) : null}
          {evolved ? (
            <FeedbackChip accent="gold">{getAvatarFormLabel(evolution.form)}</FeedbackChip>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <GameButton
            href="/workouts"
            variant="secondary"
            className="w-full py-3 text-sm"
          >
            К другим тренировкам
          </GameButton>
          <GameButton
            href="/dashboard"
            variant="ghost"
            className="w-full py-3 text-sm"
          >
            На главную
          </GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeedbackChip({
  children,
  accent,
  pulse = false,
  reducedMotion,
}: {
  children: ReactNode;
  accent?: "violet" | "gold";
  pulse?: boolean;
  reducedMotion?: boolean | null;
}) {
  const weight = accent === "violet" ? "font-semibold" : "font-medium";
  const tone =
    accent === "gold"
      ? "border-amber-300/35 text-amber-200"
      : accent === "violet"
        ? "border-violet-400/50 text-violet-100"
        : "border-white/15 text-zinc-200";

  const cls = `rounded-full border bg-white/[0.04] px-3 py-1 text-xs ${weight} [font-family:var(--font-onest)] ${tone}`;

  if (pulse && !reducedMotion) {
    return (
      <motion.span
        className={cls}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
      >
        {children}
      </motion.span>
    );
  }

  return <span className={cls}>{children}</span>;
}
