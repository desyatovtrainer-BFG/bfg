"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut } from "@/lib/auth/actions";
import { AppModal } from "../ui/app-modal";
import { GameButton } from "../ui/game-button";

/**
 * ProfileLogout — отдельное нижнее действие «Выйти» (D086).
 *
 * Немедленного выхода нет: сначала спокойный модал подтверждения
 * (принятая копия D086 — без страха, без потери прогресса). Один
 * контейнер, без стека модалов, без тостов; ошибка — inline в модале.
 *
 * Использует существующий server action `signOut` (lib/auth/actions) —
 * auth-логика не меняется. После выхода — на неавторизованный вход `/`.
 */
export function ProfileLogout() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const confirmLogout = () => {
    setError(null);
    startTransition(async () => {
      const res = await signOut();
      if (res.error) {
        setError(res.error);
        return;
      }
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <>
      <GameButton
        variant="secondary"
        className="min-h-12 w-full border-rose-400/25 text-rose-200 hover:bg-rose-400/[0.08]"
        onClick={() => setOpen(true)}
      >
        Выйти
      </GameButton>

      <AppModal
        open={open}
        onClose={() => (pending ? undefined : setOpen(false))}
        title="Выйти из аккаунта?"
        dismissible={!pending}
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-300 [font-family:var(--font-onest)]">
            Твой прогресс сохранится.
            <br />
            Ты сможешь вернуться, войдя снова.
          </p>

          {error ? (
            <p className="text-sm text-rose-300 [font-family:var(--font-onest)]">{error}</p>
          ) : null}

          <div className="space-y-2.5">
            <GameButton
              variant="secondary"
              className="min-h-12 w-full border-rose-400/25 text-rose-200 hover:bg-rose-400/[0.08]"
              onClick={confirmLogout}
              disabled={pending}
            >
              {pending ? "Выходим…" : "Выйти"}
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
