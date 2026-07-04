import Link from "next/link";
import type { ReactNode } from "react";

/**
 * ScreenHeader — минимальный заголовок экрана.
 *
 * Что это: верхняя зона экрана по правилам BFG_UI_RULES §2 —
 * «top app bars are minimal: a title or a back arrow, nothing else».
 * Подходит будущим Home / Progress / Profile / placeholder-экранам:
 *
 *   - необязательная стрелка «назад» (Link, тач-зона ≥ 44px);
 *   - заголовок (единственный display-шрифт экрана — Unbounded, §3);
 *   - необязательный подзаголовок;
 *   - необязательный слот под маленькую кнопку Профиля (D006) справа.
 *
 * Чем это НЕ является: здесь нет и не будет колокольчика уведомлений
 * (D071 — no notification bell in MVP), поиска, табов и прочего хрома.
 */

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Куда ведёт стрелка «назад». Не передан — стрелки нет. */
  backHref?: string;
  /** aria-label стрелки «назад». */
  backLabel?: string;
  /**
   * Слот под маленькую кнопку в правом углу — в продукте это
   * кнопка Профиля (D006). Слот, а не готовая кнопка: навигация
   * и иконка принадлежат экрану, не примитиву.
   */
  profileSlot?: ReactNode;
  /**
   * Визуально скрыть заголовок, оставив его для скринридеров.
   * Нужно экранам вроде Home, где текстовый заголовок не показывается.
   */
  titleHidden?: boolean;
  className?: string;
};

export function ScreenHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Назад",
  profileSlot,
  titleHidden = false,
  className = "",
}: ScreenHeaderProps) {
  const hasTopRow = Boolean(backHref) || Boolean(profileSlot);

  return (
    <header className={`pt-[max(0.75rem,env(safe-area-inset-top))] ${className}`}>
      {hasTopRow ? (
        <div className="flex min-h-11 items-center justify-between">
          {backHref ? (
            <Link
              href={backHref}
              aria-label={backLabel}
              className="-ml-2 flex h-11 w-11 items-center justify-center rounded-xl text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500/40"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M14.5 5.5 8 12l6.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <span aria-hidden className="h-11 w-11" />
          )}

          {profileSlot ? <div className="-mr-1 flex items-center">{profileSlot}</div> : null}
        </div>
      ) : null}

      <h1
        className={
          titleHidden
            ? "sr-only"
            : "mt-1 text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl"
        }
      >
        {title}
      </h1>

      {subtitle && !titleHidden ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
