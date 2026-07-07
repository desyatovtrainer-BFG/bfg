"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { startWorkoutAction } from "@/lib/workout-sessions";
import { detectSupersets, type Workout, type WorkoutExercise } from "@/lib/workouts";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameButton } from "../ui/game-button";
import { WorkoutSessionScreen } from "./workout-session-screen";

/**
 * WorkoutFlow — принятый поток тренировки (D049/D050/D052/D058/D062,
 * UX-фикс слайса 11):
 *
 *   ПРЕВЬЮ (по умолчанию): карусель [Экран старта, Упр.1…N] — с Экрана
 *   старта свайп сразу ведёт в упражнения/видео (D052: просмотр открыт,
 *   отдельной кнопки-шлюза нет); сессия НЕ создаётся, FinishSlide нет,
 *   на слайдах упражнений — чип «не начата».
 *
 *   СЕССИЯ: после «Начать тренировку» (единственная граница старта,
 *   D049 — startWorkoutAction) компонент слайдера пересоздаётся по key,
 *   поэтому активная сессия ВСЕГДА начинается с первого упражнения,
 *   а в конце появляется FinishSlide → существующее завершение →
 *   Reward Modal (без изменений).
 *
 * Экран старта (D062): название + упорядоченный список Шагов + одна
 * primary-кнопка. Шаг — временный мост поверх плоской модели: суперсет-
 * пара (detectSupersets) = один Шаг «A + B» (D060/D065/D068).
 *
 * Три состояния маршрута (D058, active-state фикс):
 *   нет активной        → превью; primary «Начать тренировку»;
 *   активна ЭТА         → СРАЗУ активная сессия (слайды + FinishSlide,
 *                         без чипа «не начата», без кнопки-шлюза) —
 *                         view инициализируется как "session";
 *   активна ДРУГАЯ      → превью; primary «Вернуться к тренировке» → к ней
 *                         (контент остаётся просматриваемым, D047).
 */

type ExerciseWithEmbed = {
  exercise: WorkoutExercise;
  embedUrl: string | null;
};

type WorkoutFlowProps = {
  workout: Workout;
  exercises: ExerciseWithEmbed[];
  /** id тренировки с активной сессией (server-truth, D058); null — нет активной. */
  activeWorkoutId: string | null;
};

type StepItem = {
  key: string;
  /** «Приседания» или «Тяга + Скручивания» (суперсет = один Шаг, D060/D065). */
  label: string;
};

export function WorkoutFlow({ workout, exercises, activeWorkoutId }: WorkoutFlowProps) {
  const router = useRouter();

  const isThisActive = activeWorkoutId === workout.id;
  const isOtherActive = activeWorkoutId !== null && !isThisActive;

  // Активна ЭТА тренировка (server-truth) → маршрут открывает активную
  // сессию сразу: пользователь УЖЕ на активной тренировке, кнопка
  // «Вернуться к тренировке» здесь не нужна (она — только для другой).
  const [view, setView] = useState<"preview" | "session">(
    isThisActive ? "session" : "preview",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const steps = useMemo(
    () => buildStepList(exercises.map((e) => e.exercise)),
    [exercises],
  );

  // Граница старта (D049): сессия создаётся только этим нажатием.
  const handleStart = () => {
    setError(null);
    startTransition(async () => {
      const res = await startWorkoutAction(workout.id);
      if (res.error || !res.data) {
        setError(res.error ?? "Не удалось начать тренировку.");
        return;
      }
      if (res.data.outcome === "active_elsewhere") {
        // Активна другая тренировка (D058) — ведём к ней.
        router.push(`/workouts/${res.data.activeWorkoutId}`);
        return;
      }
      setView("session");
    });
  };

  if (view === "session") {
    // key пересоздаёт слайдер: активная сессия начинается с Упражнения 1,
    // а не с позиции, на которой закончилось превью.
    return <WorkoutSessionScreen key="session" workout={workout} exercises={exercises} />;
  }

  // Превью достижимо только когда ЭТА тренировка НЕ активна
  // (active-same инициализируется сразу в "session").
  return (
    <WorkoutSessionScreen
      key="preview"
      workout={workout}
      exercises={exercises}
      mode="preview"
      startSlide={
        <StartSlide
          workout={workout}
          steps={steps}
          isPending={isPending}
          error={error}
          primaryLabel={isOtherActive ? "Вернуться к тренировке" : "Начать тренировку"}
          onPrimary={
            isOtherActive
              ? () => router.push(`/workouts/${activeWorkoutId}`)
              : handleStart
          }
          otherActiveNote={isOtherActive}
        />
      }
    />
  );
}

/**
 * Экран старта как слайд 0 превью-карусели (D062). Кнопку «назад» несёт
 * TopBar слайдера (→ /workouts); свайп вправо ведёт в упражнения.
 */
function StartSlide({
  workout,
  steps,
  isPending,
  error,
  primaryLabel,
  onPrimary,
  otherActiveNote,
}: {
  workout: Workout;
  steps: StepItem[];
  isPending: boolean;
  error: string | null;
  primaryLabel: string;
  onPrimary: () => void;
  otherActiveNote: boolean;
}) {
  return (
    <div className="h-full w-full overflow-y-auto">
      <CinematicCanvas
        className="min-h-full"
        contentClassName="flex min-h-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(4rem,calc(env(safe-area-inset-top)+3.25rem))]"
      >
        <h1 className="text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
          {workout.title}
        </h1>

        {/* Упорядоченный список Шагов (D062): форма сессии. */}
        <section className="mt-6 flex-1">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
            Шаги
          </h2>
          {steps.length === 0 ? (
            <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
              Состав тренировки уточняется. Загляни позже.
            </p>
          ) : (
            <ol className="space-y-2.5">
              {steps.map((step, i) => (
                <li
                  key={step.key}
                  className="flex items-baseline gap-3 border-b border-white/[0.06] pb-2.5 text-sm [font-family:var(--font-onest)]"
                >
                  <span className="w-5 shrink-0 text-right tabular-nums text-zinc-500">
                    {i + 1}.
                  </span>
                  <span className="text-zinc-200">{step.label}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="mx-auto mt-6 w-full max-w-[420px] space-y-3">
          {otherActiveNote ? (
            <p className="text-center text-xs text-zinc-500 [font-family:var(--font-onest)]">
              Сейчас активна другая тренировка.
            </p>
          ) : null}

          <GameButton
            variant="primary"
            type="button"
            disabled={steps.length === 0 || isPending}
            onClick={onPrimary}
            className="min-h-[3.25rem] w-full py-3.5 text-base"
          >
            {isPending ? "Начинаем…" : primaryLabel}
          </GameButton>

          {/* Спокойная подсказка вместо отдельной кнопки-шлюза (D052). */}
          {steps.length > 0 ? (
            <p className="text-center text-xs text-zinc-600 [font-family:var(--font-onest)]">
              Свайпни, чтобы посмотреть упражнения
            </p>
          ) : null}

          {error ? (
            <p className="text-center text-sm text-rose-300 [font-family:var(--font-onest)]" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </CinematicCanvas>
    </div>
  );
}

/**
 * Временный мост «плоские упражнения → Шаги» (D060): суперсет-пара из
 * detectSupersets становится одним двух-упражнений Шагом («A + B» — без
 * "1/2", без ярлыка «2 упражнения», D065), остальное — по одному Шагу.
 */
function buildStepList(exercises: WorkoutExercise[]): StepItem[] {
  const supersetMap = detectSupersets(exercises);
  const steps: StepItem[] = [];
  for (let i = 0; i < exercises.length; i += 1) {
    const pos = supersetMap.get(i)?.position ?? null;
    if (pos === "second") continue; // уже вошло в Шаг первой половины пары
    const ex = exercises[i]!;
    if (pos === "first" && exercises[i + 1]) {
      steps.push({ key: ex.id, label: `${ex.title} + ${exercises[i + 1]!.title}` });
    } else {
      steps.push({ key: ex.id, label: ex.title });
    }
  }
  return steps;
}
