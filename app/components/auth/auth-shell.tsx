import Link from "next/link";
import type { ReactNode } from "react";
import { GameCard } from "../ui/game-card";

/**
 * Единый mobile-first контейнер для /login и /signup.
 * Никакого нового UI: вписан в текущий тёмный стиль BFG.
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_-20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(80%_50%_at_100%_30%,rgba(167,139,250,0.08),transparent_50%)]" />

      <div className="relative z-[1] flex w-full max-w-sm flex-col items-center">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-[0.22em] text-zinc-100 [font-family:var(--font-unbounded)]"
        >
          BFG
        </Link>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 [font-family:var(--font-onest)]">
          Big Fitness Game
        </p>

        <GameCard glow="cyan" className="mt-8 w-full p-5 sm:p-6">
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
