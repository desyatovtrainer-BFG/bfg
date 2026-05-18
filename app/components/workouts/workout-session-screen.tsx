"use client";

/**
 * Экран сессии одной тренировки (MVP).
 *
 * Тренировка — это упорядоченная последовательность упражнений
 * (см. миграцию 0005_workout_exercises). На экране показываем шапку
 * (название, теги, описание) и список шагов; у каждого шага свой
 * видео-слот, заранее готовый под Kinescope.
 *
 * Минимальная петля без сложного трекинга:
 *   idle    → пользователь видит план тренировки и описание шагов;
 *   active  → нажал «Начать», карточка действия показывает спокойный статус;
 *   done    → нажал «Завершить», прилетает фидбек (XP, уровень, реплика
 *             компаньона) поверх той же карточки.
 *
 * Сознательно НЕ делаем:
 *   - таймер обратного отсчёта,
 *   - чек-листы выполненных упражнений,
 *   - подсчёт повторов/калорий.
 * Это уведёт MVP в сторону трекера и нарушит правило «эмоция > статистика».
 */

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  completeWorkoutAction,
  formatExerciseDuration,
  formatWorkoutDuration,
  WORKOUT_DIFFICULTY_ACCENT,
  WORKOUT_DIFFICULTY_LABELS,
  type CompleteWorkoutResponse,
  type Workout,
  type WorkoutExercise,
} from "@/lib/workouts";
import { GameButton } from "../ui/game-button";
import { GameCard } from "../ui/game-card";

type FeedbackState = NonNullable<CompleteWorkoutResponse["data"]>;
type SessionStatus = "idle" | "active" | "done";

type ExerciseWithEmbed = {
  exercise: WorkoutExercise;
  /** Готовый embed-URL или null, если у шага ещё нет ролика. */
  embedUrl: string | null;
};

type WorkoutSessionScreenProps = {
  workout: Workout;
  exercises: ExerciseWithEmbed[];
};

export function WorkoutSessionScreen({
  workout,
  exercises,
}: WorkoutSessionScreenProps) {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const accent = WORKOUT_DIFFICULTY_ACCENT[workout.difficulty];

  const handleStart = () => {
    setError(null);
    setStatus("active");
  };

  const handleComplete = () => {
    setError(null);
    startTransition(async () => {
      const res = await completeWorkoutAction(workout.id);
      if (res.error || !res.data) {
        setError(res.error ?? "Что-то пошло не так.");
        return;
      }
      setFeedback(res.data);
      setStatus("done");
    });
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_70%_at_50%_-20%,rgba(56,189,248,0.1),transparent_50%),radial-gradient(80%_50%_at_100%_30%,rgba(167,139,250,0.07),transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-lg px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] sm:px-5">
        <header className="mb-5">
          <Link
            href="/workouts"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-300 [font-family:var(--font-onest)]"
          >
            ← К тренировкам
          </Link>
        </header>

        <section>
          <h1 className="text-2xl font-bold leading-tight text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            {workout.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <MetaTag>{WORKOUT_DIFFICULTY_LABELS[workout.difficulty]}</MetaTag>
            <MetaTag>{formatWorkoutDuration(workout.durationMin)}</MetaTag>
            <MetaTag>{workout.category}</MetaTag>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            {workout.description}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [font-family:var(--font-onest)]">
            Упражнения
          </h2>
          {exercises.length === 0 ? (
            <GameCard glow="none" className="p-4 text-center">
              <p className="text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
                Шаги тренировки скоро появятся. Путь продолжается.
              </p>
            </GameCard>
          ) : (
            <ul className="flex flex-col gap-3">
              {exercises.map(({ exercise, embedUrl }, idx) => (
                <li key={exercise.id}>
                  <ExerciseCard
                    exercise={exercise}
                    embedUrl={embedUrl}
                    indexLabel={formatIndex(idx)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6">
          <GameCard glow={status === "done" ? "none" : accent} className="p-4">
            <StatusBlock status={status} />

            {status === "idle" ? (
              <GameButton
                variant="primary"
                type="button"
                onClick={handleStart}
                className="mt-4 w-full py-3 text-sm"
              >
                Начать тренировку
              </GameButton>
            ) : null}

            {status === "active" ? (
              <GameButton
                variant="primary"
                type="button"
                onClick={handleComplete}
                disabled={isPending}
                className="mt-4 w-full py-3 text-sm"
              >
                {isPending ? "Завершаем…" : "Завершить тренировку"}
              </GameButton>
            ) : null}
          </GameCard>
        </section>

        {error ? (
          <p className="mt-4 text-center text-sm text-rose-400 [font-family:var(--font-onest)]">
            {error}
          </p>
        ) : null}

        <AnimatePresence>
          {feedback ? (
            <motion.section
              key={`${feedback.workoutId}-${feedback.totalXp}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5"
              aria-live="polite"
            >
              <FeedbackCard feedback={feedback} />
              <div className="mt-5 flex flex-col gap-2">
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
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  embedUrl,
  indexLabel,
}: {
  exercise: WorkoutExercise;
  embedUrl: string | null;
  indexLabel: string;
}) {
  return (
    <GameCard glow="none" className="overflow-hidden p-0">
      <VideoSlot embedUrl={embedUrl} title={exercise.title} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-600 tabular-nums [font-family:var(--font-onest)]">
              {indexLabel}
            </p>
            <h3 className="mt-1 text-base font-semibold text-white [font-family:var(--font-onest)]">
              {exercise.title}
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-300 [font-family:var(--font-onest)]">
            {formatExerciseDuration(exercise.durationSec)}
          </span>
        </div>
        {exercise.description ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
            {exercise.description}
          </p>
        ) : null}
      </div>
    </GameCard>
  );
}

function VideoSlot({
  embedUrl,
  title,
}: {
  embedUrl: string | null;
  title: string;
}) {
  return (
    <div className="relative aspect-video w-full border-b border-white/[0.05]">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <VideoPlaceholder />
      )}
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(56,189,248,0.08),transparent_60%)] text-zinc-500">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M10 8.6v6.8l5.6-3.4L10 8.6z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600 [font-family:var(--font-onest)]">
        Видео скоро появится
      </p>
    </div>
  );
}

function StatusBlock({ status }: { status: SessionStatus }) {
  if (status === "idle") {
    return (
      <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
        Когда будешь готов — начни. Никакой спешки.
      </p>
    );
  }
  if (status === "active") {
    return (
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
        </span>
        <p className="text-sm leading-relaxed text-zinc-300 [font-family:var(--font-onest)]">
          Тренировка идёт. Возвращайся, когда закончишь.
        </p>
      </div>
    );
  }
  return (
    <p className="text-sm leading-relaxed text-emerald-300/90 [font-family:var(--font-onest)]">
      Тренировка завершена.
    </p>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 [font-family:var(--font-onest)]">
      {children}
    </span>
  );
}

function FeedbackCard({ feedback }: { feedback: FeedbackState }) {
  const { companion, xpGained, newLevel, leveledUp, evolved, evolution } =
    feedback;

  const glow =
    companion.tone === "evolution"
      ? "gold"
      : companion.tone === "levelUp"
        ? "violet"
        : "cyan";

  const headline = evolved
    ? "Эволюция аватара"
    : leveledUp
      ? "Новый уровень"
      : "Тренировка завершена";

  return (
    <GameCard glow={glow} className="p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [font-family:var(--font-onest)]">
        {headline}
      </p>
      <p className="mt-3 text-base leading-relaxed text-white [font-family:var(--font-unbounded)]">
        {companion.message}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Опыт" value={`+${xpGained}`} />
        <Stat label="Уровень" value={String(newLevel)} accent={leveledUp} />
        <Stat
          label="Стадия"
          value={String(evolution.stage)}
          accent={evolved}
        />
      </div>
      {evolved ? (
        <p className="mt-3 text-xs text-amber-300/80 [font-family:var(--font-onest)]">
          Аватар перешёл в форму «{evolution.form}».
        </p>
      ) : null}
    </GameCard>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2.5 text-center ${
        accent ? "ring-1 ring-amber-300/30" : ""
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 [font-family:var(--font-onest)]">
        {label}
      </p>
      <p
        className={`mt-1 text-base font-bold tabular-nums [font-family:var(--font-unbounded)] ${
          accent ? "text-amber-200" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/** Подпись шага вида '01', '02', … — спокойный счётчик без слова «шаг». */
function formatIndex(zeroBased: number): string {
  return String(zeroBased + 1).padStart(2, "0");
}
