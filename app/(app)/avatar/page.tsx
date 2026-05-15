import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Аватар — BFG",
};

export default function AvatarPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 pb-28 pt-12 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600 [font-family:var(--font-onest)]">
        Big Fitness Game
      </p>
      <h1 className="mt-3 text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
        Аватар
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
        Эволюция образа и кастомизация — скоро в этом разделе.
      </p>
      <Link
        href="/dashboard"
        className="mt-10 text-sm font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
      >
        ← На главную
      </Link>
    </div>
  );
}
