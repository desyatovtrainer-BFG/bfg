import type { ReactNode } from "react";
import { CinematicCanvas } from "./cinematic-canvas";

/**
 * PlaceholderScreen — тёмный киношный каркас placeholder-экрана.
 *
 * Что это: спокойный экран-заглушка для принятых будущих разделов —
 * «Питание», «Мультимедиа», «Внешний вид» (D003 / D073, rebuild-политика:
 * placeholder-экраны без логики). Заголовок + одна-две спокойные строки,
 * опционально фигура Presence сверху.
 *
 * Чем это НЕ является: не фича. Никаких форм, никакой логики, никакой
 * работы с БД, никаких рекомендаций/каталогов. Текст здесь —
 * implementation copy, не продуктовое решение.
 *
 * Тон: без хайпа, без стыда, без восклицаний, без эмодзи (§11).
 * Раздел, который ещё не появился, — это «позже», а не «пусто».
 */

type PlaceholderScreenProps = {
  /** Пользовательский заголовок раздела (например, «Питание»). */
  title: string;
  /** Одна-две спокойные строки. Не больше. */
  lines: readonly string[];
  /** Опциональная зона заголовка экрана (ScreenHeader) над контентом. */
  header?: ReactNode;
  /** Опциональная фигура (PresenceFigure) над заголовком — для «Внешний вид». */
  figure?: ReactNode;
  /**
   * true (default) — экран занимает вьюпорт (продуктовый режим);
   * false — компактная высота (для превью/встраивания).
   */
  fillViewport?: boolean;
  className?: string;
};

export function PlaceholderScreen({
  title,
  lines,
  header,
  figure,
  fillViewport = true,
  className = "",
}: PlaceholderScreenProps) {
  return (
    <CinematicCanvas
      className={`${fillViewport ? "min-h-dvh" : "min-h-[560px]"} ${className}`}
      contentClassName={`flex flex-col ${fillViewport ? "min-h-dvh pb-28" : "min-h-[560px] pb-10"}`}
    >
      {header}

      <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center">
        {figure}

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            {title}
          </h1>
          <div className="mx-auto max-w-[19rem] space-y-1.5">
            {lines.map((line) => (
              <p
                key={line}
                className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </CinematicCanvas>
  );
}
