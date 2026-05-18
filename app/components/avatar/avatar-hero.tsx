"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { GameCard } from "../ui/game-card";

/**
 * Визуальная репрезентация аватара пользователя.
 *
 * MVP-правило (AVATAR_SYSTEM.md):
 *   - никакого 3D, никакой Unity;
 *   - эволюция = аура, свечение, форма, стадия;
 *   - изменение должно ощущаться, а не объясняться.
 *
 * Поэтому всё, что мы делаем здесь — 2D-композит:
 *   1) внешний halo (мягкое свечение)
 *   2) вращающееся «энергетическое кольцо»
 *   3) внутреннее пульсирующее ядро
 *   4) силуэт (одинаковый на всех стадиях — меняется атмосфера, не тело)
 *   5) подпись: «Стадия N · Форма»
 *   6) текущая аура + полоска glow_intensity
 *
 * Цветовая тема выбирается по `stage` (1..5), не по `form`/`aura`. Это
 * важно: даже если строка в `avatars` рассинхронизирована (например,
 * старый юзер без аватара), мы всё равно покажем стабильную картинку.
 */

type StageTheme = {
  /** Внутренний цвет силуэта/ауры */
  primary: string;
  /** Дополнительный цвет градиента / кольца */
  secondary: string;
  /** Класс glow для GameCard */
  cardGlow: "cyan" | "violet" | "rose" | "gold" | "none";
  /** Tailwind-класс для подсветок (используется в blur-кругах) */
  haloClass: string;
  /** Цвет точек glow-intensity meter */
  pipColor: string;
};

const STAGE_THEMES: Record<number, StageTheme> = {
  1: {
    primary: "#38bdf8",
    secondary: "#0ea5e9",
    cardGlow: "cyan",
    haloClass: "bg-sky-500/20",
    pipColor: "bg-sky-400",
  },
  2: {
    primary: "#22d3ee",
    secondary: "#a78bfa",
    cardGlow: "cyan",
    haloClass: "bg-cyan-400/25",
    pipColor: "bg-cyan-300",
  },
  3: {
    primary: "#a78bfa",
    secondary: "#38bdf8",
    cardGlow: "violet",
    haloClass: "bg-violet-500/25",
    pipColor: "bg-violet-300",
  },
  4: {
    primary: "#e879f9",
    secondary: "#a78bfa",
    cardGlow: "violet",
    haloClass: "bg-fuchsia-500/25",
    pipColor: "bg-fuchsia-300",
  },
  5: {
    primary: "#fbbf24",
    secondary: "#fb7185",
    cardGlow: "gold",
    haloClass: "bg-amber-400/25",
    pipColor: "bg-amber-300",
  },
};

function themeFor(stage: number): StageTheme {
  return STAGE_THEMES[Math.min(5, Math.max(1, stage))] ?? STAGE_THEMES[1]!;
}

export type AvatarHeroProps = {
  /** Стадия из таблицы avatars (1..5). */
  stage: number;
  /** Уже локализованная подпись формы (например, «Поток силы»). */
  formLabel: string;
  /** Уже локализованная подпись ауры (например, «Сияние»). */
  auraLabel: string;
  /** glow_intensity (1..5). */
  glowIntensity: number;
  /** Эмоциональное предложение под аватаром. */
  flavorText: string;
};

export function AvatarHero({
  stage,
  formLabel,
  auraLabel,
  glowIntensity,
  flavorText,
}: AvatarHeroProps) {
  const theme = themeFor(stage);
  const intensity = Math.min(5, Math.max(1, Math.round(glowIntensity)));

  // useReducedMotion возвращает null на сервере и первом клиентском
  // рендере — поэтому `=== true` даёт стабильный SSR (без motion-флэша)
  // и активирует «спокойный» режим только после гидратации, когда
  // браузер уже сообщил предпочтение.
  const reduced = useReducedMotion() === true;

  const gid = useId().replace(/:/g, "");

  // Чем выше стадия, тем заметнее «дыхание» ауры. Без агрессии — это
  // эмоциональный сигнал, а не дискотека.
  const haloScale: [number, number, number] = [1, 1 + 0.025 * intensity, 1];
  const haloOpacity: [number, number, number] = [
    0.55,
    Math.min(0.95, 0.55 + 0.07 * intensity),
    0.55,
  ];

  return (
    <GameCard glow={theme.cardGlow} className="relative overflow-hidden p-5 sm:p-7">
      <div
        className={`pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl ${theme.haloClass}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute -bottom-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl ${theme.haloClass}`}
        aria-hidden
      />

      <div className="relative flex flex-col items-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 [font-family:var(--font-onest)]">
          Твой аватар
        </p>

        <div className="relative mt-4 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(closest-side, ${hexWithAlpha(
                theme.primary,
                0.45,
              )} 0%, transparent 70%)`,
              filter: "blur(18px)",
            }}
            initial={false}
            animate={
              reduced
                ? { scale: 1, opacity: 0.7 }
                : { scale: haloScale, opacity: haloOpacity }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 4.2 - intensity * 0.25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />

          <motion.svg
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            initial={false}
            animate={reduced ? { rotate: 0 } : { rotate: 360 }}
            transition={
              reduced
                ? undefined
                : {
                    duration: Math.max(14, 28 - intensity * 2.4),
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          >
            <defs>
              <linearGradient id={`ring-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.primary} stopOpacity="0.95" />
                <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke={`url(#ring-${gid})`}
              strokeWidth="1.5"
              strokeDasharray={dashPatternForStage(stage)}
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke={hexWithAlpha(theme.secondary, 0.35)}
              strokeWidth="0.8"
              strokeDasharray="1 6"
            />
          </motion.svg>

          {stage >= 3 ? (
            <motion.svg
              aria-hidden
              viewBox="0 0 200 200"
              className="absolute inset-0 h-full w-full"
              initial={false}
              animate={reduced ? { rotate: 0 } : { rotate: -360 }}
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 22,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            >
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke={hexWithAlpha(theme.primary, 0.6)}
                strokeWidth="0.8"
                strokeDasharray={stage >= 4 ? "2 10" : "1 14"}
              />
            </motion.svg>
          ) : null}

          <motion.div
            aria-hidden
            className="absolute inset-6 rounded-full"
            style={{
              background: `radial-gradient(closest-side, ${hexWithAlpha(
                theme.primary,
                0.35,
              )} 0%, ${hexWithAlpha(theme.secondary, 0.15)} 55%, transparent 80%)`,
            }}
            initial={false}
            animate={
              reduced
                ? { opacity: 0.7 }
                : { opacity: [0.55, 0.85, 0.55] }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />

          <svg
            viewBox="0 0 120 200"
            className="relative z-[1] h-44 w-28 drop-shadow-[0_0_24px_rgba(0,0,0,0.5)] sm:h-48 sm:w-32"
            aria-hidden
          >
            <defs>
              <linearGradient id={`sil-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.primary} />
                <stop offset="100%" stopColor={theme.secondary} />
              </linearGradient>
            </defs>
            <path
              fill={`url(#sil-${gid})`}
              fillOpacity={0.85}
              d="M60 18c-8 0-14 6-14 14 0 5 2 9 6 12-8 4-14 14-14 26v36h12v-32c0-8 6-14 14-14h4c8 0 14 6 14 14v32h12V70c0-12-6-22-14-26 4-3 6-7 6-12 0-8-6-14-14-14z"
            />
            <path
              fill={`url(#sil-${gid})`}
              fillOpacity={0.5}
              d="M36 118 L48 88 L72 96 L60 52 L72 96 L96 88 L108 118 L96 128 L88 188 L72 188 L60 140 L48 188 L32 188 L24 128 Z"
            />
          </svg>
        </div>

        <div
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-zinc-200 [font-family:var(--font-onest)]"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 0 8px ${theme.primary}`,
            }}
            aria-hidden
          />
          Стадия <span className="text-white [font-family:var(--font-unbounded)]">{stage}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-200">{formLabel}</span>
        </div>

        <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
          {flavorText}
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.07] bg-black/30 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
            Аура
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-100 [font-family:var(--font-onest)]">
            {auraLabel}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-black/30 p-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
            Свечение
          </p>
          <div
            className="mt-1.5 flex items-center justify-center gap-1.5"
            role="img"
            aria-label={`Сила свечения ${intensity} из 5`}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-5 rounded-full transition-colors ${
                  i <= intensity ? theme.pipColor : "bg-zinc-700/70"
                }`}
                style={
                  i <= intensity
                    ? { boxShadow: `0 0 8px ${theme.primary}` }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    </GameCard>
  );
}

/** "#rrggbb" + alpha → "rgba(r,g,b,a)". Маленький утиль, без зависимостей. */
function hexWithAlpha(hex: string, alpha: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1]!, 16);
  const g = parseInt(m[2]!, 16);
  const b = parseInt(m[3]!, 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Узор кольца меняется со стадией — это даёт ощущение «эволюции»
 * без замены SVG. Чем выше стадия, тем плотнее и сложнее рисунок.
 */
function dashPatternForStage(stage: number): string {
  switch (stage) {
    case 1:
      return "2 14";
    case 2:
      return "4 10";
    case 3:
      return "8 6";
    case 4:
      return "12 4 2 4";
    case 5:
      return "16 3 2 3 6 3";
    default:
      return "2 14";
  }
}
