"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AVATAR_CATEGORIES,
  AVATAR_CATEGORY_LABELS,
  createAvatarDraft,
  describeResolvedAvatar,
  getAvatarOptions,
  resetAvatarDraftDirection,
  resolveAvatar,
  resolveAvatarSlot,
  setAvatarDraftOption,
  switchAvatarDraftDirection,
  type AvatarCategory,
  type AvatarDirection,
} from "@/lib/avatar";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameButton } from "../ui/game-button";
import { AvatarRenderer } from "./avatar-renderer";
import { useAvatarState } from "./avatar-provider";

export function AvatarEditor({ stage }: { stage: number }) {
  const router = useRouter();
  const { savedConfig, isHydrated, saveConfig } = useAvatarState();
  const [draft, setDraft] = useState(() => createAvatarDraft(savedConfig));
  const [category, setCategory] = useState<AvatarCategory>("face");
  const initialized = useRef(false);

  useEffect(() => {
    if (isHydrated && !initialized.current) {
      setDraft(createAvatarDraft(savedConfig));
      initialized.current = true;
    }
  }, [isHydrated, savedConfig]);

  const direction = draft.activeDirection;
  const slot = resolveAvatarSlot(draft);
  const resolved = resolveAvatar(draft, stage);
  const options = getAvatarOptions(direction, category);

  function selectDirection(nextDirection: AvatarDirection) {
    setDraft((current) => switchAvatarDraftDirection(current, nextDirection));
  }

  function selectOption(optionId: string) {
    setDraft((current) =>
      setAvatarDraftOption(current, current.activeDirection, category, optionId),
    );
  }

  function save() {
    saveConfig(draft);
    router.push("/dashboard");
  }

  function cancel() {
    router.push("/dashboard");
  }

  return (
    <CinematicCanvas
      className="min-h-dvh"
      contentClassName="min-h-dvh pb-32"
    >
      <header className="sticky top-0 z-20 -mx-5 border-b border-white/[0.06] bg-black/80 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="grid min-h-11 grid-cols-[minmax(4.5rem,1fr)_auto_minmax(4.5rem,1fr)] items-center gap-2">
          <button
            type="button"
            onClick={cancel}
            className="min-h-11 justify-self-start rounded-xl px-2 text-sm font-semibold text-zinc-300 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500/50"
          >
            Отмена
          </button>
          <h1 className="text-center text-sm font-bold text-white [font-family:var(--font-unbounded)] sm:text-base">
            Настройка аватара
          </h1>
          <button
            type="button"
            onClick={save}
            disabled={!isHydrated}
            className="min-h-11 justify-self-end rounded-xl px-2 text-sm font-semibold text-sky-300 hover:bg-sky-400/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 disabled:opacity-45"
          >
            Сохранить
          </button>
        </div>
      </header>

      <main aria-busy={!isHydrated}>
        <div
          className="mt-4 grid grid-cols-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1"
          role="group"
          aria-label="Направление аватара"
        >
          {(["hero", "heroine"] as const).map((item) => {
            const selected = direction === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => selectDirection(item)}
                disabled={!isHydrated}
                className={`min-h-11 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 ${
                  selected
                    ? "border border-sky-300/30 bg-sky-300/[0.1] text-sky-100"
                    : "border border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {item === "hero" ? "Герой" : "Героиня"}
              </button>
            );
          })}
        </div>

        <section className="relative mt-4 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[radial-gradient(90%_65%_at_50%_35%,rgba(56,189,248,0.12),transparent_65%),linear-gradient(180deg,rgba(24,31,40,0.92),rgba(5,8,13,0.98))] px-3 pt-4 shadow-[0_24px_70px_-38px_rgba(56,189,248,0.45)]">
          <div aria-hidden className="absolute inset-x-[10%] bottom-7 h-px bg-gradient-to-r from-transparent via-sky-200/25 to-transparent" />
          <AvatarRenderer
            config={resolved}
            presentation="editor"
            motion="editor"
            label={`Предпросмотр: ${describeResolvedAvatar(resolved)}`}
          />
          <p className="pb-4 text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
            Стадия {resolved.stage} · тестовый образ
          </p>
        </section>

        <nav
          className="hide-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2"
          aria-label="Категории настройки"
        >
          {AVATAR_CATEGORIES.map((item) => {
            const selected = category === item;
            return (
              <button
                key={item}
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => setCategory(item)}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 ${
                  selected
                    ? "border-sky-300/40 bg-sky-300/[0.12] text-sky-100"
                    : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                {AVATAR_CATEGORY_LABELS[item]}
              </button>
            );
          })}
        </nav>

        <section className="mt-2" aria-labelledby="avatar-options-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="avatar-options-title" className="text-sm font-semibold text-white">
              {AVATAR_CATEGORY_LABELS[category]}
            </h2>
            <span className="text-xs text-zinc-500">
              {category === "accessories" ? "Можно выбрать несколько" : "Выберите вариант"}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {options.map((option) => {
              const selected = isSelected(category, option.id, slot);
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectOption(option.id)}
                  disabled={!isHydrated}
                  className={`relative flex min-h-[4.25rem] items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 disabled:opacity-45 ${
                    selected
                      ? "border-sky-300/45 bg-sky-300/[0.1] text-white"
                      : "border-white/[0.08] bg-white/[0.035] text-zinc-300 hover:border-white/[0.16]"
                  }`}
                >
                  {option.swatch ? (
                    <span
                      aria-hidden
                      className="h-7 w-7 shrink-0 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: option.swatch }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs text-zinc-400"
                    >
                      {selected ? "✓" : "◇"}
                    </span>
                  )}
                  <span className="leading-tight">{option.label}</span>
                  {selected ? <span className="sr-only">Выбрано</span> : null}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <GameButton
            variant="secondary"
            className="min-h-12"
            onClick={() =>
              setDraft((current) =>
                resetAvatarDraftDirection(current, current.activeDirection),
              )
            }
            disabled={!isHydrated}
          >
            Сбросить
          </GameButton>
          <GameButton className="min-h-12" onClick={save} disabled={!isHydrated}>
            Сохранить
          </GameButton>
        </div>
        <GameButton
          variant="ghost"
          className="mt-2 min-h-11 w-full"
          onClick={cancel}
        >
          Отмена
        </GameButton>
      </main>
    </CinematicCanvas>
  );
}

function isSelected(
  category: AvatarCategory,
  optionId: string,
  slot: ReturnType<typeof resolveAvatarSlot>,
): boolean {
  switch (category) {
    case "face":
      return slot.faceId === optionId;
    case "eyes":
      return slot.eyeId === optionId;
    case "brows":
      return slot.browId === optionId;
    case "mouth":
      return slot.mouthId === optionId;
    case "hair":
      return slot.hairId === optionId;
    case "hairColor":
      return slot.hairColorId === optionId;
    case "skinTone":
      return slot.skinToneId === optionId;
    case "outfit":
      return slot.outfitId === optionId;
    case "accessories":
      return slot.accessoryIds.includes(optionId);
  }
}
