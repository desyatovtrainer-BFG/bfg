/**
 * MVP-каталог тренировок.
 *
 * Сам экран — просто список карточек. Завершение тренировки живёт
 * на отдельном экране сессии (`/workouts/[id]`), чтобы каталог
 * оставался спокойным и без статистики. Здесь — только выбор настроя
 * и переход в сессию.
 *
 * Архитектурно мы готовы к Kinescope: у каждой тренировки есть
 * `videoProvider` / `videoId`. Плеер показываем уже на экране сессии
 * через `getWorkoutVideoEmbedUrl` — карточкам в каталоге видео не нужно.
 */

import Link from "next/link";
import {
  formatWorkoutDuration,
  WORKOUT_DIFFICULTY_ACCENT,
  WORKOUT_DIFFICULTY_LABELS,
  type Workout,
} from "@/lib/workouts";
import { GameCard } from "../ui/game-card";

type WorkoutsScreenProps = {
  workouts: Workout[];
};

export function WorkoutsScreen({ workouts }: WorkoutsScreenProps) {
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
            Выбери подходящий настрой — путь продолжается.
          </p>
        </header>

        {workouts.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3">
            {workouts.map((w) => (
              <li key={w.id}>
                <WorkoutCard workout={w} />
              </li>
            ))}
          </ul>
        )}

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

function WorkoutCard({ workout }: { workout: Workout }) {
  const accent = WORKOUT_DIFFICULTY_ACCENT[workout.difficulty];

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
      aria-label={`Открыть тренировку: ${workout.title}`}
    >
      <GameCard glow={accent} className="p-4 transition-colors hover:border-white/[0.14]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white [font-family:var(--font-onest)]">
              {workout.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 [font-family:var(--font-onest)]">
              {workout.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-300 [font-family:var(--font-onest)]">
            {formatWorkoutDuration(workout.durationMin)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <MetaTag>{WORKOUT_DIFFICULTY_LABELS[workout.difficulty]}</MetaTag>
          <MetaTag>{workout.category}</MetaTag>
        </div>
      </GameCard>
    </Link>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 [font-family:var(--font-onest)]">
      {children}
    </span>
  );
}

function EmptyState() {
  return (
    <GameCard glow="none" className="p-5 text-center">
      <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
        Каталог тренировок пока пуст. Загляни позже — путь продолжается.
      </p>
    </GameCard>
  );
}
