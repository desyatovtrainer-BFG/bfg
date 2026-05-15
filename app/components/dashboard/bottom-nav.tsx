"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Главная", icon: HomeIcon },
  { href: "/workouts", label: "Тренировки", icon: DumbbellIcon },
  { href: "/avatar", label: "Аватар", icon: UserIcon },
  { href: "/progress", label: "Прогресс", icon: ChartIcon },
  { href: "/profile", label: "Профиль", icon: ProfileIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

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

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
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

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-sky-400" : "text-current"}>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.5 20.5c.8-2.8 3.2-4.5 5.5-4.5s4.7 1.7 5.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
