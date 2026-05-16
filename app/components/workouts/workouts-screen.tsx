"use client";

/**
 * MVP-экран тренировок.
 *
 * Намеренно простой: список из заранее заданных тренировок и одна
 * кнопка «Завершить тренировку» на каждую. Никакого таймера, никакой
 * истории, никакого мульти-степ потока — это всё появится позже, когда
 * MVP-петля «движение → XP → эмоция» будет проверена.
 *
 * После успешного завершения показываем GameCard с реакцией компаньона
 * прямо под списком. Карточка живёт до следующего нажатия — чтобы
 * пользователь успел прочитать и почувствовать момент.
 */

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  completeWorkoutAction,
  type CompleteWorkoutResponse,
} from "@/lib/workouts/actions";
import { MVP_WORKOUTS, type MvpWorkout } from "@/lib/workouts/mvp-workouts";
import { GameButton } from "../ui/game-button";
import { GameCard } from "../ui/game-card";

type FeedbackState = NonNullable<CompleteWorkoutResponse["data"]>;

export function WorkoutsScreen() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleComplete = (workout: MvpWorkout) => {
    setPendingId(workout.id);
    setError(null);
    startTransition(async () => {
      const res = await completeWorkoutAction(workout.id);
      setPendingId(null);
      if (res.error || !res.data) {
        setError(res.error ?? "Что-то пошло не так.");
        return;
      }
      setFeedback(res.data);
    });
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_70%_at_50%_-20%,rgba(56,189,248,0.1),transparent_50%),radial-gradient(80%_50%_at_100%_30%,rgba(167,139,250,0.07),transparent_50%)]" />

      <div className="relative z-[1] mx-auto max-w-lg px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] sm:px-5">
        <header className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600 [font-family:var(--font-onest)]">
            Big Fitness Game
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            Тренировки
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
            Выбери подходящий настрой и заверши тренировку — путь продолжается.
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {MVP_WORKOUTS.map((w) => {
            const isPending = pendingId === w.id;
            return (
              <li key={w.id}>
                <GameCard glow={w.accent} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-white [font-family:var(--font-onest)]">
                        {w.title}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500 [font-family:var(--font-onest)]">
                        {w.subtitle}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-300 [font-family:var(--font-onest)]">
                      {w.duration}
                    </span>
                  </div>
                  <GameButton
                    variant="primary"
                    type="button"
                    onClick={() => handleComplete(w)}
                    disabled={isPending}
                    className="mt-4 w-full py-3 text-sm"
                  >
                    {isPending ? "Завершаем…" : "Завершить тренировку"}
                  </GameButton>
                </GameCard>
              </li>
            );
          })}
        </ul>

        <AnimatePresence>
          {feedback ? (
            <motion.section
              key={`${feedback.workoutId}-${feedback.totalXp}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
              aria-live="polite"
            >
              <FeedbackCard feedback={feedback} />
            </motion.section>
          ) : null}
        </AnimatePresence>

        {error ? (
          <p className="mt-4 text-center text-sm text-rose-400 [font-family:var(--font-onest)]">
            {error}
          </p>
        ) : null}

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
          >
            ← На главную
          </Link>
        </div>
      </div>
    </div>
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
