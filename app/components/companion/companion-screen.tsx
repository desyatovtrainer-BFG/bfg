"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { CompanionState } from "@/lib/companion";
import { GameCard } from "../ui/game-card";

/**
 * Экран компаньона (MVP).
 *
 * Минималистичный, атмосферный, мобильно-ориентированный — без редизайна
 * остального приложения. Текст приходит уже готовым из server-страницы
 * (buildCompanionMessage), здесь только «оболочка»: пульсирующая аура,
 * короткие подписи состояния и тихий статус по прогрессии.
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 360, damping: 30 },
  },
};

export type CompanionScreenProps = {
  state: CompanionState;
  stateLabel: string;
  primary: string;
  secondary: string;
  level: number;
  streak: number;
  xpInLevel: number;
  xpForNextLevel: number;
  /** Сколько дней назад была последняя зачётная активность. null = ещё не было. */
  daysSinceActive: number | null;
};

/** Цвет ауры и подсветки карточки под состояние компаньона. */
function toneFor(state: CompanionState): {
  glow: "cyan" | "violet" | "rose" | "none";
  aura: string;
  ring: string;
} {
  switch (state) {
    case "first_step":
      return {
        glow: "cyan",
        aura: "from-sky-400/40 via-sky-500/15 to-transparent",
        ring: "ring-sky-400/30",
      };
    case "present_today":
      return {
        glow: "violet",
        aura: "from-violet-400/40 via-violet-500/15 to-transparent",
        ring: "ring-violet-400/30",
      };
    case "in_streak":
      return {
        glow: "cyan",
        aura: "from-cyan-300/40 via-sky-500/15 to-transparent",
        ring: "ring-cyan-400/30",
      };
    case "soft_return":
      return {
        glow: "violet",
        aura: "from-indigo-400/35 via-violet-500/15 to-transparent",
        ring: "ring-indigo-400/30",
      };
    case "warm_return":
      return {
        glow: "rose",
        aura: "from-rose-400/35 via-rose-500/15 to-transparent",
        ring: "ring-rose-400/30",
      };
  }
}

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function CompanionScreen({
  state,
  stateLabel,
  primary,
  secondary,
  level,
  streak,
  xpInLevel,
  xpForNextLevel,
  daysSinceActive,
}: CompanionScreenProps) {
  // useReducedMotion возвращает null на сервере и реальное значение на клиенте.
  // Нам этого достаточно: animate в motion-компонентах ниже становится
  // undefined при reduced=true, DOM-разметка при этом не меняется —
  // никакого SSR-гидрационного рассинхрона.
  const reduced = useReducedMotion() === true;

  const tone = toneFor(state);
  const streakWord = pluralRu(streak, "день", "дня", "дней");
  const xpPct =
    xpForNextLevel > 0
      ? Math.max(0, Math.min(100, Math.round((xpInLevel / xpForNextLevel) * 100)))
      : 0;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_55%_at_50%_-10%,rgba(56,189,248,0.10),transparent_55%),radial-gradient(70%_45%_at_100%_30%,rgba(167,139,250,0.08),transparent_55%),radial-gradient(70%_45%_at_0%_85%,rgba(251,113,133,0.05),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-black" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-[1] mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))]"
      >
        <motion.header variants={fadeUp} className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600 [font-family:var(--font-onest)]">
            BFG · Компаньон
          </p>
          <h1 className="mt-2 text-xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-2xl">
            {stateLabel}
          </h1>
        </motion.header>

        {/* Аура */}
        <motion.section variants={fadeUp} className="mb-8 flex justify-center">
          <div className="relative h-44 w-44 sm:h-52 sm:w-52">
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-radial ${tone.aura} blur-2xl`}
              style={{
                backgroundImage:
                  "radial-gradient(closest-side, currentColor, transparent 70%)",
              }}
              animate={
                reduced
                  ? undefined
                  : {
                      scale: [1, 1.06, 1],
                      opacity: [0.85, 1, 0.85],
                    }
              }
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <div
              className={`absolute inset-6 rounded-full border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] ring-1 ${tone.ring} backdrop-blur-md`}
              aria-hidden
            />
            <motion.div
              className="absolute inset-12 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.7),rgba(255,255,255,0.05)_60%,transparent_75%)]"
              animate={
                reduced
                  ? undefined
                  : {
                      opacity: [0.55, 0.85, 0.55],
                    }
              }
              transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          </div>
        </motion.section>

        {/* Реплика */}
        <motion.section variants={fadeUp} className="mb-8">
          <GameCard glow={tone.glow} className="p-6 text-center sm:p-7">
            <p className="text-pretty text-lg font-semibold leading-snug text-white [font-family:var(--font-unbounded)] sm:text-xl">
              {primary}
            </p>
            {secondary ? (
              <p className="mt-3 text-pretty text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
                {secondary}
              </p>
            ) : null}
          </GameCard>
        </motion.section>

        {/* Тихий статус по данным профиля */}
        <motion.section variants={fadeUp} className="mb-8">
          <GameCard className="grid grid-cols-3 gap-2 p-3">
            <StatPill label="Уровень" value={String(level)} />
            <StatPill
              label="Серия"
              value={String(streak)}
              sub={streak > 0 ? `${streakWord} подряд` : "пока пусто"}
            />
            <StatPill label="Опыт" value={`${xpPct}%`} sub="до уровня" />
          </GameCard>

          <p className="mt-3 text-center text-xs text-zinc-500 [font-family:var(--font-onest)]">
            {presenceLine(daysSinceActive)}
          </p>
        </motion.section>

        <motion.footer variants={fadeUp} className="mt-auto text-center">
          <Link
            href="/dashboard"
            className="inline-block text-sm font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
          >
            ← На главную
          </Link>
        </motion.footer>
      </motion.div>
    </div>
  );
}

function StatPill({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/25 px-2 py-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 [font-family:var(--font-onest)]">
        {label}
      </p>
      <p className="mt-1 text-base font-bold tabular-nums text-white [font-family:var(--font-unbounded)]">
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[10px] text-zinc-600 [font-family:var(--font-onest)]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Короткая, неосуждающая строка о «когда последний раз двигался».
 * Используем тёплые формулировки и избегаем точных «N дней назад»
 * для коротких пауз — это уместнее тону компаньона.
 */
function presenceLine(daysSinceActive: number | null): string {
  if (daysSinceActive === null) return "Эта история только начинается.";
  if (daysSinceActive === 0) return "Ты был здесь сегодня.";
  if (daysSinceActive === 1) return "Ты был здесь вчера.";
  if (daysSinceActive < 7) return "Пауза была недолгой.";
  return "Пауза была — это нормально.";
}
