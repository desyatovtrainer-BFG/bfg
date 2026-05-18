import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentSubscription } from "@/lib/subscription";
import type { SubscriptionState } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Профиль — BFG",
};

export default async function ProfilePage() {
  const subscription = await getCurrentSubscription();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 pb-28 pt-12 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600 [font-family:var(--font-onest)]">
        Big Fitness Game
      </p>
      <h1 className="mt-3 text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
        Профиль
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
        Настройки аккаунта и персонализация — в разработке.
      </p>

      <SubscriptionCard state={subscription} />

      <Link
        href="/dashboard"
        className="mt-10 text-sm font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
      >
        ← На главную
      </Link>
    </div>
  );
}

/**
 * Минимальный блок «Подписка». Без редизайна — повторяем тональность
 * остального экрана: тонкая рамка, приглушённый фон, спокойная типографика.
 * UI намеренно простой: продукт ещё не показывает пейволлы, нам важно лишь
 * прозрачно сообщать состояние триала.
 */
function SubscriptionCard({ state }: { state: SubscriptionState }) {
  const label = STATUS_LABEL[state.status];
  const accent = STATUS_ACCENT[state.status];

  return (
    <section className="mt-8 w-full max-w-sm rounded-2xl border border-zinc-800/80 bg-zinc-950/60 px-5 py-4 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 [font-family:var(--font-onest)]">
          Подписка
        </span>
        <span
          className={`text-xs font-semibold [font-family:var(--font-onest)] ${accent}`}
        >
          {label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400 [font-family:var(--font-onest)]">
        {describe(state)}
      </p>
    </section>
  );
}

const STATUS_LABEL: Record<SubscriptionState["status"], string> = {
  free_trial: "Пробный период",
  active: "Активна",
  expired: "Истекла",
};

const STATUS_ACCENT: Record<SubscriptionState["status"], string> = {
  free_trial: "text-sky-400",
  active: "text-emerald-400",
  expired: "text-zinc-500",
};

function describe(state: SubscriptionState): string {
  if (state.status === "free_trial") {
    return `Полный доступ ко всем функциям. Осталось ${formatDays(state.trialDaysLeft)} пробного периода.`;
  }
  if (state.status === "active") {
    return state.subscriptionExpiresAt
      ? `Полный доступ ко всем функциям. Действует до ${formatDate(state.subscriptionExpiresAt)}.`
      : "Полный доступ ко всем функциям.";
  }
  return "Пробный период завершён. Оплата подписки появится позже — спасибо, что с нами.";
}

function formatDays(n: number): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return `${n} дней`;
  if (last === 1) return `${n} день`;
  if (last >= 2 && last <= 4) return `${n} дня`;
  return `${n} дней`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
