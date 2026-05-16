"use client";

/**
 * ВРЕМЕННАЯ dev-кнопка для ручного теста XP-прогрессии.
 *
 * Зовёт server action `awardTestWorkoutXp` (XP_REWARDS.WORKOUT_COMPLETE)
 * и коротко показывает результат рядом с кнопкой. Ничего не редизайнит,
 * никакого глобального стора — это пробник, не фича.
 *
 * УДАЛИТЬ вместе с lib/progression/dev-actions.ts перед релизом.
 */

import { useState, useTransition } from "react";
import { awardTestWorkoutXp, type DevAwardXpResponse } from "@/lib/progression/dev-actions";
import { GameButton } from "../ui/game-button";

export function DevXpTestButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<DevAwardXpResponse | null>(null);

  const handleClick = () => {
    startTransition(async () => {
      const res = await awardTestWorkoutXp();
      setResult(res);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <GameButton
        variant="ghost"
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full py-2.5 text-sm"
      >
        {pending ? "Начисляем…" : "Тест: +XP"}
      </GameButton>
      {result?.error ? (
        <p className="text-xs text-rose-400 [font-family:var(--font-onest)]">
          {result.error}
        </p>
      ) : null}
      {result?.data ? (
        <p className="text-xs text-zinc-500 [font-family:var(--font-onest)]">
          +{result.data.xpGained} XP · уровень {result.data.newLevel}
          {result.data.leveledUp ? " · level up" : ""}
          {result.data.evolved ? " · эволюция" : ""}
        </p>
      ) : null}
    </div>
  );
}
