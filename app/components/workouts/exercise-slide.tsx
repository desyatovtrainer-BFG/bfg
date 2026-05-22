"use client";

/**
 * ExerciseSlide — полноэкранный слайд одного упражнения.
 * Отображает видео-карточку (iframe Kinescope или VideoBackdrop-заглушку)
 * и мета-блок с заголовком, описанием и длительностью.
 * VideoBackdrop — дешёвая атмосферная подложка для офф-скрин и беззаписных слайдов.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  formatExerciseDuration,
  type SupersetPosition,
  type WorkoutExercise,
} from "@/lib/workouts";

// BottomNav подавлен на /workouts/[id] — резервируем только home-indicator
// и комфортный воздух под мета-блоком (1.5rem). На устройствах без
// home-indicator safe-area-inset-bottom = 0, итого 24px дышащего пространства.
const BOTTOM_SAFE = "calc(env(safe-area-inset-bottom) + 1.5rem)";

type ExerciseSlideProps = {
  exercise: WorkoutExercise;
  embedUrl: string | null;
  indexLabel: string;
  isNearActive: boolean;
  isFinal?: boolean;
  /** Non-null when this slide is part of a valid consecutive superset pair. */
  supersetPosition?: SupersetPosition | null;
};

export function ExerciseSlide({
  exercise,
  embedUrl,
  indexLabel,
  isNearActive,
  isFinal = false,
  supersetPosition = null,
}: ExerciseSlideProps) {
  const shouldReduceMotion = useReducedMotion();

  // max-width карточки: вычитаем safe-area с обеих сторон и фиксированные
  // rem-зоны, чтобы 9:16 всегда влезал по высоте без горизонтального
  // overflow и без наползания под чёлку или home-indicator.
  // 15.75rem = 3.75rem (top padding) + 1.5rem (bottom padding) + 10.5rem (meta)
  // Ранее было 18.5rem — разница 2.75rem = убранный резерв под BottomNav.
  const cardMaxWidth =
    "calc((100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 15.75rem) * 9 / 16)";

  return (
    <div
      className="relative flex h-full w-full flex-col bg-black"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 3.75rem)",
        paddingBottom: BOTTOM_SAFE,
      }}
    >
      {isFinal && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(167,139,250,0.07),transparent_60%)]"
        />
      )}
      <div className="flex min-h-0 flex-1 items-center justify-center px-5">
        <motion.div
          key={`${exercise.id}:video`}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_28px_60px_-26px_rgba(0,0,0,0.85)]"
          style={{ maxWidth: cardMaxWidth }}
        >
          {embedUrl && isNearActive ? (
            <iframe
              src={embedUrl}
              title={exercise.title}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <VideoBackdrop />
          )}
        </motion.div>
      </div>

      <motion.div
        key={`${exercise.id}:meta`}
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="px-6 pt-5"
      >
        <div className="flex items-center gap-2.5">
          {supersetPosition ? (
            <span className="text-xs font-normal uppercase tracking-[0.15em] text-zinc-600/70 [font-family:var(--font-onest)]">
              суперсет
            </span>
          ) : null}
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 tabular-nums [font-family:var(--font-onest)]">
            {indexLabel}
          </span>
        </div>
        <h2 className="mt-2 text-xl font-bold leading-tight text-white [font-family:var(--font-unbounded)]">
          {exercise.title}
        </h2>
        {exercise.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            {exercise.description}
          </p>
        ) : null}
        <p className="mt-3 text-xs tabular-nums text-zinc-500 [font-family:var(--font-onest)]">
          {formatExerciseDuration(exercise.durationSec)}
        </p>
      </motion.div>
    </div>
  );
}

function VideoBackdrop() {
  // Лёгкая «дышащая» подложка для слайдов вне активной зоны и для упражнений
  // без видео. Дешевле, чем держать iframe в DOM, и сразу даёт нужный тон.
  return (
    <div className="relative h-full w-full bg-[radial-gradient(70%_60%_at_50%_40%,rgba(56,189,248,0.1),transparent_60%),linear-gradient(180deg,#0a0a0e,#000)]">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-zinc-300 backdrop-blur"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 7.5v9l7-4.5-7-4.5z"
            fill="currentColor"
            opacity="0.85"
          />
        </svg>
      </div>
    </div>
  );
}
