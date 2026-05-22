"use client";

/**
 * FinishSlide — финальный слайд сессии с кнопкой «Завершить тренировку».
 * Атмосферный градиентный фон вместо видео — даёт паузу перед завершением.
 * Вызов completeWorkoutAction происходит в оркестраторе; сюда приходит
 * только pending-флаг, текст ошибки и колбэк onComplete.
 */

import { motion, useReducedMotion } from "framer-motion";
import { formatWorkoutDuration, type Workout } from "@/lib/workouts";
import { GameButton } from "../ui/game-button";

// BottomNav подавлен на /workouts/[id] — резервируем только home-indicator
// и комфортный воздух под кнопкой завершения (1.5rem).
const BOTTOM_SAFE = "calc(env(safe-area-inset-bottom) + 1.5rem)";

type FinishSlideProps = {
  workout: Workout;
  isPending: boolean;
  error: string | null;
  onComplete: () => void;
};

export function FinishSlide({
  workout,
  isPending,
  error,
  onComplete,
}: FinishSlideProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-black">
      {/* Спокойная атмосферная подложка вместо очередного видео-фрейма. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_30%,rgba(167,139,250,0.14),transparent_60%),radial-gradient(80%_60%_at_50%_85%,rgba(56,189,248,0.1),transparent_60%),linear-gradient(180deg,#08080b,#000)]" />

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] flex flex-col gap-7 px-6 pt-24"
        style={{ paddingBottom: BOTTOM_SAFE }}
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [font-family:var(--font-onest)]">
            {formatWorkoutDuration(workout.durationMin)} · путь близится
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white [font-family:var(--font-unbounded)] sm:text-4xl">
            {workout.title}
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            Сделай вдох. Когда будешь готов — заверши тренировку.
          </p>
        </div>

        <GameButton
          variant="primary"
          type="button"
          onClick={onComplete}
          disabled={isPending}
          className="w-full py-3.5 text-sm"
        >
          {isPending ? "Завершаем…" : "Завершить тренировку"}
        </GameButton>

        {error ? (
          <p className="text-center text-sm text-rose-400 [font-family:var(--font-onest)]">
            {error}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
