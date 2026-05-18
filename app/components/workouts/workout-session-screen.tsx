"use client";

/**
 * Экран сессии тренировки — вертикальный swipe-опыт (MVP).
 *
 * Сознательный сдвиг тона: тренировка перестаёт быть «списком карточек».
 * Каждое упражнение — отдельный fullscreen-слайд с вертикальным видео в
 * центре внимания и спокойной типографикой поверх затемнённого градиента.
 * Между слайдами — горизонтальный snap-свайп (CSS scroll-snap), без
 * сложных жест-библиотек: оно нативно ощущается на мобиле и не мешает
 * скроллу плеера.
 *
 * Композиция слайдов:
 *   [упр. 1] [упр. 2] ... [упр. N] [финальный слайд: «Завершить тренировку»]
 *
 * Сознательно НЕ показываем здесь:
 *   - таблицу шагов, тэги категории/сложности, статистику;
 *   - таймер обратного отсчёта, чек-листы повторов;
 *   - всё, что превращает сессию в дашборд.
 *
 * Серверная петля завершения не изменилась: финальный слайд вызывает
 * `completeWorkoutAction` → поверх слайдера всплывает фидбек-оверлей
 * с репликой компаньона, XP и (опционально) уровнем/эволюцией.
 */

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  completeWorkoutAction,
  formatExerciseDuration,
  formatWorkoutDuration,
  type CompleteWorkoutResponse,
  type Workout,
  type WorkoutExercise,
} from "@/lib/workouts";
import { GameButton } from "../ui/game-button";

type FeedbackState = NonNullable<CompleteWorkoutResponse["data"]>;

/**
 * Резерв снизу под глобальный `BottomNav`: он `fixed` и сидит во всех
 * экранах под `(app)/layout.tsx`. Его собственная высота ≈ pt(0.5rem) +
 * иконка+лейбл (~2.5rem) + pb(max(0.5rem, safe-area-inset-bottom)).
 * Мы добавляем чуть больше (`+ 4.25rem` поверх safe-area) — так заголовок,
 * описание и длительность всегда читаются над навигацией с воздухом.
 */
const BOTTOM_NAV_SAFE = "calc(env(safe-area-inset-bottom) + 4.25rem)";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const hasExercises = exercises.length > 0;
  const finishIndex = exercises.length;
  const totalSlides = exercises.length + 1;

  const handleComplete = () => {
    setError(null);
    startTransition(async () => {
      const res = await completeWorkoutAction(workout.id);
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

  // Контент пуст — рисуем спокойную заглушку без слайдера.
  if (!hasExercises) {
    return <EmptyState workout={workout} />;
  }

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-black text-zinc-100">
      <div
        ref={scrollerRef}
        className="hide-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain [scroll-behavior:smooth]"
      >
        {exercises.map(({ exercise, embedUrl }, idx) => (
          <div
            key={exercise.id}
            data-index={idx}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            className="relative h-full w-screen shrink-0 snap-center snap-always"
          >
            <ExerciseSlide
              exercise={exercise}
              embedUrl={embedUrl}
              indexLabel={formatIndex(idx, exercises.length)}
              isNearActive={Math.abs(idx - activeIndex) <= 1}
            />
          </div>
        ))}

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
      </div>

      <TopBar activeIndex={activeIndex} total={totalSlides} />

      <DesktopArrows
        activeIndex={activeIndex}
        totalSlides={totalSlides}
        onPrev={() => goTo(Math.max(0, activeIndex - 1))}
        onNext={() => goTo(Math.min(totalSlides - 1, activeIndex + 1))}
      />

      <AnimatePresence>
        {feedback ? (
          <FeedbackOverlay key="feedback" feedback={feedback} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────── Слайды ──────────────────────────

function ExerciseSlide({
  exercise,
  embedUrl,
  indexLabel,
  isNearActive,
}: {
  exercise: WorkoutExercise;
  embedUrl: string | null;
  indexLabel: string;
  isNearActive: boolean;
}) {
  // Видео — в отдельной 9:16 карточке: нативные элементы плеера
  // (пауза, прокрутка, fullscreen Kinescope) должны оставаться доступными,
  // поэтому никаких bottom-оверлеев поверх видео. Мета — отдельным блоком ниже.
  //
  // max-width карточки считаем от текущей высоты вьюпорта за вычетом
  // зон под topbar, мета-блок, safe-area и нижнего навбара — так 9:16
  // всегда влезает по вертикали, не растягиваясь по горизонтали и не
  // съезжая под чёлку/нижнюю навигацию.
  const cardMaxWidth =
    "calc((100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 18.5rem) * 9 / 16)";

  return (
    <div
      className="flex h-full w-full flex-col bg-black"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 3.75rem)",
        paddingBottom: BOTTOM_NAV_SAFE,
      }}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center px-5">
        <motion.div
          key={`${exercise.id}:video`}
          initial={{ opacity: 0, y: 8 }}
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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="px-6 pt-5"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 tabular-nums [font-family:var(--font-onest)]">
          {indexLabel}
        </p>
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

function FinishSlide({
  workout,
  isPending,
  error,
  onComplete,
}: {
  workout: Workout;
  isPending: boolean;
  error: string | null;
  onComplete: () => void;
}) {
  return (
    <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-black">
      {/* Спокойная атмосферная подложка вместо очередного видео-фрейма. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_30%,rgba(167,139,250,0.14),transparent_60%),radial-gradient(80%_60%_at_50%_85%,rgba(56,189,248,0.1),transparent_60%),linear-gradient(180deg,#08080b,#000)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[1] flex flex-col gap-7 px-6 pt-24"
        style={{ paddingBottom: BOTTOM_NAV_SAFE }}
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

function VideoBackdrop() {
  // Лёгкая «дышащая» подложка для слайдов вне активной зоны и для
  // упражнений без видео. Дешевле, чем держать iframe в DOM, и сразу
  // даёт нужный визуальный тон, пока пользователь не доехал до слайда.
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

// ────────────────────────── Хром (топбар, оверлеи) ──────────────────────────

function TopBar({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <Link
        href="/workouts"
        aria-label="К тренировкам"
        className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-zinc-100 backdrop-blur transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div className="pointer-events-none flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5 backdrop-blur">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={[
              "h-1 rounded-full transition-all duration-300 ease-out",
              i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/30",
            ].join(" ")}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="w-10" aria-hidden="true" />
    </div>
  );
}

/**
 * Кнопки «влево / вправо» для desktop-тестирования.
 *
 * На мобиле скрыты (`md:flex`) — там работает нативный swipe и эти
 * стрелки только мешали бы. На лэптопе/десктопе позволяют пощёлкать
 * между слайдами без танцев с трекпадом и не дублируют сложные
 * жест-привязки. Кнопки на крайних слайдах гасятся `disabled`.
 */
function DesktopArrows({
  activeIndex,
  totalSlides,
  onPrev,
  onNext,
}: {
  activeIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < totalSlides - 1;

  const baseCls =
    "pointer-events-auto absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-zinc-100 backdrop-blur-md transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-default disabled:opacity-25 md:flex";

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Предыдущий слайд"
        className={`${baseCls} left-3`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Следующий слайд"
        className={`${baseCls} right-3`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}

function FeedbackOverlay({ feedback }: { feedback: FeedbackState }) {
  const { companion, xpGained, newLevel, leveledUp, evolved, evolution } =
    feedback;

  const headline = evolved
    ? "Эволюция аватара"
    : leveledUp
      ? "Новый уровень"
      : "Тренировка завершена";

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
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="w-full max-w-sm"
      >
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400 [font-family:var(--font-onest)]">
          {headline}
        </p>
        <p className="mt-5 text-balance text-center text-xl font-medium leading-relaxed text-white [font-family:var(--font-unbounded)]">
          {companion.message}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <FeedbackChip>+{xpGained} опыта</FeedbackChip>
          {leveledUp ? (
            <FeedbackChip accent="violet">Уровень {newLevel}</FeedbackChip>
          ) : null}
          {evolved ? (
            <FeedbackChip accent="gold">{evolution.form}</FeedbackChip>
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
}: {
  children: ReactNode;
  accent?: "violet" | "gold";
}) {
  const tone =
    accent === "gold"
      ? "border-amber-300/35 text-amber-200"
      : accent === "violet"
        ? "border-violet-300/35 text-violet-200"
        : "border-white/15 text-zinc-200";
  return (
    <span
      className={`rounded-full border bg-white/[0.04] px-3 py-1 text-xs font-medium [font-family:var(--font-onest)] ${tone}`}
    >
      {children}
    </span>
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
