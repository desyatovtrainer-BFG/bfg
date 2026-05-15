"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/** Детерминированный «шум» для позиций частиц (без Math.random — одинаково на сервере и в браузере) */
function hash01(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.085, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 32 },
  },
};

const lineReveal = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
      delay: i * 0.07,
    },
  }),
};

function FloatingParticles({
  reduced,
  show,
  count = 42,
}: {
  reduced: boolean;
  /** После монтирования в браузере — избегаем рассинхрона SSR / motion при гидрации */
  show: boolean;
  count?: number;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${hash01(i * 3) * 100}%`,
        top: `${hash01(i * 7) * 100}%`,
        size: 1 + hash01(i * 11) * 2.5,
        duration: 10 + hash01(i * 13) * 14,
        delay: hash01(i * 17) * 8,
        driftX: (hash01(i * 19) - 0.5) * 28,
        driftY: -40 - hash01(i * 23) * 80,
        opacity: 0.12 + hash01(i * 29) * 0.45,
      })),
    [count],
  );

  if (!show) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
    );
  }

  if (reduced) {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.slice(0, 12).map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity * 0.35,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-cyan-200/90 via-violet-200/70 to-fuchsia-200/80 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, p.driftY, 0],
            x: [0, p.driftX, 0],
            opacity: [p.opacity * 0.35, p.opacity, p.opacity * 0.4],
            scale: [0.85, 1.15, 0.9],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function EvolvingAvatar({ reduced }: { reduced: boolean }) {
  const cycle = reduced ? 0 : 5.8;

  return (
    <div className="relative mx-auto flex w-full max-w-[17.5rem] flex-col items-center sm:max-w-xs">
      <div className="relative flex aspect-[4/5] w-[min(78vw,17.5rem)] items-end justify-center sm:w-full">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-[-20%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.2)_0%,rgba(167,139,250,0.1)_42%,transparent_70%)] blur-3xl"
          animate={
            reduced
              ? undefined
              : {
                  opacity: [0.4, 0.82, 0.48],
                  scale: [0.95, 1.06, 0.99],
                }
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-[6%] left-1/2 h-[46%] w-[125%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.16)_0%,transparent_68%)] blur-3xl"
          animate={
            reduced
              ? undefined
              : {
                  opacity: [0.22, 0.52, 0.28],
                  x: ["-50%", "-48%", "-51%", "-50%"],
                }
          }
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg
          viewBox="0 0 240 360"
          className="relative z-[1] w-full overflow-visible drop-shadow-[0_0_32px_rgba(56,189,248,0.28)]"
          role="img"
          aria-label="Силуэт аватара, меняющийся по мере прогресса"
        >
          <defs>
            <linearGradient id="sil-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.78" />
            </linearGradient>
            <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            fill="url(#sil-glow)"
            fillOpacity={0.36}
            filter="url(#soft-glow)"
            d="M120 48c-12 0-22 10-22 22 0 8 3 15 9 20-14 7-24 24-24 44v56h22v-52c0-12 8-22 20-26 2 14 10 26 22 30 2 0 4 1 5 1s3-1 5-1c12-4 20-16 22-30 12 4 20 14 20 26v52h22v-56c0-20-10-37-24-44 6-5 9-12 9-20 0-12-10-22-22-22z"
            animate={
              reduced
                ? { opacity: 0.5 }
                : { opacity: [0.92, 0.1, 0.1, 0.92], scale: [1, 0.94, 0.94, 1] }
            }
            transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "120px 180px" }}
          />

          <motion.path
            fill="url(#sil-glow)"
            fillOpacity={0.5}
            filter="url(#soft-glow)"
            d="M120 40c-16 0-28 12-28 26 0 10 5 18 13 23-17 9-28 28-28 50v62h26v-58c0-14 10-26 22-30 3 17 12 30 26 34 3 1 6 1 9 0 14-4 23-17 26-34 12 4 22 16 22 30v58h26v-62c0-22-11-41-28-50 8-5 13-13 13-23 0-14-12-26-28-26-5 0-10 2-14 5-4-3-9-5-14-5z"
            animate={
              reduced
                ? { opacity: 0.55 }
                : { opacity: [0.16, 0.94, 0.16, 0.16], scale: [0.96, 1, 0.96, 0.96] }
            }
            transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut", delay: cycle / 3 }}
            style={{ transformOrigin: "120px 180px" }}
          />

          <motion.g
            animate={
              reduced
                ? { opacity: 0.78 }
                : { opacity: [0.1, 0.1, 0.98, 0.3], scale: [0.95, 0.95, 1.04, 1] }
            }
            transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut", delay: (cycle * 2) / 3 }}
            style={{ transformOrigin: "120px 180px" }}
          >
            <path
              fill="url(#sil-glow)"
              fillOpacity={0.52}
              filter="url(#soft-glow)"
              d="M48 118 L72 78 L108 92 L120 32 L132 92 L168 78 L192 118 L168 132 L154 300 L134 300 L120 200 L106 300 L86 300 L72 132 Z"
            />
          </motion.g>
        </svg>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[10%] bottom-[5%] h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent"
          animate={reduced ? undefined : { opacity: [0.15, 0.7, 0.22], scaleX: [0.82, 1, 0.88] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function OnboardingScreen() {
  const prefersReduced = useReducedMotion();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const reducedMotion = clientReady && prefersReduced === true;

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-black text-zinc-100">
      {/* Атмосфера */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-15%,rgba(56,189,248,0.11),transparent_58%),radial-gradient(95%_65%_at_100%_35%,rgba(167,139,250,0.1),transparent_52%),radial-gradient(85%_55%_at_0%_75%,rgba(251,113,133,0.07),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-black" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <FloatingParticles reduced={reducedMotion} show={clientReady} />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] top-[22%] h-[min(72vw,26rem)] w-[min(72vw,26rem)] rounded-full bg-sky-400/8 blur-3xl"
        animate={
          reducedMotion ? undefined : { x: [0, 32, -10, 0], y: [0, -18, 10, 0], scale: [1, 1.07, 1.01, 1] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[22%] bottom-[5%] h-[min(88vw,30rem)] w-[min(88vw,30rem)] rounded-full bg-fuchsia-500/9 blur-3xl"
        animate={
          reducedMotion ? undefined : { x: [0, -36, 14, 0], y: [0, 22, -8, 0], scale: [1, 1.05, 1, 1] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Лёгкий «киношный» виньет */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]" />

      <motion.header
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-[2] px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8"
      >
        <motion.div variants={item} className="flex flex-col items-center gap-1.5 text-center sm:items-start sm:text-left">
          <div className="flex items-baseline gap-2">
            <span className="bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 bg-clip-text text-[1.65rem] font-extrabold tracking-[0.22em] text-transparent sm:text-[1.85rem] [font-family:var(--font-unbounded)]">
              BFG
            </span>
            <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.85)] sm:inline" />
          </div>
          <p className="max-w-[16rem] text-[0.7rem] font-medium uppercase tracking-[0.28em] text-zinc-500 sm:text-xs [font-family:var(--font-onest)]">
            Big Fitness Game
          </p>
        </motion.div>
      </motion.header>

      <main className="relative z-[2] flex min-h-0 flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Центральная колонка: аватар + типографика */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-7 sm:gap-10">
            <motion.div variants={item} className="w-full shrink-0">
              <EvolvingAvatar reduced={reducedMotion} />
            </motion.div>

            <div className="w-full max-w-lg space-y-5 text-center sm:space-y-6">
              <motion.div variants={item} className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-300/75 [font-family:var(--font-onest)] sm:text-xs">
                  Эмоциональная игровая фитнес-платформа
                </p>
              </motion.div>

              <div className="space-y-3 sm:space-y-4">
                {[
                  { text: "ТВОЁ ТЕЛО.", accent: "ТЕЛО", openQuote: true },
                  { text: "ТВОЙ ПУТЬ.", accent: "ПУТЬ" },
                  { text: "ТВОИ ПОБЕДЫ.", accent: "ПОБЕДЫ", closeQuote: true },
                ].map((line, idx) => {
                  const parts = line.text.split(line.accent);
                  return (
                  <motion.h1
                    key={line.text}
                    variants={lineReveal}
                    custom={idx}
                    className="text-balance text-[1.35rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[1.85rem] md:text-[2.1rem] [font-family:var(--font-unbounded)]"
                  >
                    {line.openQuote ? (
                      <span className="mr-0.5 text-sky-300/50 sm:mr-1">«</span>
                    ) : null}
                    {parts[0]}
                    <span className="bg-gradient-to-r from-sky-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                      {line.accent}
                    </span>
                    {parts[1]}
                    {line.closeQuote ? (
                      <span className="ml-0.5 text-sky-300/50 sm:ml-1">»</span>
                    ) : null}
                  </motion.h1>
                );
                })}
              </div>

              <motion.p
                variants={item}
                className="mx-auto max-w-md text-pretty text-lg font-semibold leading-snug text-zinc-100 sm:text-xl [font-family:var(--font-onest)]"
              >
                Стань двигателем прогресса
              </motion.p>
              <motion.p
                variants={item}
                className="mx-auto max-w-md text-pretty text-[0.875rem] leading-relaxed text-zinc-500 sm:text-[0.95rem] [font-family:var(--font-onest)]"
              >
                Игра про человека, который растёт через движение: эмоции, награды и твоя личная
                эволюция в одной вселенной.
              </motion.p>
            </div>
          </div>

          {/* CTA: премиальные кнопки, крупные зоны нажатия */}
          <motion.div variants={item} className="mx-auto mt-8 w-full max-w-md shrink-0 space-y-3 sm:mt-10">
            <motion.div
              whileHover={reducedMotion ? undefined : { scale: 1.015 }}
              whileTap={reducedMotion ? undefined : { scale: 0.985 }}
              className="w-full"
            >
              <Link
                href="/dashboard"
                className="group relative flex min-h-[3.25rem] w-full items-center justify-center overflow-hidden rounded-2xl border border-sky-400/30 bg-gradient-to-b from-white/[0.14] to-white/[0.05] px-6 py-[1.05rem] text-[0.95rem] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_24px_64px_-28px_rgba(56,189,248,0.5)] [font-family:var(--font-onest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70 sm:min-h-[3.5rem] sm:rounded-3xl sm:py-4 sm:text-base"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-400/12 to-fuchsia-500/0 opacity-60" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-[transform,opacity] duration-700 group-hover:translate-x-[200%] group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-2">
                  Старт
                  <motion.span
                    aria-hidden
                    className="text-lg font-normal text-sky-200/90"
                    animate={reducedMotion ? undefined : { x: [0, 3, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↗
                  </motion.span>
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={reducedMotion ? undefined : { scale: 1.01 }}
              whileTap={reducedMotion ? undefined : { scale: 0.99 }}
              className="w-full"
            >
              <Link
                href="/profile"
                className="flex min-h-[3.25rem] w-full items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-[1.05rem] text-[0.95rem] font-semibold text-zinc-200 backdrop-blur-md transition-colors hover:border-white/18 hover:bg-white/[0.06] [font-family:var(--font-onest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400/50 sm:min-h-[3.5rem] sm:rounded-3xl sm:py-4 sm:text-base"
              >
                Есть аккаунт
              </Link>
            </motion.div>

            <p className="pt-1 text-center text-[11px] leading-relaxed text-zinc-600 [font-family:var(--font-onest)] sm:text-xs">
              Вселенная BFG: прогресс, эмоции и награды за каждое движение вперёд.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </div>
  );
}
