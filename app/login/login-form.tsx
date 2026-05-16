"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signInWithPassword } from "@/lib/auth/actions";
import { AuthInput } from "../components/auth/auth-input";
import { GameButton } from "../components/ui/game-button";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await signInWithPassword(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthInput
        label="Почта"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder="you@bfg.app"
      />
      <AuthInput
        label="Пароль"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 [font-family:var(--font-onest)]"
        >
          {error}
        </p>
      ) : null}

      <GameButton
        type="submit"
        variant="primary"
        disabled={pending}
        className="h-12 w-full text-base"
      >
        {pending ? "Входим…" : "Войти"}
      </GameButton>
    </form>
  );
}
