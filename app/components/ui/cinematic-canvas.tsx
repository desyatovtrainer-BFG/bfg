import type { ReactNode } from "react";

/**
 * CinematicCanvas — разметочный примитив «Adaptive Cinematic Canvas» (D075).
 *
 * Что это: обёртка, кодирующая правило D075 / BFG_UI_RULES §2 —
 * «атмосфера расширяется, читаемый контент остаётся ограниченным»:
 *
 *   - Tier 1 (телефон 360–430px) — источник правды по структуре;
 *   - на широких экранах фоновые слои (свечение, градиенты, виньетка)
 *     тянутся на всю ширину вьюпорта;
 *   - читаемый/интерактивный контент центрируется и ограничивается
 *     колонкой READABLE_COLUMN_CLASS — текст и кнопки не растут бесконечно;
 *   - никакого «десктопного дашборда» ни на одной ширине.
 *
 * Чем это НЕ является: это не экран, не сетка и не тема. Экраны
 * (Home, Progress, placeholder-разделы) кладут сюда свой контент.
 *
 * Рецепт классов (если компонент не подходит — используй строки ниже):
 *   READABLE_COLUMN_CLASS — капа читаемой колонки;
 *   CTA_WIDTH_CLASS       — капа ширины primary CTA (~320–420px, D074/D076).
 */

/** Читаемая колонка: телефонная ширина — источник правды, центрирование на широких экранах. */
export const READABLE_COLUMN_CLASS = "mx-auto w-full max-w-[430px] px-5";

/** Капа ширины primary CTA (D074 §6 / D076 §9): не растёт бесконечно, центрируется. */
export const CTA_WIDTH_CLASS = "mx-auto w-full max-w-[420px]";

type CinematicCanvasProps = {
  children: ReactNode;
  /**
   * Фоновая атмосфера (radial-свечения + виньетка). Расширяется на всю
   * ширину независимо от капы контента — это и есть «канва» D075.
   */
  atmosphere?: boolean;
  /** Дополнительные классы внешней обёртки (например, min-h-dvh). */
  className?: string;
  /** Дополнительные классы читаемой колонки. */
  contentClassName?: string;
};

export function CinematicCanvas({
  children,
  atmosphere = true,
  className = "",
  contentClassName = "",
}: CinematicCanvasProps) {
  return (
    <div className={`relative isolate overflow-hidden bg-black text-zinc-100 ${className}`}>
      {atmosphere ? (
        <>
          {/* Атмосферные слои — full-bleed, расширяются с вьюпортом (D075). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(56,189,248,0.09),transparent_58%),radial-gradient(90%_60%_at_100%_40%,rgba(167,139,250,0.07),transparent_52%),radial-gradient(80%_55%_at_0%_80%,rgba(251,191,36,0.05),transparent_58%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-black"
          />
          {/* Спокойная киношная виньетка. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]"
          />
        </>
      ) : null}

      {/* Читаемый контент: капа ширины, центрирование — не дашборд. */}
      <div className={`relative z-[1] ${READABLE_COLUMN_CLASS} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
