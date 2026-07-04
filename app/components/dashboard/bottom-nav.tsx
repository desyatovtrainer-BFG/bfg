"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Нижняя навигация BFG — принятая структура D003:
 * ровно пять вкладок, Home по центру.
 *
 *   Тренировки · Питание · Home · Прогресс · Мультимедиа
 *
 * Сознательно НЕ вкладки (D004/D005/D006):
 *   - Квесты — живут внутри области Тренировок/Activity;
 *   - Аватар — поглощён Прогрессом;
 *   - Компаньон — это Голос Presence на поверхностях, не раздел;
 *   - Профиль — административный, доступ через маленькую кнопку в шапке.
 *
 * Питание и Мультимедиа — принятые будущие направления; сейчас ведут
 * на placeholder-экраны (это принято D003, Registry Notes).
 */

const items = [
  { href: "/workouts", label: "Тренировки", icon: DumbbellIcon },
  { href: "/nutrition", label: "Питание", icon: NutritionIcon },
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/progress", label: "Прогресс", icon: ChartIcon },
  { href: "/multimedia", label: "Мультимедиа", icon: MediaIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  // Скрываем навбар на экране сессии тренировки — /workouts/[id].
  // Список тренировок (/workouts) навбар сохраняет.
  if (pathname.startsWith("/workouts/")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-black/75 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl"
      aria-label="Основная навигация"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/dashboard" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors [font-family:var(--font-onest)] sm:text-[11px] ${
                active ? "text-sky-300" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon active={active} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DumbbellIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      <path
        d="M6.5 9h-1A1.5 1.5 0 004 10.5v3A1.5 1.5 0 005.5 15h1M17.5 9h1A1.5 1.5 0 0120 10.5v3a1.5 1.5 0 01-1.5 1.5h-1M8 12h8M9 9v6M15 9v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NutritionIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      {/* Яблоко: спокойный контур, без деталей. */}
      <path
        d="M12 8.5c-1.2-1.1-2.8-1.5-4.2-.9C5.6 8.5 4.6 11 5.3 13.7c.7 2.8 2.6 5.3 4.5 5.8.8.2 1.5 0 2.2-.4.7.4 1.4.6 2.2.4 1.9-.5 3.8-3 4.5-5.8.7-2.7-.3-5.2-2.5-6.1-1.4-.6-3-.2-4.2.9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.5c0-2 1-3.4 2.6-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      <path d="M5 19V5M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 15l3-4 3 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MediaIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      <rect x="4" y="6" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 10.2v4.6l4-2.3-4-2.3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
