/**
 * DesktopArrows — кнопки «влево / вправо» для desktop-тестирования.
 * На мобиле скрыты (md:flex) — там работает нативный swipe.
 * На лэптопе/десктопе позволяют пощёлкать между слайдами без трекпада.
 * Кнопки на крайних слайдах гасятся через disabled.
 */

type DesktopArrowsProps = {
  activeIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
};

export function DesktopArrows({
  activeIndex,
  totalSlides,
  onPrev,
  onNext,
}: DesktopArrowsProps) {
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
