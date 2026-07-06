"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAvatarFormLabel } from "@/lib/progression/avatar-evolution";
import { type CompleteWorkoutResponse } from "@/lib/workouts";
import { AppModal } from "../ui/app-modal";
import { GameButton } from "../ui/game-button";

/**
 * RewardModal — принятый Reward Modal (D067, финальная версия 2026-06-23).
 *
 * Модал поверх затемнённого фона — не отдельный экран, не баннер, не тост.
 * Показывает ТОЛЬКО изменившиеся значения, от большего к меньшему:
 * Стадия → Уровень → XP. Спокойно, без казино (§5/§13).
 *
 * Поведение по D067:
 *   • без роста Стадии — одна кнопка «Вернуться к активности» → Activity;
 *   • рост Стадии — БЕЗ кнопки: авто-переход на Home через ~6 секунд
 *     (5–7s по D067); тап ускоряет переход. Сама Evolution-анимация на
 *     Home (D069) сознательно ещё не реализована — Home пока просто
 *     показывает новую стадию; маршрут и тайминг уже соответствуют D067,
 *     так что подключение D069 позже ничего здесь не ломает.
 *
 * Реакция компаньона — редкая: только на значимые вехи (уровень/стадия),
 * не на каждую тренировку (D036/D037).
 *
 * Идемпотентность: ветка alreadyCompleted не изображает новую награду —
 * спокойное «уже засчитано», без +XP.
 */

export type FeedbackState = NonNullable<CompleteWorkoutResponse["data"]>;

/** Авто-переход на Home при росте Стадии (D067: 5–7 секунд). */
const EVOLUTION_AUTO_ADVANCE_MS = 6000;

export function RewardModal({ feedback }: { feedback: FeedbackState | null }) {
  const router = useRouter();
  const evolved = feedback?.evolved === true;

  // Рост Стадии: авто-переход на Home (D067/D069 — Home является сценой
  // эволюции). Тап по модалу ускоряет переход; пропустить нечего, пока
  // D069-анимация не реализована.
  useEffect(() => {
    if (!feedback || !evolved) return;
    const t = setTimeout(() => {
      router.push("/dashboard?evolution=1");
    }, EVOLUTION_AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [feedback, evolved, router]);

  if (!feedback) return null;

  const { xpGained, newLevel, leveledUp, evolution, alreadyCompleted, companion } = feedback;

  // Реакция Голоса — только на значимые вехи (D036/D037/D067).
  const voiceLine = evolved || leveledUp ? companion.message : null;

  // ── Ветка «уже засчитано сегодня»: без изображения новой награды. ──
  if (alreadyCompleted) {
    return (
      <AppModal open onClose={() => undefined} dismissible={false} ariaLabel="Тренировка уже засчитана">
        <div className="space-y-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [font-family:var(--font-onest)]">
            Уже засчитано сегодня
          </p>
          <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            XP за эту тренировку уже начислен. Возвращайся завтра.
          </p>
          <GameButton
            variant="primary"
            type="button"
            onClick={() => router.push("/workouts")}
            className="min-h-12 w-full text-sm"
          >
            Вернуться к активности
          </GameButton>
        </div>
      </AppModal>
    );
  }

  const content = (
    <div className="space-y-5 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [font-family:var(--font-onest)]">
        Тренировка завершена
      </p>

      {/* Только изменившиеся значения: Стадия → Уровень → XP (D067). */}
      <div className="space-y-2">
        {evolved ? (
          <div>
            <p className="text-3xl font-bold text-amber-200 [font-family:var(--font-unbounded)]">
              Стадия {evolution.stage}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-amber-200/70 [font-family:var(--font-onest)]">
              {getAvatarFormLabel(evolution.form)}
            </p>
          </div>
        ) : null}
        {leveledUp ? (
          <p
            className={`font-bold text-white [font-family:var(--font-unbounded)] ${
              evolved ? "text-lg" : "text-3xl"
            }`}
          >
            Уровень {newLevel}
          </p>
        ) : null}
        <p
          className={`[font-family:var(--font-onest)] ${
            evolved || leveledUp ? "text-sm text-zinc-400" : "text-2xl font-bold text-white"
          }`}
        >
          +{xpGained} XP
        </p>
      </div>

      {voiceLine ? (
        <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
          {voiceLine}
        </p>
      ) : null}
    </div>
  );

  if (evolved) {
    // Рост Стадии: без кнопки, авто-переход; тап ускоряет (D067).
    return (
      <AppModal open onClose={() => undefined} dismissible={false} ariaLabel="Эволюция стадии">
        <button
          type="button"
          onClick={() => router.push("/dashboard?evolution=1")}
          className="block w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300/60"
          aria-label="Перейти на главную"
        >
          {content}
          <p className="mt-5 text-center text-[11px] text-zinc-600 [font-family:var(--font-onest)]">
            Коснись, чтобы продолжить
          </p>
        </button>
      </AppModal>
    );
  }

  return (
    <AppModal open onClose={() => undefined} dismissible={false} ariaLabel="Награда за тренировку">
      <div className="space-y-6">
        {content}
        <GameButton
          variant="primary"
          type="button"
          onClick={() => router.push("/workouts")}
          className="min-h-12 w-full text-sm"
        >
          Вернуться к активности
        </GameButton>
      </div>
    </AppModal>
  );
}
