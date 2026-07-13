"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AVATAR_NAME_MAX_LENGTH } from "@/lib/onboarding";
import { updateAvatarNameAction } from "@/lib/profile";
import { AppModal } from "../ui/app-modal";
import { GameButton } from "../ui/game-button";
import { ProfileEditableRow } from "./profile-editable-row";

/**
 * ProfileNameRow — строка «Имя» аватара с единственным модалом
 * редактирования (D086 single-modal flow). Безопасное поле D084:
 * глобальное имя (D083), сохраняется сразу без подтверждения; не
 * влияет на назначение, прогрессию, направление и визуальные слоты.
 * Успех — спокойная inline-строка, без тостов и редиректов.
 */
export function ProfileNameRow({ name }: { name: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const openModal = () => {
    setDraft(name ?? "");
    setError(null);
    setOpen(true);
  };

  const save = () => {
    if (draft.trim().length === 0 || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await updateAvatarNameAction({ name: draft });
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
        label="Имя"
        value={name?.trim() || "Не указано"}
        muted={!name?.trim()}
        saved={saved}
        onClick={openModal}
      />

      <AppModal
        open={open}
        onClose={() => (pending ? undefined : setOpen(false))}
        title="Имя"
        variant="sheet"
        dismissible={!pending}
      >
        <div className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="profile-avatar-name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 [font-family:var(--font-onest)]"
            >
              Имя
            </label>
            <input
              id="profile-avatar-name"
              type="text"
              value={draft}
              maxLength={AVATAR_NAME_MAX_LENGTH}
              disabled={pending}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-base text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-sky-400/50 [font-family:var(--font-onest)]"
              placeholder="Имя твоего спутника"
            />
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
              disabled={draft.trim().length === 0 || pending}
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
