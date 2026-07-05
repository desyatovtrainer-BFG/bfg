"use client";

import { useCallback, useRef, useState } from "react";
import {
  completeDailyQuestAction,
  type DailyQuest,
} from "@/lib/quests";
import { GameCard } from "../ui/game-card";

/**
 * ActivityQuests — секция ежедневных квестов внутри Activity (D042/D055).
 *
 * Состояние квеста БИНАРНОЕ: выполнен или нет (D055) — никаких прогресс-
 * баров, счётчиков «3/5 л», процентов и промежуточных состояний. Строки
 * никогда не переупорядочиваются; выполненные не празднуются («3/3» нет),
 * пустота не стыдится (D031).
 *
 * Клейм переиспользует СУЩЕСТВУЮЩИЙ server action completeDailyQuestAction
 * без изменений: XP-значения, дневная подборка (D017) и идемпотентность —
 * серверные. Обратная связь — спокойная inline-строка (не тост, §13).
 */

type ActivityQuestsProps = {
  initialQuests: DailyQuest[];
};

export function ActivityQuests({ initialQuests }: ActivityQuestsProps) {
  const [quests, setQuests] = useState<DailyQuest[]>(() => [...initialQuests]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef<Set<string>>(new Set());

  const completeQuest = useCallback((id: string) => {
    if (inFlightRef.current.has(id)) return;
    inFlightRef.current.add(id);
    setError(null);
    setPendingId(id);
    void (async () => {
      try {
        const res = await completeDailyQuestAction(id);
        if (res.error || !res.data) {
          setError(res.error ?? "Не удалось выполнить квест.");
          return;
        }
        setQuests((prev) =>
          prev.map((q) =>
            q.id === id && q.state === "active" ? { ...q, state: "reward_claimed" } : q,
          ),
        );
        setNote(
          res.data.alreadyCompleted
            ? "Этот квест уже выполнен сегодня."
            : `«${res.data.questTitle}» · +${res.data.xpGained} XP`,
        );
      } catch {
        setError("Не удалось выполнить квест. Попробуй ещё раз.");
      } finally {
        inFlightRef.current.delete(id);
        setPendingId(null);
      }
    })();
  }, []);

  if (quests.length === 0) {
    return (
      <GameCard className="p-5 text-center">
        <p className="text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
          Сегодняшние квесты появятся здесь.
        </p>
      </GameCard>
    );
  }

  return (
    <div className="space-y-3">
      {quests.map((quest) => {
        const done = quest.state === "reward_claimed" || quest.state === "completed";
        const isPending = pendingId === quest.id;
        return (
          <GameCard
            key={quest.id}
            className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
              done ? "opacity-75" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white [font-family:var(--font-onest)]">
                {quest.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-zinc-500 [font-family:var(--font-onest)]">
                {quest.subtitle}
              </p>
            </div>

            {done ? (
              <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-300/90 [font-family:var(--font-onest)]">
                <CheckIcon />
                Выполнено
              </span>
            ) : (
              <button
                type="button"
                onClick={() => completeQuest(quest.id)}
                disabled={isPending}
                className="shrink-0 rounded-xl border border-sky-400/35 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-sky-200 transition-colors hover:bg-white/[0.09] disabled:pointer-events-none disabled:opacity-50 [font-family:var(--font-onest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
              >
                {isPending ? "…" : "Выполнено"}
              </button>
            )}
          </GameCard>
        );
      })}

      {/* Спокойная inline-обратная связь (не тост, §13). */}
      <div aria-live="polite">
        {note ? (
          <p className="px-1 text-xs text-zinc-500 [font-family:var(--font-onest)]">{note}</p>
        ) : null}
        {error ? (
          <p role="alert" className="px-1 text-xs text-rose-300 [font-family:var(--font-onest)]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
