"use client";

/**
 * DEV PREVIEW — НЕ продуктовый экран.
 *
 * Временная страница визуальной проверки примитивов Slice 1:
 * AppModal · OpenRing · ScreenHeader · PlaceholderScreen · PresenceFigure ·
 * CinematicCanvas. Не привязана к навигации, не требует авторизации,
 * не трогает Supabase. Удаляется после приёмки rebuild-слайсов.
 *
 * Открыть локально: npm run dev → http://localhost:3000/ui-primitives-preview
 * Проверять на ширине 360px (DevTools → device toolbar). Ниже каждая
 * полноэкранная секция дополнительно отрисована во фрейме 360px.
 */

import { useState } from "react";
import { AppModal } from "@/app/components/ui/app-modal";
import { CinematicCanvas } from "@/app/components/ui/cinematic-canvas";
import { GameButton } from "@/app/components/ui/game-button";
import { OpenRing } from "@/app/components/ui/open-ring";
import { PlaceholderScreen } from "@/app/components/ui/placeholder-screen";
import { PresenceFigure } from "@/app/components/ui/presence-figure";
import { ScreenHeader } from "@/app/components/ui/screen-header";

export default function UiPrimitivesPreviewPage() {
  const [centerOpen, setCenterOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  /** Демонстрация D086: selection → confirmation внутри ОДНОГО контейнера. */
  const [sheetStep, setSheetStep] = useState<"selection" | "confirmation">("selection");
  const [levelProgress, setLevelProgress] = useState(0.55);
  const [weeklyProgress, setWeeklyProgress] = useState(0.5);

  const closeSheet = () => {
    setSheetOpen(false);
    setSheetStep("selection");
  };

  return (
    <div className="min-h-dvh bg-black pb-24 text-zinc-100">
      <div className="mx-auto w-full max-w-[430px] px-5 pt-6">
        <p className="rounded-xl border border-amber-400/25 bg-amber-400/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-200/90 [font-family:var(--font-onest)]">
          DEV PREVIEW · Slice 1 · не продуктовый экран. Проверять на 360px.
        </p>

        {/* ── ScreenHeader ─────────────────────────────────────────── */}
        <SectionTitle>ScreenHeader</SectionTitle>
        <div className="space-y-6 rounded-2xl border border-white/[0.06] p-4">
          <ScreenHeader
            title="Профиль"
            subtitle="Данные, которые помогают подобрать тренировки и сохранить твой путь."
            backHref="/ui-primitives-preview"
            profileSlot={<HeaderSlotButton />}
          />
          <ScreenHeader title="Прогресс" profileSlot={<HeaderSlotButton />} />
          <ScreenHeader title="Home (заголовок скрыт)" titleHidden profileSlot={<HeaderSlotButton />} />
        </div>

        {/* ── OpenRing ─────────────────────────────────────────────── */}
        <SectionTitle>OpenRing (D071 — открытые дуги)</SectionTitle>
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/[0.06] p-4">
          {/* Вложение: внешнее кольцо (weekly, sky) вокруг внутреннего (level, amber). */}
          <OpenRing
            progress={weeklyProgress}
            label="12/24 АКТ."
            accent="sky"
            size={240}
            thickness={5}
          >
            <OpenRing progress={levelProgress} label="12 УР." accent="amber" size={170} thickness={6}>
              <PresenceFigure size="sm" direction="neutral" />
            </OpenRing>
          </OpenRing>
          <div className="flex gap-3">
            <GameButton
              variant="secondary"
              className="min-h-11 px-4 text-sm"
              onClick={() => {
                setLevelProgress(Math.random());
                setWeeklyProgress(Math.random());
              }}
            >
              Случайный прогресс
            </GameButton>
            <GameButton
              variant="ghost"
              className="min-h-11 px-4 text-sm"
              onClick={() => {
                setLevelProgress(0);
                setWeeklyProgress(1);
              }}
            >
              0 / 100%
            </GameButton>
          </div>
        </div>

        {/* ── PresenceFigure ──────────────────────────────────────── */}
        <SectionTitle>PresenceFigure (временные ассеты · fallback-силуэт)</SectionTitle>
        <div className="rounded-2xl border border-white/[0.06] p-4">
          <div className="flex items-end justify-around">
            <figure className="text-center">
              <PresenceFigure direction="neutral" size="sm" />
              <figcaption className="mt-2 text-[11px] text-zinc-500">neutral</figcaption>
            </figure>
            <figure className="text-center">
              <PresenceFigure direction="hero" size="md" />
              <figcaption className="mt-2 text-[11px] text-zinc-500">hero → fallback</figcaption>
            </figure>
            <figure className="text-center">
              <PresenceFigure direction="heroine" size="sm" animated={false} />
              <figcaption className="mt-2 text-[11px] text-zinc-500">heroine · static</figcaption>
            </figure>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Картинки ещё не добавлены в public/avatars/ — все направления рендерят
            встроенный нейтральный силуэт. Пути прописываются в PRESENCE_ASSETS.
          </p>
        </div>

        {/* ── AppModal ─────────────────────────────────────────────── */}
        <SectionTitle>AppModal (center · sheet, D086 одно-модальный поток)</SectionTitle>
        <div className="flex gap-3 rounded-2xl border border-white/[0.06] p-4">
          <GameButton className="min-h-11 flex-1 text-sm" onClick={() => setCenterOpen(true)}>
            Центр (Reward-стиль)
          </GameButton>
          <GameButton
            variant="secondary"
            className="min-h-11 flex-1 text-sm"
            onClick={() => setSheetOpen(true)}
          >
            Bottom-sheet (2 шага)
          </GameButton>
        </div>

        {/* ── PlaceholderScreen во фреймах 360px ──────────────────── */}
        <SectionTitle>PlaceholderScreen — фрейм 360px</SectionTitle>
        <div className="space-y-6">
          <Frame360>
            <PlaceholderScreen
              fillViewport={false}
              title="Питание"
              lines={[
                "Этот раздел появится позже.",
                "Сейчас путь строится вокруг тренировок и прогресса.",
              ]}
            />
          </Frame360>
          <Frame360>
            <PlaceholderScreen
              fillViewport={false}
              title="Внешний вид"
              lines={["Кастомизация появится позже.", "Сейчас важно сохранить путь и увидеть форму BFG."]}
              figure={<PresenceFigure size="md" direction="neutral" />}
              header={<ScreenHeader title="Внешний вид" titleHidden backHref="/ui-primitives-preview" />}
            />
          </Frame360>
        </div>

        {/* ── CinematicCanvas ─────────────────────────────────────── */}
        <SectionTitle>CinematicCanvas (D075)</SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <CinematicCanvas className="min-h-[220px]" contentClassName="flex min-h-[220px] items-center">
            <p className="text-sm leading-relaxed text-zinc-300">
              Атмосфера расширяется на всю ширину, этот текст остаётся в колонке
              ≤ 430px. На широких экранах — то же самое, без дашборда.
            </p>
          </CinematicCanvas>
        </div>
      </div>

      {/* Center modal — стиль будущего Reward Modal (D067): без крестика,
          закрытие кнопкой контента. dismissible оставлен true для удобства превью. */}
      <AppModal
        open={centerOpen}
        onClose={() => setCenterOpen(false)}
        ariaLabel="Демо центрального модала"
      >
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Демо</p>
          <p className="text-3xl font-bold text-white [font-family:var(--font-unbounded)]">
            Уровень 7
          </p>
          <p className="text-sm text-zinc-400">+ 10 XP</p>
          <GameButton className="min-h-12 w-full" onClick={() => setCenterOpen(false)}>
            Вернуться
          </GameButton>
        </div>
      </AppModal>

      {/* Sheet modal — демонстрация D084/D086: selection → confirmation
          как СОСТОЯНИЯ одного контейнера, без второго модала. */}
      <AppModal
        open={sheetOpen}
        onClose={closeSheet}
        variant="sheet"
        title={sheetStep === "selection" ? "Место тренировок" : "Подтверждение"}
      >
        {sheetStep === "selection" ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSheetStep("confirmation")}
              className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-zinc-100 transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
            >
              Дома
            </button>
            <button
              type="button"
              onClick={() => setSheetStep("confirmation")}
              className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-sky-400/40 bg-white/[0.06] px-4 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
            >
              В зале
            </button>
            <GameButton variant="ghost" className="min-h-11 w-full text-sm" onClick={closeSheet}>
              Отмена
            </GameButton>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-zinc-300">
              Тренировки могут измениться.
              <br />
              Прогресс, уровень, история и аватар сохранятся.
            </p>
            <div className="space-y-2.5">
              <GameButton className="min-h-12 w-full" onClick={closeSheet}>
                Сохранить изменения
              </GameButton>
              <GameButton
                variant="ghost"
                className="min-h-11 w-full text-sm"
                onClick={() => setSheetStep("selection")}
              >
                Назад
              </GameButton>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
      {children}
    </h2>
  );
}

/** Демо-содержимое слота кнопки Профиля (D006) — сам примитив слот не заполняет. */
function HeaderSlotButton() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-300">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/** Фрейм телефонной ширины для проверки структуры на 360px даже на десктопе. */
function Frame360({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[360px] max-w-full overflow-hidden rounded-3xl border border-white/10">
      {children}
    </div>
  );
}
