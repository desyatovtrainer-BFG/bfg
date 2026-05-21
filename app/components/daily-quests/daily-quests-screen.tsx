"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  buildDailyQuestList,
  completeDailyQuestAction,
  DAILY_QUEST_ORDER,
  type CompleteDailyQuestResponse,
  type DailyQuest,
  type QuestState,
} from "@/lib/quests";
import { DailyCompletionBanner } from "./daily-completion-banner";
import { QuestCard } from "./quest-card";

type DailyQuestsScreenProps = {
  /** Закрытые сегодня контракты — приходят с сервера, чтобы UI был сразу правильным. */
  initialCompletedIds?: ReadonlyArray<string>;
};

type QuestFeedback = NonNullable<CompleteDailyQuestResponse["data"]>;

function unlockStretchWhenWorkoutClosed(list: DailyQuest[]): DailyQuest[] {
  // «Stretch» открывается, как только workout перестал быть «активным» —
  // т.е. локально перешёл в completed или reward_claimed. Серверная
  // персистентность ловится через `reward_claimed` из initialCompletedIds.
  const workoutDone = list.some(
    (q) => q.id === "workout" && (q.state === "completed" || q.state === "reward_claimed"),
  );
  return list.map((q) => {
    if (q.id !== "stretch" || q.state !== "locked") return q;
    if (!workoutDone) return q;
    return {
      ...q,
      state: "active" as QuestState,
      lockReason: undefined,
      progress: { current: 0, max: 15, unitLabel: "мин" },
    };
  });
}

export function DailyQuestsScreen({ initialCompletedIds = [] }: DailyQuestsScreenProps) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reducedMotion = mounted && prefersReduced === true;

  const [quests, setQuests] = useState<DailyQuest[]>(() =>
    buildDailyQuestList(initialCompletedIds),
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<QuestFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const questsView = useMemo(() => unlockStretchWhenWorkoutClosed(quests), [quests]);

  const allClaimed = useMemo(
    () => questsView.length > 0 && questsView.every((q) => q.state === "reward_claimed"),
    [questsView],
  );

  const completeQuest = useCallback((id: string) => {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      const res = await completeDailyQuestAction(id);
      setPendingId(null);
      if (res.error || !res.data) {
        setError(res.error ?? "Не удалось закрыть контракт.");
        return;
      }
      // XP уже начислен на сервере (или контракт уже был закрыт сегодня —
      // тогда alreadyCompleted=true и xpGained=0). В обоих случаях UI
      // должен показать карточку как «сокровище ждёт».
      setQuests((prev) =>
        prev.map((q) => (q.id === id && q.state === "active" ? { ...q, state: "completed" } : q)),
      );
      setFeedback(res.data);
    });
  }, []);

  const claimReward = useCallback((id: string) => {
    // Клиентский шаг «забрать сокровище» — без сервера. XP уже начислен на
    // completeQuest; здесь только эмоциональное закрытие карточки.
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id && q.state === "completed" ? { ...q, state: "reward_claimed" } : q,
      ),
    );
    setFeedback((curr) => (curr && curr.questId === id ? null : curr));
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(95%_70%_at_50%_-18%,rgba(56,189,248,0.11),transparent_52%),radial-gradient(80%_55%_at_100%_35%,rgba(167,139,250,0.09),transparent_48%),radial-gradient(65%_50%_at_0%_90%,rgba(251,191,36,0.05),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/55 via-transparent to-black" />
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]" />

      <div className="relative z-[1] mx-auto max-w-lg px-4 pb-32 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex items-center justify-between gap-3"
        >
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 [font-family:var(--font-onest)]"
          >
            ← Главная
          </Link>
          <span className="rounded-full border border-sky-500/25 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-300/90 [font-family:var(--font-onest)]">
            Контракты дня
          </span>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-extrabold leading-tight text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            Ежедневная{" "}
            <span className="bg-gradient-to-r from-sky-200 via-amber-200 to-violet-200 bg-clip-text text-transparent">
              эволюция
            </span>
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
            Это не список дел — это цепочка сделок с вселенной. Каждый закрытый контракт усиливает привычку
            возвращаться: награда близко, пульс прогресса на экране.
          </p>
        </motion.header>

        <DailyCompletionBanner show={allClaimed} reducedMotion={reducedMotion} />

        <AnimatePresence>
          {feedback ? (
            <motion.div
              key={`fb-${feedback.questId}-${feedback.totalXp}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-100 [font-family:var(--font-onest)]"
              aria-live="polite"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200/80">
                Контракт закрыт
              </p>
              <p className="mt-1">
                «{feedback.questTitle}»
                {feedback.alreadyCompleted
                  ? " — уже закрыт сегодня. Возвращайся завтра за новым слоем."
                  : ` · +${feedback.xpGained} XP · уровень ${feedback.newLevel}${
                      feedback.leveledUp ? " · новый уровень" : ""
                    }${feedback.evolved ? " · эволюция аватара" : ""}`}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {error ? (
          <p
            className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-200 [font-family:var(--font-onest)]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <motion.section
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
          className="space-y-4"
        >
          {DAILY_QUEST_ORDER.map((id) => questsView.find((q) => q.id === id))
            .filter((q): q is DailyQuest => Boolean(q))
            .map((quest) => {
              const isPending = pendingId === quest.id;
              return (
                <motion.div
                  key={quest.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={isPending ? "pointer-events-none opacity-80" : undefined}
                >
                  <QuestCard
                    quest={quest}
                    reducedMotion={reducedMotion}
                    onComplete={completeQuest}
                    onClaimReward={claimReward}
                  />
                </motion.div>
              );
            })}
        </motion.section>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 text-center text-xs leading-relaxed text-zinc-600 [font-family:var(--font-onest)]"
        >
          Предвкушение — часть награды. Загляни завтра первым: вселенная любит тех, кто не пропускает открытие
          контрактов.
        </motion.p>
      </div>
    </div>
  );
}
