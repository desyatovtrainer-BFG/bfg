import Link from "next/link";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameButton } from "../ui/game-button";
import { PresenceFigure } from "../ui/presence-figure";

/**
 * EntryScreen — принятый Entry / Auth Start (D074, wireframes §0, UI §21).
 *
 * Первый неавторизованный контакт: спокойный, тёмный, киношный — не сырая
 * форма логина и не маркетинговый лендинг. Композиция сверху вниз:
 * минимальный бренд-знак → Seed Form в оптическом центре → спокойный
 * заголовок (+ одна строка подзаголовка) → ЕДИНСТВЕННЫЙ primary CTA
 * (→ регистрация) → тихая ссылка «Войти».
 *
 * Seed Form: нейтральная НЕфинальная пре-форма Presence (никогда не
 * Stage 10 и не дефолтный аватар — D010/D074), живая минимально
 * (дыхание/свечение), Voice-молчит. Декоративная тап-реакция D074 —
 * отложенная деталь (тап сейчас ничего не делает — навигационным
 * аффордансом Seed Form не является, что D074 и требует).
 *
 * Правила: БЕЗ СКРОЛЛА на 360–430px (весь экран в вьюпорте, §21);
 * никакого триала/цен/маркетинга/«побед»/КАПСА/эмодзи; вся копия —
 * placeholder по принципам D074 (финальная копия не утверждена).
 */
export function EntryScreen() {
  return (
    <CinematicCanvas
      className="h-dvh overflow-hidden"
      contentClassName="flex h-dvh flex-col items-center pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
    >
      {/* Минимальный бренд-знак. */}
      <p className="shrink-0 text-lg font-extrabold tracking-[0.24em] text-zinc-100 [font-family:var(--font-unbounded)]">
        BFG
      </p>

      {/* Seed Form — оптический центр, primary visual accent. */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6">
        <PresenceFigure direction="neutral" size="md" alt="Seed Form — начало Presence" />

        <div className="max-w-[19rem] text-center">
          <h1 className="text-2xl font-bold leading-snug text-white [font-family:var(--font-unbounded)]">
            Твой путь начинается
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
            Тренировки, прогресс и возвращение к себе — без давления.
          </p>
        </div>
      </div>

      {/* Единственный primary CTA → регистрация; тихий вход для своих. */}
      <div className="w-full max-w-[420px] shrink-0 space-y-3">
        <GameButton href="/signup" variant="primary" className="min-h-[3.25rem] w-full py-3.5 text-base">
          Начать
        </GameButton>
        <p className="text-center">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200 [font-family:var(--font-onest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500/40"
          >
            Войти
          </Link>
        </p>
      </div>
    </CinematicCanvas>
  );
}
