"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { GOAL_LABELS, GOALS, type Goal } from "@/lib/onboarding";
import { updateProfileGoalsAction } from "@/lib/profile";
import { AppModal } from "../ui/app-modal";
import { GameButton } from "../ui/game-button";
import { ProfileEditableRow } from "./profile-editable-row";

/**
 * ProfileGoalRow — строка «Цель» с единственным модалом редактирования
 * (D086 single-modal flow). Безопасное поле D084: мульти-выбор ≥1,
 * сохранение сразу через Server Action, без модала подтверждения.
 * Успех — спокойная inline-строка на Профиле, без тостов и редиректов.
 */
export function ProfileGoalRow({ goals }: { goals: Goal[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Goal[]>(goals);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const value =
    goals.length > 0 ? goals.map((g) => GOAL_LABELS[g]).join(", ") : "Не указано";

  const openModal = () => {
    setSelected(goals);
    setError(null);
    setOpen(true);
  };

  const toggle = (g: Goal) =>
    setSelected((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const save = () => {
    if (selected.length === 0 || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await updateProfileGoalsAction({ goals: selected });
      if (res.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setSaved(true);
      router.refresh();
    });
  };

  return (
    <>
      <ProfileEditableRow
        label="Цель"
        value={value}
        muted={goals.length === 0}
        saved={saved}
        onClick={openModal}
      />

      <AppModal
        open={open}
        onClose={() => (pending ? undefined : setOpen(false))}
        title="Цель"
        variant="sheet"
        dismissible={!pending}
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            Какой результат тебе сейчас важен? Можно выбрать несколько.
          </p>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Цель">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggle(g)}
                aria-pressed={selected.includes(g)}
                disabled={pending}
                className={`min-h-11 rounded-2xl border px-4 py-2.5 text-sm transition-colors [font-family:var(--font-onest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 ${
                  selected.includes(g)
                    ? "border-sky-400/50 bg-sky-400/[0.1] text-white"
                    : "border-white/12 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>

          {error ? (
            <p role="alert" className="text-sm text-rose-300 [font-family:var(--font-onest)]">
              {error}
            </p>
          ) : null}

          <div className="space-y-2.5">
            <GameButton
              variant="primary"
              className="min-h-12 w-full text-base"
              onClick={save}
              disabled={selected.length === 0 || pending}
            >
              {pending ? "Сохраняем…" : "Сохранить"}
            </GameButton>
            <GameButton
              variant="ghost"
              className="min-h-11 w-full text-sm"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Отмена
            </GameButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
