"use client";

/**
 * Экран сессии тренировки — оркестратор/контейнер (MVP).
 *
 * Управляет состоянием: активный слайд, результат завершения, pending/error.
 * Вся логика слайдера (snap-scroll + IntersectionObserver) живёт здесь.
 * Рендер полностью делегирован узкоспециализированным компонентам:
 *   ExerciseSlide · FinishSlide · TopBar · DesktopArrows · RewardModal (D067)
 *
 * Сознательно НЕ показываем здесь:
 *   - таблицу шагов, тэги категории/сложности, статистику;
 *   - таймер обратного отсчёта, чек-листы повторов;
 *   - всё, что превращает сессию в дашборд.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { finishActiveWorkoutAction } from "@/lib/workout-sessions";
import {
  detectSupersets,
  type Workout,
  type WorkoutExercise,
} from "@/lib/workouts";
import { ExerciseSlide } from "./exercise-slide";
import { FinishSlide } from "./finish-slide";
import { TopBar } from "./session-top-bar";
import { DesktopArrows } from "./desktop-arrows";
import { RewardModal, type FeedbackState } from "./reward-modal";

type ExerciseWithEmbed = {
  exercise: WorkoutExercise;
  /** Готовый embed-URL или null, если у шага ещё нет ролика. */
  embedUrl: string | null;
};

type WorkoutSessionScreenProps = {
  workout: Workout;
  exercises: ExerciseWithEmbed[];
  /**
   * Режим слайдера (D052, UX-фикс слайса 11):
   *   "active" (default) — начатая сессия: [Упр.1…N, FinishSlide],
   *     завершение, Reward Modal;
   *   "preview" — просмотр ДО старта (D049: просмотр ≠ старт):
   *     [StartSlide, Упр.1…N] — Экран старта сам является слайдом 0,
   *     свайп сразу ведёт в упражнения; FinishSlide НЕТ (D050),
   *     на слайдах упражнений — постоянное «не начата»-напоминание.
   *
   * ВАЖНО: при смене режима родитель обязан пересоздать компонент
   * (key="preview" / key="session"), чтобы activeIndex сбросился и
   * активная сессия всегда начиналась с первого упражнения.
   */
  mode?: "preview" | "active";
  /** Preview: контент слайда 0 — Экран старта (D062). */
  startSlide?: React.ReactNode;
  /** Preview: показывать чип «не начата» (false, когда ЭТА тренировка активна). */
  previewChip?: boolean;
};

export function WorkoutSessionScreen({
  workout,
  exercises,
  mode = "active",
  startSlide,
  previewChip = true,
}: WorkoutSessionScreenProps) {
  const isPreview = mode === "preview";
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const shouldReduceMotion = useReducedMotion();
  const [showHint, setShowHint] = useState(false);
  // Permanently suppresses the hint once the user performs any swipe this session.
  const hasSwipedRef = useRef(false);
  const prevActiveIndexRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const hasExercises = exercises.length > 0;
  // Структура слайдов по режимам:
  //   preview: [StartSlide, Упр.1…N]  → упражнение j на слайде j+1, Finish нет;
  //   active:  [Упр.1…N, FinishSlide] → как раньше.
  const slideOffset = isPreview ? 1 : 0;
  const totalSlides = exercises.length + 1;
  const finishIndex = isPreview ? -1 : exercises.length;

  // Superset detection: pure, O(n), stable across re-renders (exercises is a
  // server-supplied prop that never mutates during a session).
  const supersetMap = detectSupersets(exercises.map((e) => e.exercise));
  // Indices of the first slide in each valid superset pair — passed to TopBar
  // and used to gate the paired-dot rendering. Empty array = normal workout.
  // TopBar ждёт индексы СЛАЙДОВ — в preview сдвинуты на стартовый слайд.
  const supersetPairStarts: number[] = [];
  for (const [idx, info] of supersetMap) {
    if (info.position === "first") supersetPairStarts.push(idx + slideOffset);
  }

  const handleComplete = () => {
    setError(null);
    startTransition(async () => {
      // 7B: обёртка = существующее завершение (XP/стрик без изменений)
      // + закрытие активной сессии (граница D050).
      const res = await finishActiveWorkoutAction(workout.id);
      if (res.error || !res.data) {
        setError(res.error ?? "Что-то пошло не так.");
        return;
      }
      setFeedback(res.data);
    });
  };

  // Программный переход к слайду — нужен для desktop-стрелок (на мобиле
  // пользователь свайпает пальцем, и эта функция не используется).
  // scrollIntoView({ inline: "center" }) бережно встаёт по snap-точкам,
  // не дергая IntersectionObserver — он сам подхватит новый активный слайд.
  const goTo = useCallback((idx: number) => {
    const el = slideRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  // Отслеживаем активный слайд через IntersectionObserver внутри
  // scroll-snap контейнера — самый дешёвый способ синхронизировать
  // прогресс-дотс с реальным положением скролла на мобиле.
  useEffect(() => {
    if (!hasExercises) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = Number((entry.target as HTMLElement).dataset.index);
          }
        }
        if (bestIdx >= 0 && bestRatio >= 0.6) {
          setActiveIndex(bestIdx);
        }
      },
      { root: scroller, threshold: [0.6, 0.85] },
    );

    for (const el of slideRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [exercises.length, hasExercises]);

  // Idle swipe hint: surfaces after ~5.75s of inactivity on an exercise slide,
  // stays visible for ~5s, then fades out. Permanently suppressed once the user
  // performs any swipe. Never shown on FinishSlide or when there is only one exercise.
  useEffect(() => {
    const clearHintTimers = () => {
      if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
      if (dismissTimerRef.current) { clearTimeout(dismissTimerRef.current); dismissTimerRef.current = null; }
    };

    const prevIndex = prevActiveIndexRef.current;
    prevActiveIndexRef.current = activeIndex;

    // Any genuine slide change counts as the first swipe.
    if (prevIndex !== activeIndex) {
      hasSwipedRef.current = true;
      clearHintTimers();
      setShowHint(false);
    }

    // After first swipe, on the last swipe target, or when there is nowhere
    // to swipe: nothing to do. In preview the hint on slide 0 (Start Screen)
    // is deliberate — it communicates swipe availability (D052 UX fix).
    const hintStopIndex = isPreview ? totalSlides - 1 : finishIndex;
    const hintUnavailable = isPreview ? totalSlides <= 1 : finishIndex <= 1;
    if (hasSwipedRef.current || activeIndex >= hintStopIndex || hintUnavailable) {
      return clearHintTimers;
    }

    // Start the idle countdown for this exercise slide.
    idleTimerRef.current = setTimeout(() => {
      setShowHint(true);
      dismissTimerRef.current = setTimeout(() => setShowHint(false), 5000);
    }, 5750);

    return clearHintTimers;
  }, [activeIndex, finishIndex, isPreview, totalSlides]);

  // Контент пуст: в active-режиме — спокойная заглушка; в preview
  // карусель остаётся из одного стартового слайда (кнопка старта там
  // и так заблокирована при пустом составе).
  if (!hasExercises && !isPreview) {
    return <EmptyState workout={workout} />;
  }

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-black text-zinc-100">
      <div
        ref={scrollerRef}
        className="hide-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain [scroll-behavior:smooth]"
      >
        {/* Preview: Экран старта — слайд 0; свайп сразу ведёт в упражнения. */}
        {isPreview ? (
          <div
            data-index={0}
            ref={(el) => {
              slideRefs.current[0] = el;
            }}
            className="relative h-full w-screen shrink-0 snap-center snap-always"
          >
            {startSlide}
          </div>
        ) : null}

        {exercises.map(({ exercise, embedUrl }, idx) => (
          <div
            key={exercise.id}
            data-index={idx + slideOffset}
            ref={(el) => {
              slideRefs.current[idx + slideOffset] = el;
            }}
            className="relative h-full w-screen shrink-0 snap-center snap-always"
          >
            <ExerciseSlide
              exercise={exercise}
              embedUrl={embedUrl}
              indexLabel={formatIndex(idx, exercises.length)}
              isNearActive={Math.abs(idx + slideOffset - activeIndex) <= 1}
              isFinal={idx === exercises.length - 1}
              supersetPosition={supersetMap.get(idx)?.position ?? null}
            />
          </div>
        ))}

        {/* FinishSlide существует только в начатой сессии: до старта
            завершение невозможно (D050), в preview его просто нет. */}
        {!isPreview ? (
          <div
            data-index={finishIndex}
            ref={(el) => {
              slideRefs.current[finishIndex] = el;
            }}
            className="relative h-full w-screen shrink-0 snap-center snap-always"
          >
            <FinishSlide
              workout={workout}
              isPending={isPending}
              error={error}
              onComplete={handleComplete}
            />
          </div>
        ) : null}
      </div>

      {/* D052: постоянное спокойное напоминание «не начата» на слайдах
          упражнений/видео превью (на самом Экране старта не нужно).
          Presentation-only: контент не блокирует (pointer-events-none). */}
      {isPreview && previewChip && activeIndex >= slideOffset ? (
        <div className="pointer-events-none absolute inset-x-0 top-[max(3.5rem,calc(env(safe-area-inset-top)+2.75rem))] z-10 flex justify-center">
          <span className="rounded-full border border-white/12 bg-black/55 px-3 py-1.5 text-[11px] font-medium text-zinc-300 backdrop-blur [font-family:var(--font-onest)]">
            Тренировка ещё не начата
          </span>
        </div>
      ) : null}

      <TopBar
        activeIndex={activeIndex}
        total={totalSlides}
        supersetPairStarts={supersetPairStarts}
      />

      <DesktopArrows
        activeIndex={activeIndex}
        totalSlides={totalSlides}
        onPrev={() => goTo(Math.max(0, activeIndex - 1))}
        onNext={() => goTo(Math.min(totalSlides - 1, activeIndex + 1))}
      />

      {/* 8A: поверхность награды — Reward Modal (D067); AppModal несёт
          собственный AnimatePresence. */}
      <RewardModal feedback={feedback} />

      <AnimatePresence>
        {showHint ? (
          <SwipeHint key="swipe-hint" reducedMotion={shouldReduceMotion ?? false} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────── Hint свайпа ──────────────────────────

/**
 * Ненавязчивый намёк: два шеврона на правом краю экрана.
 * pointer-events-none — никогда не блокирует жесты или iframe.
 * Полное движение: fade-in + лёгкий горизонтальный толчок (однократно).
 * Reduced-motion: только fade-in, без смещения.
 */
function SwipeHint({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={
        reducedMotion
          ? { opacity: 0.28 }
          : { opacity: 0.28, x: [0, 8, 0, 8, 0] }
      }
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}
      transition={
        reducedMotion
          ? { opacity: { delay: 0.7, duration: 0.55, ease: "easeOut" } }
          : {
              opacity: { delay: 0.7, duration: 0.55, ease: "easeOut" },
              x: { delay: 1.25, duration: 1.8, ease: "easeInOut" },
            }
      }
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-4 z-10 flex items-center"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="text-zinc-300"
        aria-hidden="true"
      >
        <path
          d="M7 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />
      </svg>
    </motion.div>
  );
}

// ────────────────────────── Пустое состояние ──────────────────────────

function EmptyState({ workout }: { workout: Workout }) {
  return (
    <div className="relative flex min-h-dvh w-screen flex-col bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_70%_at_50%_-20%,rgba(56,189,248,0.08),transparent_55%)]" />
      <div className="relative z-[1] mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
        <Link
          href="/workouts"
          className="text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-300 [font-family:var(--font-onest)]"
        >
          ← К тренировкам
        </Link>
        <div className="mt-auto">
          <h1 className="text-2xl font-bold leading-tight text-white [font-family:var(--font-unbounded)]">
            {workout.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            Шаги тренировки скоро появятся. Путь продолжается.
          </p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────── Утилиты ──────────────────────────

/** Подпись слайда вида '01 / 04' — спокойный счётчик упражнений. */
function formatIndex(zeroBased: number, total: number): string {
  const current = String(zeroBased + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  return `${current} / ${totalStr}`;
}
