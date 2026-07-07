import Link from "next/link";
import type { ReactNode } from "react";
import { GameCard } from "../ui/game-card";
import { PresenceFigure } from "../ui/presence-figure";

/**
 * AuthShell — единая оболочка /login и /signup (в направлении D076 §22).
 *
 * Продолжает атмосферу Entry (D074): наверху — тихая стрелка «назад»
 * к Entry, за формой — УМЕНЬШЕННАЯ неинтерактивная Seed Form (фоновая,
 * не центральная, не тапается, Voice-молчит). Колонка формы остаётся
 * ограниченной по ширине (D075); нижней навигации нет (pre-app).
 *
 * Слайс 13 — только визуальная оболочка: логика Supabase-аутентификации
 * не тронута; трёхсостоянийный Auth-шелл с OTP-гейтом (D076/D077) —
 * отдельная будущая работа.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-black px-4 py-10 text-zinc-100">
      {/* Атмосфера — full-bleed (D075). */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_-20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(80%_50%_at_100%_30%,rgba(167,139,250,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

      {/* Уменьшенная Seed Form — фоновое присутствие, не тап-цель (D076 §2). */}
      <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center opacity-25" aria-hidden>
        <PresenceFigure direction="neutral" size="sm" animated={false} alt="" />
      </div>

      {/* Тихий возврат на Entry (D076 — back → Entry). */}
      <Link
        href="/"
        aria-label="На стартовый экран"
        className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[2] flex h-11 w-11 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500/40"
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

      <div className="relative z-[1] flex w-full max-w-sm flex-col items-center">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-[0.22em] text-zinc-100 [font-family:var(--font-unbounded)]"
        >
          BFG
        </Link>

        <GameCard glow="cyan" className="mt-8 w-full bg-zinc-950/70 p-5 sm:p-6">
          <h1 className="text-xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-2xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-zinc-400 [font-family:var(--font-onest)]">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </GameCard>

        <div className="mt-6 text-center text-sm text-zinc-500 [font-family:var(--font-onest)]">
          {footer}
        </div>
      </div>
    </div>
  );
}
