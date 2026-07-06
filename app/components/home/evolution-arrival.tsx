"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GameButton } from "../ui/game-button";
import { PresenceFigure, type PresenceDirection } from "../ui/presence-figure";

/**
 * EvolutionArrival — граница Evolution Reveal на Home (D069, слайс 9A).
 *
 * Home — эмоциональная сцена эволюции: после роста Стадии Reward Modal
 * (D067) приводит сюда с одноразовым сигналом `?evolution=1`. Этот слой —
 * спокойное «прибытие» новой стадии вокруг Presence, НЕ финальная богатая
 * анимация трансформации (она — отдельная работа поверх этой границы).
 *
 * Одноразовость: «Продолжить» закрывает слой и снимает query-флаг через
 * router.replace("/dashboard") — обновление страницы reveal не повторяет.
 * Никакого DB/localStorage-состояния (граница D070 не затронута).
 *
 * Копия здесь — временная implementation copy (D069 финальную копию
 * reveal не фиксирует): спокойно, без хайпа, без эмодзи, без казино.
 */

type EvolutionArrivalProps = {
  direction: PresenceDirection;
  /** Название формы стадии (напр. из getAvatarFormLabel). */
  stageLabel: string;
  stageNumber: number;
};

export function EvolutionArrival({
  direction,
  stageLabel,
  stageNumber,
}: EvolutionArrivalProps) {
  const router = useRouter();
  const reduced = useReducedMotion() === true;
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const finish = () => {
    setOpen(false);
    // Снимаем одноразовый сигнал, чтобы reveal не replayed при refresh.
    router.replace("/dashboard", { scroll: false });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/85 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.15 : 0.45, ease: "easeOut" }}
      role="dialog"
      aria-modal="true"
      aria-label="Новая стадия открыта"
    >
      {/* Presence — визуальный центр прибытия; спокойное дыхание/свечение. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: reduced ? 0 : 0.15 }}
      >
        <PresenceFigure direction={direction} size="lg" alt="Твоё Presence — новая стадия" />
      </motion.div>

      <motion.div
        className="mt-6 max-w-[19rem] text-center"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: reduced ? 0 : 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white [font-family:var(--font-unbounded)]">
          Новая стадия открыта
        </h2>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/80 [font-family:var(--font-onest)]">
          {stageLabel} · Стадия {stageNumber}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
          Твой спутник изменился. Возвращайся к пути.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 w-full max-w-[320px]"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.45 }}
      >
        <GameButton
          variant="primary"
          type="button"
          onClick={finish}
          className="min-h-12 w-full text-sm"
        >
          Продолжить
        </GameButton>
      </motion.div>
    </motion.div>
  );
}
