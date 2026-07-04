import type { SubscriptionState } from "@/lib/subscription";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameCard } from "../ui/game-card";
import { ScreenHeader } from "../ui/screen-header";
import { ProfileLogout } from "./profile-logout";

/**
 * ProfileScreen — административная поверхность «Профиль» (D086).
 *
 * Структура сверху вниз (wireframes §10):
 *   Шапка (Назад · «Профиль» · подзаголовок)
 *   → Аккаунт (Почта — read-only)
 *   → Тренировки (Цель · Уровень · Место · Тренировок в неделю · Формат)
 *   → Аватар (Имя · Направление)
 *   → Подписка (read-only, без пейволла)
 *   → «Выйти» (отдельное нижнее действие с модалом подтверждения).
 *
 * Профиль — НЕ эмоциональный центр (Home), НЕ архив (Прогресс) и НЕ
 * настройки приложения: никаких XP/уровня/стадии/серии, никакого входа
 * в кастомизацию (только с Home, D073), никаких тем/языков/уведомлений,
 * никакого удаления аккаунта / смены почты / пароля (D086).
 *
 * Слайс 5A — визуальная структура: поля онбординга (D079/D080) ещё не
 * существуют в схеме, поэтому строки Тренировок/Аватара read-only со
 * спокойными плейсхолдерами; chevron нет ни у одной строки (D086 —
 * read-only строки без chevron, без «выключенного» вида). Редактирование
 * по D084 подключается после слайса Онбординга.
 */

export type ProfileScreenProps = {
  email: string | null;
  subscription: SubscriptionState;
  /** Имя аватара; null → «Твой спутник» (наречение — S4 онбординга). */
  avatarName: string | null;
  /** Направление; null → временный «Герой» (зеркалит Home, до D079). */
  directionLabel: string | null;
};

export function ProfileScreen({
  email,
  subscription,
  avatarName,
  directionLabel,
}: ProfileScreenProps) {
  return (
    <CinematicCanvas className="min-h-dvh" contentClassName="flex min-h-dvh flex-col pb-28">
      <ScreenHeader
        title="Профиль"
        subtitle="Данные, которые помогают подобрать тренировки и сохранить твой путь."
        backHref="/dashboard"
      />

      {/* ── Аккаунт ─────────────────────────────────────────────── */}
      <Section title="Аккаунт">
        <GameCard className="px-5">
          <Row label="Почта" value={email ?? "—"} />
        </GameCard>
      </Section>

      {/* ── Тренировки ──────────────────────────────────────────── */}
      <Section title="Тренировки">
        <GameCard className="px-5">
          <Row label="Цель" value="Не выбрано" muted />
          <Row label="Уровень" value="Не выбрано" muted />
          <Row label="Место тренировок" value="Не выбрано" muted />
          <Row label="Тренировок в неделю" value="Не выбрано" muted />
          {/* Формат тренировок: строка всегда видима (D086); редактирование
              появится только для допустимых сочетаний Зал+не-новичок (D085). */}
          <Row label="Формат тренировок" value="Фулбоди" muted last />
        </GameCard>
        <p className="mt-2 px-1 text-xs text-zinc-600 [font-family:var(--font-onest)]">
          Эти данные появятся после онбординга.
        </p>
      </Section>

      {/* ── Аватар ──────────────────────────────────────────────── */}
      <Section title="Аватар">
        <GameCard className="px-5">
          <Row label="Имя" value={avatarName?.trim() || "Твой спутник"} />
          <Row label="Направление" value={directionLabel?.trim() || "Герой"} last />
        </GameCard>
        {/* Кастомизация из Профиля не открывается — вход только
            с Home Living Presence (D073/D086). Ссылок на /appearance нет. */}
      </Section>

      {/* ── Подписка ────────────────────────────────────────────── */}
      <Section title="Подписка">
        <GameCard glow="gold" className="px-5 py-4">
          <p className="text-sm font-semibold text-white [font-family:var(--font-onest)]">
            {subscriptionTitle(subscription)}
          </p>
          <p className="mt-1 text-sm text-zinc-400 [font-family:var(--font-onest)]">
            {subscriptionNote(subscription)}
          </p>
        </GameCard>
      </Section>

      {/* ── Выйти — отдельное нижнее действие (D086) ────────────── */}
      <div className="mt-10">
        <ProfileLogout />
      </div>
    </CinematicCanvas>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 [font-family:var(--font-onest)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Строка Профиля. В этом слайсе все строки read-only: без chevron,
 * без модала, без tap-действия и без «disabled»-вида (D086).
 */
function Row({
  label,
  value,
  muted = false,
  last = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[3.25rem] items-center justify-between gap-4 py-3 ${
        last ? "" : "border-b border-white/[0.06]"
      }`}
    >
      <span className="text-sm text-zinc-300 [font-family:var(--font-onest)]">{label}</span>
      <span
        className={`text-right text-sm [font-family:var(--font-onest)] ${
          muted ? "text-zinc-500" : "text-zinc-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function subscriptionTitle(s: SubscriptionState): string {
  if (s.status === "free_trial") return "Пробный период активен";
  if (s.status === "active") return "Подписка активна";
  return "Пробный период завершён";
}

function subscriptionNote(s: SubscriptionState): string {
  if (s.status === "free_trial") return `Осталось ${formatDays(s.trialDaysLeft)}`;
  if (s.status === "active") return "Полный доступ ко всем разделам.";
  // Без страха и пейволла: прогресс никогда не теряется (D030).
  return "Прогресс сохранён";
}

function formatDays(n: number): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return `${n} дней`;
  if (last === 1) return `${n} день`;
  if (last >= 2 && last <= 4) return `${n} дня`;
  return `${n} дней`;
}
