import Link from "next/link";

/**
 * ProfileHeaderButton — маленькая кнопка Профиля в шапке (D006).
 *
 * Профиль административный: он не вкладка нижней навигации, а тихая
 * кнопка в шапке поверхностей (Home — D071, Progress — D072).
 * Тач-зона ≥ 44px, никакого колокольчика и меню настроек рядом.
 *
 * `returnTo` — внутренний путь экрана-источника: Профиль вернёт «Назад»
 * именно туда (санитизация — на странице Профиля; сюда передаются только
 * литеральные внутренние пути вроде "/dashboard" / "/progress").
 */
export function ProfileHeaderButton({
  returnTo,
  className = "",
}: {
  /** Внутренний путь возврата (напр. "/progress"). Без него — просто /profile. */
  returnTo?: string;
  className?: string;
}) {
  const href = returnTo
    ? `/profile?returnTo=${encodeURIComponent(returnTo)}`
    : "/profile";

  return (
    <Link
      href={href}
      aria-label="Профиль"
      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
