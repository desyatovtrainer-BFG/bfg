"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { DailyQuest, QuestKind, QuestState } from "@/lib/quests";
import { GameButton } from "../ui/game-button";

export type QuestCardProps = {
  quest: DailyQuest;
  reducedMotion?: boolean;
  onComplete?: (id: string) => void;
  /** true в момент, когда экран подтвердил server-success — запускает burst-анимацию. */
  isBursting?: boolean;
};

function QuestGlyph({ kind }: { kind: QuestKind }) {
  const map: Record<QuestKind, string> = {
    steps: "◎",
    stretch: "〰",
    hydration: "💧",
    walk: "🚶",
    breathing: "🌬",
    recovery: "🌙",
  };
  return (
    <span
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent text-lg"
      aria-hidden
    >
      {map[kind]}
    </span>
  );
}

function stateStyles(state: QuestState) {
  switch (state) {
    case "locked":
      return {
        wrap: "border-zinc-700/80 bg-zinc-950/40 opacity-[0.92]",
        glow: "shadow-none",
        accent: "text-zinc-500",
      };
    case "active":
      return {
        wrap: "border-sky-500/35 bg-gradient-to-b from-sky-500/[0.08] to-transparent",
        glow: "shadow-[0_0_36px_-14px_rgba(56,189,248,0.28)]",
        accent: "text-sky-300/95",
      };
    case "completed":
      return {
        wrap: "border-amber-400/45 bg-gradient-to-b from-amber-500/15 to-amber-950/10",
        glow: "shadow-[0_0_44px_-12px_rgba(251,191,36,0.38)]",
        accent: "text-amber-200",
      };
    case "reward_claimed":
      return {
        wrap: "border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.06] to-transparent",
        glow: "shadow-[0_0_28px_-16px_rgba(52,211,153,0.2)]",
        accent: "text-emerald-300/90",
      };
    default:
      return { wrap: "", glow: "", accent: "" };
  }
}

function RewardsLine({ rewards }: { rewards: DailyQuest["rewards"] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs [font-family:var(--font-onest)]">
      <span className="font-semibold tabular-nums text-amber-200/95">+{rewards.xp} XP</span>
    </div>
  );
}

export function QuestCard({
  quest,
  reducedMotion = false,
  onComplete,
  isBursting = false,
}: QuestCardProps) {
  const [claimBurst, setClaimBurst] = useState(false);
  const s = stateStyles(quest.state);
  const pct =
    quest.progress && quest.progress.max > 0
      ? Math.min(100, Math.round((quest.progress.current / quest.progress.max) * 100))
      : 0;

  // Burst запускается после server-success (isBursting=true из экрана),
  // а не при нажатии кнопки — гарантирует, что анимация соответствует
  // реальному начислению XP.
  useEffect(() => {
    if (!isBursting || reducedMotion) return;
    setClaimBurst(true);
    const t = window.setTimeout(() => setClaimBurst(false), 700);
    return () => { window.clearTimeout(t); setClaimBurst(false); };
  }, [isBursting, reducedMotion]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className={[
        "relative overflow-hidden rounded-2xl border p-4 sm:p-5",
        s.wrap,
        s.glow,
      ].join(" ")}
    >
      {quest.state === "active" && !reducedMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_10%_0%,rgba(56,189,248,0.12),transparent_55%)]"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}


      <div className="relative flex gap-3">
        <QuestGlyph kind={quest.kind} />
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${s.accent} [font-family:var(--font-onest)]`}>
            {quest.state === "locked"
              ? "Закрытый контракт"
              : quest.state === "active"
                ? "Контракт активен"
                : "Контракт закрыт"}
          </p>
          <h3 className="mt-1 text-base font-bold text-white [font-family:var(--font-unbounded)] sm:text-lg">
            {quest.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">{quest.subtitle}</p>

          <RewardsLine rewards={quest.rewards} />

          {quest.state === "locked" ? (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2 text-xs text-zinc-500 [font-family:var(--font-onest)]">
              <span className="shrink-0 text-zinc-600" aria-hidden>
                🔒
              </span>
              {quest.lockReason ?? "Сначала выполни предыдущие испытания дня."}
            </p>
          ) : null}

          {quest.state === "active" && quest.progress ? (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[11px] text-zinc-500 [font-family:var(--font-onest)]">
                <span>Пульс задания</span>
                <span className="tabular-nums text-zinc-400">
                  {quest.progress.current.toLocaleString("ru-RU")}
                  {quest.progress.unitLabel ? ` ${quest.progress.unitLabel}` : ""} /{" "}
                  {quest.progress.max.toLocaleString("ru-RU")}
                  {quest.progress.unitLabel ? ` ${quest.progress.unitLabel}` : ""}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-900 ring-1 ring-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500"
                  initial={{ width: reducedMotion ? `${pct}%` : 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ) : null}

          {quest.state === "active" && !quest.progress ? (
            <p className="mt-3 text-xs italic text-sky-200/80 [font-family:var(--font-onest)]">
              Сделай шаг — вселенная уже держит награду наготове.
            </p>
          ) : null}

          {quest.state === "reward_claimed" ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-200/90 [font-family:var(--font-onest)]">
              <span aria-hidden>✓</span>
              Награда у тебя в инвентаре. Завтра — новый слой эволюции.
            </div>
          ) : null}
        </div>
      </div>

      {quest.state === "active" ? (
        <div className="relative mt-4">
          <GameButton
            type="button"
            variant="primary"
            className="w-full py-3 text-sm"
            onClick={() => onComplete?.(quest.id)}
          >
            Зафиксировать выполнение
          </GameButton>
        </div>
      ) : null}


      <AnimatePresence>
        {claimBurst ? (
          <motion.div
            key="claim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-[2px]"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300"
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 14) * Math.PI * 2) * (70 + i * 5),
                  y: Math.sin((i / 14) * Math.PI * 2) * (70 + i * 5),
                  opacity: 0,
                  scale: 1.2,
                }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            ))}
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-black text-amber-200 [font-family:var(--font-unbounded)]"
            >
              +{quest.rewards.xp} XP
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
