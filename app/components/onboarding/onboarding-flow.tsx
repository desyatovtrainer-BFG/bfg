"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  ALLOWED_FREQUENCIES,
  completeOnboardingAction,
  directionFromSex,
  isStructureEligible,
  saveOnboardingS2Action,
  saveOnboardingS3Action,
  type FitnessLevel,
  type Goal,
  type OnboardingScreen,
  type OnboardingState,
  type Sex,
  type TrainingFormat,
  type TrainingStructure,
  type WeeklyFrequency,
} from "@/lib/onboarding";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameButton } from "../ui/game-button";
import { PresenceFigure } from "../ui/presence-figure";

/**
 * OnboardingFlow — Presence-led онбординг S1–S4 (D078, копия D079, D085).
 *
 * Presence присутствует на каждом экране и «задаёт» вопросы; опции —
 * структурированные ответы пользователя. Это первый диалог, не форма
 * (D078). Без чата, без хайпа, без стыда, без эмодзи (§11/§23).
 *
 *   S1 — первая встреча: Seed Form без текста; прямой тап ведёт на S2,
 *        а после 2–3с тишины появляется реплика + [Продолжить];
 *   S2 — Цель (мульти ≥1) + Герой/Героиня;
 *   S3 — Уровень + Место + условная Частота (матрица D085) + условный
 *        Фулбоди/Сплит (ТОЛЬКО Зал+не-новичок; остальным вопрос не
 *        показывается вовсе — никаких disabled/заглушек);
 *   S4 — обязательное наречение (без «Пропустить»); Presence впервые
 *        показывает направление (Герой/Героиня, D079/D083).
 *
 * После S4 → полный Home без авто-запуска тренировки и подсветки CTA
 * (D082). Онбординг ничего не начисляет (D061).
 */

const GOAL_OPTIONS: ReadonlyArray<{ value: Goal; label: string }> = [
  { value: "weight_loss", label: "Снижение веса" },
  { value: "muscle_gain", label: "Наращивание мышечной массы" },
  { value: "endurance", label: "Улучшение выносливости" },
  { value: "general_fitness", label: "Общая физическая форма" },
  { value: "body_recomposition", label: "Рекомпозиция тела" },
];

const SEX_OPTIONS: ReadonlyArray<{ value: Sex; label: string }> = [
  { value: "male", label: "Герой" },
  { value: "female", label: "Героиня" },
];

const LEVEL_OPTIONS: ReadonlyArray<{ value: FitnessLevel; label: string }> = [
  { value: "beginner", label: "Только начинаю" },
  { value: "intermediate", label: "Тренируюсь менее года" },
  { value: "advanced", label: "Тренируюсь регулярно больше года" },
];

const FORMAT_OPTIONS: ReadonlyArray<{ value: TrainingFormat; label: string }> = [
  { value: "home", label: "Дома" },
  { value: "gym", label: "В зале" },
];

const STRUCTURE_OPTIONS: ReadonlyArray<{ value: TrainingStructure; label: string }> = [
  { value: "full_body", label: "Фулбоди" },
  { value: "split", label: "Сплит" },
];

const HELPER_LINE = "Информацию можно будет изменить позже в разделе «Профиль».";

export function OnboardingFlow({ initial }: { initial: OnboardingState }) {
  const router = useRouter();
  const [screen, setScreen] = useState<OnboardingScreen>(
    initial.screen === "done" ? "s4" : initial.screen,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // S1: тап по Seed Form — прямой переход к S2 (то же логическое
  // действие, что и «Продолжить»); реплика с CTA появляется только
  // после ~2.5с тишины. Уход с S1 чистит таймер (cleanup эффекта) —
  // «догнавший» тап-перед-срабатыванием безопасен, дублей перехода нет.
  const [s1Revealed, setS1Revealed] = useState(false);
  useEffect(() => {
    if (screen !== "s1" || s1Revealed) return;
    const t = setTimeout(() => setS1Revealed(true), 2500);
    return () => clearTimeout(t);
  }, [screen, s1Revealed]);

  // S2
  const [goals, setGoals] = useState<Goal[]>(initial.goals);
  const [sex, setSex] = useState<Sex | null>(initial.sex);

  // S3
  const [level, setLevel] = useState<FitnessLevel | null>(initial.fitnessLevel);
  const [format, setFormat] = useState<TrainingFormat | null>(initial.trainingFormat);
  const [frequency, setFrequency] = useState<WeeklyFrequency | null>(initial.weeklyFrequency);
  const [structure, setStructure] = useState<TrainingStructure | null>(initial.trainingStructure);

  // S4
  const [name, setName] = useState<string>(initial.avatarName ?? "");

  const structureEligible = isStructureEligible(format, level);
  const allowedFrequencies = level ? ALLOWED_FREQUENCIES[level] : [];

  const toggleGoal = (g: Goal) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  // Смена уровня/места чистит ставшие недопустимыми частоту и формат (D085).
  const pickLevel = (v: FitnessLevel) => {
    setLevel(v);
    if (frequency !== null && !ALLOWED_FREQUENCIES[v].includes(frequency)) setFrequency(null);
    if (!isStructureEligible(format, v)) setStructure(null);
  };
  const pickFormat = (v: TrainingFormat) => {
    setFormat(v);
    if (!isStructureEligible(v, level)) setStructure(null);
  };

  const submitS2 = () => {
    if (goals.length === 0 || !sex) return;
    setError(null);
    startTransition(async () => {
      const res = await saveOnboardingS2Action({ goals, sex });
      if (res.error) return setError(res.error);
      setScreen("s3");
    });
  };

  const s3Complete =
    level !== null &&
    format !== null &&
    frequency !== null &&
    (!structureEligible || structure !== null);

  const submitS3 = () => {
    if (!s3Complete || !level || !format || !frequency) return;
    setError(null);
    startTransition(async () => {
      const res = await saveOnboardingS3Action({
        fitnessLevel: level,
        trainingFormat: format,
        weeklyFrequency: frequency,
        trainingStructure: structureEligible ? structure : null,
      });
      if (res.error) return setError(res.error);
      setScreen("s4");
    });
  };

  const submitS4 = () => {
    if (name.trim().length === 0) return;
    setError(null);
    startTransition(async () => {
      const res = await completeOnboardingAction({ name });
      if (res.error) return setError(res.error);
      // D082: полный Home, без авто-перехода к тренировке и подсветки CTA.
      router.replace("/dashboard");
      router.refresh();
    });
  };

  return (
    <CinematicCanvas
      className="min-h-dvh"
      contentClassName="flex min-h-dvh flex-col items-center pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
    >
      {/* Presence — на каждом экране (D078). ТОЛЬКО на S1 Seed Form —
          прямое действие перехода к S2 (D079); на S2–S4 Presence неинтерактивен. */}
      {screen === "s1" ? (
        // Тап по Seed Form — прямой шаг вперёд к S2 (тот же переход, что
        // у «Продолжить»). Кнопка с УВЕЛИЧЕННОЙ зоной нажатия (p-6):
        // воспринимаемая форма больше узкого бокса фигуры из-за свечения —
        // тап по ореолу тоже засчитывается. Маршрут не меняется, данные
        // не пишутся — внутренний переход экрана онбординга.
        <button
          type="button"
          aria-label="Seed Form — перейти к следующему шагу"
          onClick={() => setScreen("s2")}
          className="relative z-[2] mt-2 shrink-0 cursor-pointer rounded-3xl p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50"
        >
          <PresenceFigure direction="neutral" size="md" alt="Seed Form" />
        </button>
      ) : (
        <div className="mt-2 shrink-0 p-6">
          <PresenceFigure
            direction={screen === "s4" ? directionFromSex(sex) : "neutral"}
            size={screen === "s2" || screen === "s3" ? "sm" : "md"}
            alt="Presence"
          />
        </div>
      )}

      <div className="mt-5 flex w-full max-w-[420px] flex-1 flex-col">
        {screen === "s1" ? (
          <div
            className={`flex flex-1 flex-col items-center justify-center text-center transition-opacity duration-500 ${
              s1Revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-lg leading-relaxed text-zinc-200 [font-family:var(--font-onest)]">
              Давай сделаем первый шаг.
              <br />
              Я помогу тебе начать.
            </p>
            <GameButton
              variant="primary"
              type="button"
              onClick={() => setScreen("s2")}
              disabled={!s1Revealed}
              className="mt-8 min-h-12 w-full max-w-[320px] text-base"
            >
              Продолжить
            </GameButton>
          </div>
        ) : null}

        {screen === "s2" ? (
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-zinc-300 [font-family:var(--font-onest)]">
              Сейчас выберем направление и подстроим тренировки под тебя.
              <br />
              Пара ответов — и я пойму, с чего нам начать.
            </p>

            <Question label="Какой результат тебе сейчас важен?">
              {GOAL_OPTIONS.map((o) => (
                <OptionPill
                  key={o.value}
                  label={o.label}
                  selected={goals.includes(o.value)}
                  onClick={() => toggleGoal(o.value)}
                />
              ))}
            </Question>

            <Question label="Герой или героиня — чью главу мы открываем?">
              {SEX_OPTIONS.map((o) => (
                <OptionPill
                  key={o.value}
                  label={o.label}
                  selected={sex === o.value}
                  onClick={() => setSex(o.value)}
                />
              ))}
            </Question>

            <Helper />
            <GameButton
              variant="primary"
              type="button"
              disabled={goals.length === 0 || !sex || isPending}
              onClick={submitS2}
              className="min-h-12 w-full text-base"
            >
              {isPending ? "Сохраняем…" : "Продолжить"}
            </GameButton>
          </div>
        ) : null}

        {screen === "s3" ? (
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-zinc-300 [font-family:var(--font-onest)]">
              Мне нужно понять, какая нагрузка подойдёт тебе сейчас.
              <br />И где ты будешь тренироваться.
            </p>

            <Question label="Какой уровень тебе ближе?">
              {LEVEL_OPTIONS.map((o) => (
                <OptionPill
                  key={o.value}
                  label={o.label}
                  selected={level === o.value}
                  onClick={() => pickLevel(o.value)}
                />
              ))}
            </Question>

            <Question label="Где будешь тренироваться?">
              {FORMAT_OPTIONS.map((o) => (
                <OptionPill
                  key={o.value}
                  label={o.label}
                  selected={format === o.value}
                  onClick={() => pickFormat(o.value)}
                />
              ))}
            </Question>

            {/* Частота — только после уровня и места; только допустимые
                опции (D085), недоступные не рендерятся вовсе. */}
            {level && format ? (
              <Question label="Сколько раз в неделю тебе удобно тренироваться?">
                {allowedFrequencies.map((f) => (
                  <OptionPill
                    key={f}
                    label={String(f)}
                    selected={frequency === f}
                    onClick={() => setFrequency(f)}
                  />
                ))}
              </Question>
            ) : null}

            {/* Фулбоди/Сплит — ТОЛЬКО Зал+не-новичок (D085). Остальным
                вопрос не существует: без disabled-карточек и заглушек. */}
            {structureEligible && level && format && frequency ? (
              <Question label="Какой формат тебе ближе?">
                {STRUCTURE_OPTIONS.map((o) => (
                  <OptionPill
                    key={o.value}
                    label={o.label}
                    selected={structure === o.value}
                    onClick={() => setStructure(o.value)}
                  />
                ))}
              </Question>
            ) : null}

            <Helper />
            <GameButton
              variant="primary"
              type="button"
              disabled={!s3Complete || isPending}
              onClick={submitS3}
              className="min-h-12 w-full text-base"
            >
              {isPending ? "Сохраняем…" : "Продолжить"}
            </GameButton>
          </div>
        ) : null}

        {screen === "s4" ? (
          <div className="flex flex-1 flex-col justify-center space-y-6 text-center">
            <p className="text-lg leading-relaxed text-zinc-200 [font-family:var(--font-onest)]">
              Путь выбран.
              <br />
              Осталось выбрать имя.
            </p>
            <div className="text-left">
              <label
                htmlFor="avatar-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 [font-family:var(--font-onest)]"
              >
                Имя
              </label>
              <input
                id="avatar-name"
                type="text"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-base text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-sky-400/50 [font-family:var(--font-onest)]"
                placeholder="Имя твоего спутника"
              />
            </div>
            {/* Наречение обязательно: без «Пропустить» (D078/D079). */}
            <GameButton
              variant="primary"
              type="button"
              disabled={name.trim().length === 0 || isPending}
              onClick={submitS4}
              className="min-h-12 w-full text-base"
            >
              {isPending ? "Сохраняем…" : "Продолжить"}
            </GameButton>
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="mt-4 text-center text-sm text-rose-300 [font-family:var(--font-onest)]">
            {error}
          </p>
        ) : null}
      </div>
    </CinematicCanvas>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-white [font-family:var(--font-onest)]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function OptionPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-2xl border px-4 py-2.5 text-sm transition-colors [font-family:var(--font-onest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 ${
        selected
          ? "border-sky-400/50 bg-sky-400/[0.1] text-white"
          : "border-white/12 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
      }`}
    >
      {label}
    </button>
  );
}

function Helper() {
  return (
    <p className="text-xs leading-relaxed text-zinc-600 [font-family:var(--font-onest)]">
      {HELPER_LINE}
    </p>
  );
}
