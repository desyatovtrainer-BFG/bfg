"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { startWorkoutAction } from "@/lib/workout-sessions";
import { detectSupersets, type Workout, type WorkoutExercise } from "@/lib/workouts";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameButton } from "../ui/game-button";
import { ScreenHeader } from "../ui/screen-header";
import { WorkoutSessionScreen } from "./workout-session-screen";

/**
 * WorkoutFlow — обёртка принятого потока тренировки (слайс 7A):
 *
 *   Экран старта (D062) → [Начать тренировку — граница старта, D049]
 *   → существующая сессия-слайдер (свайп, D063) → финальный слайд (D066)
 *   → существующий completeWorkoutAction (граница завершения, D050).
 *
 * Ключевое: WorkoutSessionScreen НЕ изменён — вся логика завершения,
 * идемпотентность, XP/стрик и FeedbackOverlay работают ровно как раньше.
 * Обёртка добавляет только пред-стартовый экран.
 *
 * Экран старта (D062): название + упорядоченный список Шагов + одна
 * кнопка «Начать тренировку». Без длительности, сложности, категорий,
 * аналитики и контента компаньона. Шаг (D060) здесь — временный мост
 * поверх плоской модели: суперсет-пара (detectSupersets) = один Шаг
 * с двумя упражнениями, одиночное упражнение = один Шаг. Карточка в
 * Activity считает УПРАЖНЕНИЯ, этот список — ШАГИ (D068).
 *
 * Источник правды «В процессе» (слайс 7B) — серверная workout-сессия
 * (workout_sessions, D058): старт создаёт активную сессию через
 * startWorkoutAction (граница D049), завершение закрывает её через
 * finishActiveWorkoutAction (граница D050, внутри сессии-слайдера).
 * Локальный `started` лишь открывает слайдер в текущем визите.
 *
 * Три варианта Экрана старта (D058/D062):
 *   1) активной сессии нет → «Начать тренировку» (создаёт сессию);
 *   2) активна ЭТА тренировка → «Вернуться к тренировке» (открывает слайдер);
 *   3) активна ДРУГАЯ → «Вернуться к тренировке» ведёт к ней; контент
 *      текущей остаётся просматриваемым — ничего не блокируется (D047).
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
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const steps = useMemo(
    () => buildStepList(exercises.map((e) => e.exercise)),
    [exercises],
  );

  const isThisActive = activeWorkoutId === workout.id;
  const isOtherActive = activeWorkoutId !== null && !isThisActive;

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
      setStarted(true);
    });
  };

  if (started) {
    // Существующая сессия — без изменений (свайп-слайдер, финальный слайд,
    // завершение через обёртку внутри слайдера).
    return <WorkoutSessionScreen workout={workout} exercises={exercises} />;
  }

  return (
    <CinematicCanvas className="min-h-dvh" contentClassName="flex min-h-dvh flex-col pb-8">
      <ScreenHeader title={workout.title} backHref="/workouts" backLabel="К активности" />

      {/* Упорядоченный список Шагов (D062): показывает форму сессии. */}
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

      {/* Единственная primary-кнопка. Три варианта (D058/D062). */}
      <div className="mx-auto w-full max-w-[420px] space-y-3">
        {isOtherActive ? (
          <>
            <p className="text-center text-xs text-zinc-500 [font-family:var(--font-onest)]">
              Сейчас активна другая тренировка.
            </p>
            <GameButton
              variant="primary"
              href={`/workouts/${activeWorkoutId}`}
              className="min-h-[3.25rem] w-full py-3.5 text-base"
            >
              Вернуться к тренировке
            </GameButton>
          </>
        ) : isThisActive ? (
          <GameButton
            variant="primary"
            type="button"
            onClick={() => setStarted(true)}
            className="min-h-[3.25rem] w-full py-3.5 text-base"
          >
            Вернуться к тренировке
          </GameButton>
        ) : (
          <GameButton
            variant="primary"
            type="button"
            disabled={steps.length === 0 || isPending}
            onClick={handleStart}
            className="min-h-[3.25rem] w-full py-3.5 text-base"
          >
            {isPending ? "Начинаем…" : "Начать тренировку"}
          </GameButton>
        )}

        {error ? (
          <p className="text-center text-sm text-rose-300 [font-family:var(--font-onest)]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </CinematicCanvas>
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
