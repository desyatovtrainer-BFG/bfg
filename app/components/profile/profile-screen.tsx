import {
  FITNESS_LEVEL_LABELS,
  SEX_DIRECTION_LABELS,
  TRAINING_FORMAT_LABELS,
  TRAINING_STRUCTURE_LABELS,
  WEEKLY_FREQUENCY_LABELS,
  type FitnessLevel,
  type Goal,
  type Sex,
  type TrainingFormat,
  type TrainingStructure,
  type WeeklyFrequency,
} from "@/lib/onboarding";
import type { SubscriptionState } from "@/lib/subscription";
import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameCard } from "../ui/game-card";
import { ScreenHeader } from "../ui/screen-header";
import { ProfileGoalRow } from "./profile-goal-row";
import { ProfileLogout } from "./profile-logout";
import { ProfileNameRow } from "./profile-name-row";

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
 * Слайс 16 — безопасное редактирование (D080/D084 частично): редактируемы
 * ТОЛЬКО «Цель» и «Имя» (chevron + один модал на правку, single-modal
 * flow D086). Program-changing поля (Уровень/Место/Частота/Формат/
 * Направление) — read-only без chevron и обработчиков до слайса
 * Program Assignment. Null-поля легаси-аккаунтов показывают «Не указано»
 * и никого не возвращают в онбординг; «Формат тренировок» может
 * отображать эффективный «Фулбоди» по правилам D085 — display-only,
 * в БД ничего не пишется.
 */

export type ProfileScreenProps = {
  email: string | null;
  subscription: SubscriptionState;
  goals: Goal[];
  fitnessLevel: FitnessLevel | null;
  trainingFormat: TrainingFormat | null;
  weeklyFrequency: WeeklyFrequency | null;
  trainingStructure: TrainingStructure | null;
  /** Глобальное имя аватара (D083); null → «Не указано». */
  avatarName: string | null;
  /** Герой/Героиня; null → «Не указано» (легаси без онбординга). */
  sex: Sex | null;
  /** Куда ведёт «Назад» — санитизированный источник (экран, открывший Профиль). */
  backHref?: string;
};

export function ProfileScreen({
  email,
  subscription,
  goals,
  fitnessLevel,
  trainingFormat,
  weeklyFrequency,
  trainingStructure,
  avatarName,
  sex,
  backHref = "/dashboard",
}: ProfileScreenProps) {
  const levelValue = fitnessLevel ? FITNESS_LEVEL_LABELS[fitnessLevel] : null;
  const formatValue = trainingFormat ? TRAINING_FORMAT_LABELS[trainingFormat] : null;
  const frequencyValue = weeklyFrequency ? WEEKLY_FREQUENCY_LABELS[weeklyFrequency] : null;
  const structureValue = displayedTrainingStructure(
    trainingStructure,
    trainingFormat,
    fitnessLevel,
    weeklyFrequency,
  );
  const directionValue = sex ? SEX_DIRECTION_LABELS[sex] : null;

  return (
    <CinematicCanvas className="min-h-dvh" contentClassName="flex min-h-dvh flex-col pb-28">
      <ScreenHeader
        title="Профиль"
        subtitle="Данные, которые помогают подобрать тренировки и сохранить твой путь."
        backHref={backHref}
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
          {/* Цель — единственное редактируемое поле секции (D084 safe). */}
          <ProfileGoalRow goals={goals} />
          {/* Program-changing поля — read-only до слайса Program
              Assignment: без chevron, без модала, без tap-действия. */}
          <Row label="Уровень" value={levelValue ?? "Не указано"} muted={!levelValue} />
          <Row label="Место тренировок" value={formatValue ?? "Не указано"} muted={!formatValue} />
          <Row
            label="Тренировок в неделю"
            value={frequencyValue ?? "Не указано"}
            muted={!frequencyValue}
          />
          <Row
            label="Формат тренировок"
            value={structureValue ?? "Не указано"}
            muted={!structureValue}
            last
          />
        </GameCard>
      </Section>

      {/* ── Аватар ──────────────────────────────────────────────── */}
      <Section title="Аватар">
        <GameCard className="px-5">
          {/* Имя — редактируемое (D084 safe, глобальное — D083). */}
          <ProfileNameRow name={avatarName} />
          <Row label="Направление" value={directionValue ?? "Не указано"} muted={!directionValue} last />
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

/**
 * Display-only правило эффективного Фулбоди (D085): при null-значении
 * структура показывается как «Фулбоди», только если это доказуемо по
 * принятым правилам авторазрешения (Дом / новичок / 2 дня). В БД при
 * этом НИЧЕГО не пишется; иначе честное «Не указано» (null).
 */
function displayedTrainingStructure(
  structure: TrainingStructure | null,
  format: TrainingFormat | null,
  level: FitnessLevel | null,
  frequency: WeeklyFrequency | null,
): string | null {
  if (structure) return TRAINING_STRUCTURE_LABELS[structure];
  if (format === "home" || level === "beginner" || frequency === 2) {
    return TRAINING_STRUCTURE_LABELS.full_body;
  }
  return null;
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
 * Read-only строка Профиля: без chevron, без модала, без tap-действия
 * и без «disabled»-вида (D086). Редактируемые строки — отдельные
 * клиентские листья (ProfileGoalRow, ProfileNameRow).
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
