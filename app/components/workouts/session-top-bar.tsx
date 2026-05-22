/**
 * TopBar — верхняя полоса экрана сессии тренировки.
 * Содержит кнопку «назад» (ссылка на /workouts) и прогресс-доты по слайдам.
 *
 * Супер-сетные слайды отображаются как сгруппированная пара точек
 * с тонкой линией-связкой между ними. Нормальные слайды без изменений.
 * Без анимаций, без состояния — чистый отображаемый компонент.
 */

import Link from "next/link";

type TopBarProps = {
  activeIndex: number;
  total: number;
  /**
   * Exercise-slide indices (0-based) that begin a superset pair.
   * When index i is present, dots at i and i+1 are rendered as a connected group.
   * Absent or empty = normal workout, no change in appearance.
   */
  supersetPairStarts?: readonly number[];
};

type DotGroup =
  | { type: "single"; index: number }
  | { type: "pair"; firstIndex: number; secondIndex: number };

function buildDotGroups(
  total: number,
  supersetPairStarts: readonly number[] | undefined,
): DotGroup[] {
  const groups: DotGroup[] = [];
  let i = 0;
  while (i < total) {
    if (supersetPairStarts?.includes(i) && i + 1 < total) {
      groups.push({ type: "pair", firstIndex: i, secondIndex: i + 1 });
      i += 2;
    } else {
      groups.push({ type: "single", index: i });
      i++;
    }
  }
  return groups;
}

export function TopBar({ activeIndex, total, supersetPairStarts }: TopBarProps) {
  const groups = buildDotGroups(total, supersetPairStarts);

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
        {groups.map((group) => {
          if (group.type === "pair") {
            const firstActive = group.firstIndex === activeIndex;
            const secondActive = group.secondIndex === activeIndex;
            return (
              <span key={group.firstIndex} className="flex items-center gap-0.5">
                <span
                  className={[
                    "h-1 rounded-full transition-all duration-300 ease-out",
                    firstActive ? "w-5 bg-white" : "w-1.5 bg-white/45",
                  ].join(" ")}
                  aria-hidden="true"
                />
                {/* Thin connector communicating that the two dots are linked */}
                <span
                  className="h-px w-1 self-center bg-white/20"
                  aria-hidden="true"
                />
                <span
                  className={[
                    "h-1 rounded-full transition-all duration-300 ease-out",
                    secondActive ? "w-5 bg-white" : "w-1.5 bg-white/45",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </span>
            );
          }

          return (
            <span
              key={group.index}
              className={[
                "h-1 rounded-full transition-all duration-300 ease-out",
                group.index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/30",
              ].join(" ")}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <div className="w-10" aria-hidden="true" />
    </div>
  );
}
