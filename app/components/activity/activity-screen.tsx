import Link from "next/link";
import type { DailyQuest } from "@/lib/quests";
import type { Workout } from "@/lib/workouts";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameCard } from "../ui/game-card";
import { ScreenHeader } from "../ui/screen-header";
import { ActivityQuests } from "./activity-quests";

/**
 * ActivityScreen — визуальная оболочка принятой Activity (D042–D059, D068).
 *
 * Функциональная поверхность навигации; эмоциональный центр — Home (D055).
 * Композиция (wireframes §1): заголовок «Активность» (только заголовок —
 * без даты, подзаголовков и кнопки Профиля) → секция «Тренировки»
 * (вертикальный список равных карточек в порядке программы, D054/D055)
 * → секция «Ежедневные квесты» (бинарные строки, всегда ниже, D042).
 *
 * Карточка тренировки: номер · название · число упражнений — и ничего
 * больше (D045/D055/D068): без сложности, длительности, категорий,
 * аналитики. Состояния (D048/D054/D057): Default (нейтральная) или
 * «Следующая» (оранжевый контур). In Progress (зелёная) появится вместе
 * с session-состоянием (границы D049/D050) — в этом слайсе его нет,
 * поэтому правило приоритета D057 выполняется тривиально. Завершённая
 * карточка возвращается в Default — отдельного состояния нет (D056).
 * Все тренировки видимы и открываются — никаких замков (D047).
 *
 * Activity сознательно НЕ: Home (нет Presence и CTA «Продолжить путь» —
 * D043), дашборд (нет статистики), витрина аналитики (вес — только на
 * экране упражнения, D044).
 */

export type ActivityWorkoutItem = {
  workout: Workout;
  /** Порядковый номер в программе (1-based, порядок display_order). */
  number: number;
  exerciseCount: number;
  /** true — следующая тренировка цикла (D046/D051/D059). */
  isUpcoming: boolean;
  /** true — активная сессия (D058); приоритет над «Следующая» (D057). */
  isInProgress: boolean;
};

export type ActivityScreenProps = {
  workouts: ActivityWorkoutItem[];
  quests: DailyQuest[];
};

export function ActivityScreen({ workouts, quests }: ActivityScreenProps) {
  return (
    <CinematicCanvas className="min-h-dvh" contentClassName="flex min-h-dvh flex-col pb-28">
      {/* Заголовок — только «Активность» (D055). */}
      <ScreenHeader title="Активность" />

      {/* ── Секция 1: Тренировки (всегда первая, D042) ───────────── */}
      <section className="mt-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
          Тренировки
        </h2>
        {workouts.length === 0 ? (
          <GameCard className="p-5 text-center">
            <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
              Каталог тренировок пока пуст. Загляни позже — путь продолжается.
            </p>
          </GameCard>
        ) : (
          <ul className="flex flex-col gap-3">
            {workouts.map((item) => (
              <li key={item.workout.id}>
                <ActivityWorkoutCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Секция 2: Ежедневные квесты (всегда ниже, D042) ─────── */}
      <section className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
          Ежедневные квесты
        </h2>
        <ActivityQuests initialQuests={quests} />
      </section>
    </CinematicCanvas>
  );
}

/**
 * Минимальная карточка тренировки (D045/D055/D068). Равный размер для
 * всех; акцент — только состоянием и цветом контура, никогда размером
 * (D054). Открывает существующий экран сессии.
 */
function ActivityWorkoutCard({ item }: { item: ActivityWorkoutItem }) {
  const { workout, number, exerciseCount, isUpcoming, isInProgress } = item;

  // D048/D054: максимум один маркер состояния; контур — цветом, не размером.
  const outline = isInProgress
    ? "border-emerald-400/50 hover:border-emerald-400/65"
    : isUpcoming
      ? "border-amber-400/45 hover:border-amber-400/60"
      : "hover:border-white/[0.14]";

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label={`Открыть тренировку ${number}: ${workout.title}`}
    >
      <GameCard className={`p-4 transition-colors ${outline}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 [font-family:var(--font-onest)]">
              Тренировка {number}
            </p>
            <h3 className="mt-1 truncate text-base font-semibold text-white [font-family:var(--font-onest)]">
              {workout.title}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500 [font-family:var(--font-onest)]">
              {exerciseCount > 0
                ? `${exerciseCount} ${pluralRu(exerciseCount, "упражнение", "упражнения", "упражнений")}`
                : "Состав уточняется"}
            </p>
          </div>
          {isInProgress ? (
            <span className="shrink-0 rounded-full border border-emerald-400/40 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 [font-family:var(--font-onest)]">
              В процессе
            </span>
          ) : isUpcoming ? (
            <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200 [font-family:var(--font-onest)]">
              Следующая
            </span>
          ) : null}
        </div>
      </GameCard>
    </Link>
  );
}

/** Русская плюрализация (1 упражнение / 2 упражнения / 5 упражнений). */
function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
