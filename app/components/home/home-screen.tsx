"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { describeResolvedAvatar, resolveAvatar } from "@/lib/avatar";
import { AvatarRenderer } from "../avatar/avatar-renderer";
import { useAvatarState } from "../avatar/avatar-provider";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameButton } from "../ui/game-button";
import { EvolutionArrival } from "./evolution-arrival";
import { OpenRing } from "../ui/open-ring";
import { ProfileHeaderButton } from "../ui/profile-header-button";
import { ScreenHeader } from "../ui/screen-header";

/**
 * HomeScreen — визуальная оболочка принятого Home (D071, уточнён D082).
 *
 * Композиция сверху вниз (wireframes §8):
 *   Минимальная шапка (только кнопка Профиля, D006; без колокольчика)
 *   → Living Presence в центре (тап → «Внешний вид», D073)
 *   → два ОТКРЫТЫХ кольца вокруг Presence (D071):
 *       внутреннее = Level Progress («N УР.»),
 *       внешнее   = Weekly Activity («N/M АКТ.», только завершённые действия)
 *   → Stage Block: Имя аватара первой строкой (D082), затем стадия
 *   → Voice Slot: редкая спокойная реплика (D036–D038); может быть пуст
 *   → единственный primary CTA «Продолжить путь»
 *   → нижняя навигация (слой (app)).
 *
 * Home сознательно НЕ показывает (D071): списки квестов/тренировок,
 * сырые XP-таблицы, статистику, стрик-кольцо, третье кольцо, колокольчик,
 * шейминг/хайп. Home — эмоциональный центр, не дашборд.
 *
 * Слайс 3A — только визуальная оболочка: CTA временно ведёт на /workouts
 * (Journey-роутер D043/D046 — позже), память колец D070 — позже.
 */

export type HomeScreenProps = {
  level: number;
  /** 0..1 — заполнение внутреннего кольца (прогресс к следующему уровню). */
  levelProgress: number;
  /** Завершённые действия текущей UTC-недели (уже с капом D071). */
  weeklyDone: number;
  weeklyCapacity: number;
  evolutionStage: number;
  evolutionFormLabel: string;
  /** Имя аватара; null → спокойный fallback (наречение — в онбординге, D079). */
  avatarName: string | null;
  /** Реплика Голоса; null/пустая строка → слот молчит (это нормально, D071). */
  voiceLine: string | null;
  /**
   * Одноразовый сигнал прибытия эволюции (?evolution=1 от Reward Modal,
   * D067/D069). true → поверх Home показывается EvolutionArrival.
   */
  evolutionArrival?: boolean;
  /**
   * Continue Journey (D043) — цель и подпись вычисляет серверный резолвер
   * (lib/journey): активная сессия → «Вернуться к тренировке», иначе —
   * следующая по циклу «Продолжить путь».
   */
  ctaHref: string;
  ctaLabel: string;
};

export function HomeScreen({
  level,
  levelProgress,
  weeklyDone,
  weeklyCapacity,
  evolutionStage,
  evolutionFormLabel,
  avatarName,
  voiceLine,
  evolutionArrival = false,
  ctaHref,
  ctaLabel,
}: HomeScreenProps) {
  const reduced = useReducedMotion() === true;
  const name = avatarName?.trim() || "Твой спутник";
  const { savedConfig } = useAvatarState();
  const resolvedAvatar = resolveAvatar(savedConfig, evolutionStage);

  return (
    <CinematicCanvas
      className="min-h-dvh"
      contentClassName="flex min-h-dvh flex-col pb-28"
    >
      <ScreenHeader
        title="Home"
        titleHidden
        profileSlot={<ProfileHeaderButton returnTo="/dashboard" />}
      />

      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-6 py-4"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Presence в двух открытых кольцах. Кольца — поддерживающий слой,
            фигура остаётся доминантой (D071). */}
        <OpenRing
          progress={weeklyCapacity > 0 ? weeklyDone / weeklyCapacity : 0}
          label={`${weeklyDone}/${weeklyCapacity} АКТ.`}
          accent="sky"
          size={300}
          thickness={5}
          ariaLabel={`Активность недели: ${weeklyDone} из ${weeklyCapacity}`}
        >
          <OpenRing
            progress={levelProgress}
            label={`${level} УР.`}
            accent="amber"
            size={222}
            thickness={6}
            ariaLabel={`Уровень ${level}`}
          >
            {/* Тап по Presence — вход в кастомизацию (D073). Аффорданс на самой
                фигуре, не конкурирующая кнопка: primary CTA остаётся один. */}
            <Link
              href="/appearance"
              aria-label="Внешний вид"
              className="rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400/60"
            >
              <AvatarRenderer
                config={resolvedAvatar}
                presentation="home"
                motion="live"
                label={`Живой аватар: ${describeResolvedAvatar(resolvedAvatar)}`}
              />
            </Link>
          </OpenRing>
        </OpenRing>

        {/* Stage Block: Имя — первая строка идентичности (D082),
            затем стадия. Спокойно, без цифр-дашборда. */}
        <div className="text-center">
          <p className="text-xl font-bold text-white [font-family:var(--font-unbounded)]">
            {name}
          </p>
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400 [font-family:var(--font-onest)]">
            {evolutionFormLabel} · Стадия {evolutionStage}
          </p>
        </div>

        {/* Voice Slot: событийная редкая реплика; пустой слот — тишина,
            и это нормальное состояние Home (D036–D038, D071). */}
        {voiceLine ? (
          <p className="max-w-[17rem] text-center text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            {voiceLine}
          </p>
        ) : null}
      </motion.div>

      {/* Единственный primary CTA (D071/D043). Без first-run подсветки (D082). */}
      <div className="mx-auto w-full max-w-[420px]">
        <GameButton href={ctaHref} variant="primary" className="min-h-[3.25rem] w-full py-3.5 text-base">
          {ctaLabel}
        </GameButton>
      </div>

      {/* Одноразовое прибытие эволюции (D069): Home — сцена стадии. */}
      {evolutionArrival ? (
        <EvolutionArrival
          direction={resolvedAvatar.direction}
          stageLabel={evolutionFormLabel}
          stageNumber={evolutionStage}
        />
      ) : null}
    </CinematicCanvas>
  );
}
