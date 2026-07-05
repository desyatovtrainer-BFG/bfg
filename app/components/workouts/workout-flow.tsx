"use client";

import { useMemo, useState } from "react";
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
 * Состояние «начата» — локальное UI-состояние маршрута: персистентные
 * границы Start/Finish и эксклюзивность активной тренировки
 * (D049/D050/D058, «Вернуться к тренировке») сознательно отложены до
 * появления session-состояния — поэтому здесь нет и не может быть
 * ложного «Вернуться к тренировке».
 */

type ExerciseWithEmbed = {
  exercise: WorkoutExercise;
  embedUrl: string | null;
};

type WorkoutFlowProps = {
  workout: Workout;
  exercises: ExerciseWithEmbed[];
};

type StepItem = {
  key: string;
  /** «Приседания» или «Тяга + Скручивания» (суперсет = один Шаг, D060/D065). */
  label: string;
};

export function WorkoutFlow({ workout, exercises }: WorkoutFlowProps) {
  const [started, setStarted] = useState(false);

  const steps = useMemo(
    () => buildStepList(exercises.map((e) => e.exercise)),
    [exercises],
  );

  if (started) {
    // Существующая сессия — без изменений (свайп-слайдер, финальный слайд,
    // существующее завершение).
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

      {/* Единственная кнопка — граница старта (D049): просмотр ≠ старт. */}
      <div className="mx-auto w-full max-w-[420px]">
        <GameButton
          variant="primary"
          type="button"
          disabled={steps.length === 0}
          onClick={() => setStarted(true)}
          className="min-h-[3.25rem] w-full py-3.5 text-base"
        >
          Начать тренировку
        </GameButton>
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
