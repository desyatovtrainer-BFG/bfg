import { CinematicCanvas } from "../ui/cinematic-canvas";
import { GameCard } from "../ui/game-card";
import { PresenceFigure, type PresenceDirection } from "../ui/presence-figure";
import { ProfileHeaderButton } from "../ui/profile-header-button";
import { ScreenHeader } from "../ui/screen-header";

/**
 * ProgressScreen — визуальная оболочка принятого Прогресса (D072,
 * финализирует D008/D005). Ретроспектива: «кем я стал, как развиваюсь,
 * что накопилось». Home — живое настоящее; Прогресс — спокойный архив.
 *
 * Композиция сверху вниз (wireframes §9):
 *   Минимальная шапка (заголовок + кнопка Профиля, D006)
 *   → ПЕРВИЧНЫЙ блок идентичности: СТАТИЧНЫЙ портрет (не дышит, не
 *     кликается, НЕ открывает кастомизацию — вход только с Home, D073),
 *     стадия как позиция пути («Стадия N из 10»), слот Легенды
 *     с плейсхолдером «Путь ещё формируется» (D027 — системная, позже)
 *   → ВТОРИЧНЫЙ блок прогрессии: Уровень · Опыт · Серия · Стадия —
 *     спокойное накопление, без давления (D021/D031)
 *   → ДОПОЛНИТЕЛЬНЫЙ блок архива: История · Статистика · Достижения —
 *     тихие входные точки (в этом слайсе — placeholder-карточки без логики)
 *   → нижняя навигация (слой (app)).
 *
 * Прогресс сознательно НЕ (D072): второй Home, живое/кликабельное
 * Presence, CTA «Продолжить путь», списки тренировок/квестов, закрытые
 * кольца, проценты-давление, красные состояния, хайп.
 *
 * Портрет и Home рендерят ОДИН источник (PresenceFigure) — паритет
 * Home↔Progress по построению (D001/D073/D083).
 */

export type ProgressScreenProps = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  /** 0..1 — прогресс к следующему уровню. */
  levelProgress: number;
  streak: number;
  evolutionStage: number;
  evolutionFormLabel: string;
  direction: PresenceDirection;
};

const TOTAL_STAGES = 10;

export function ProgressScreen({
  level,
  xpIntoLevel,
  xpForNextLevel,
  levelProgress,
  streak,
  evolutionStage,
  evolutionFormLabel,
  direction,
}: ProgressScreenProps) {
  const xpPct = Math.round(Math.min(1, Math.max(0, levelProgress)) * 100);

  return (
    <CinematicCanvas className="min-h-dvh" contentClassName="flex min-h-dvh flex-col pb-28">
      <ScreenHeader title="Прогресс" profileSlot={<ProfileHeaderButton />} />

      {/* ── Первичный блок: идентичность ─────────────────────────── */}
      <section className="mt-4 flex flex-col items-center text-center">
        {/* Статичный портрет: без дыхания, без тапа, без перехода —
            идентичность-якорь, не второй живой центр (D072). */}
        <PresenceFigure direction={direction} size="md" animated={false} alt="Твой портрет" />

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400 [font-family:var(--font-onest)]">
          {evolutionFormLabel} · Стадия {evolutionStage} из {TOTAL_STAGES}
        </p>

        {/* Слот Легенды: pre-Legend плейсхолдер — зарождающаяся
            идентичность, не «пусто» (D027/D072). Implementation copy. */}
        <p className="mt-2 text-sm text-zinc-500 [font-family:var(--font-onest)]">
          Легенда: путь ещё формируется
        </p>
      </section>

      {/* ── Вторичный блок: траектория ────────────────────────────── */}
      <section className="mt-8">
        <GameCard className="grid grid-cols-2 gap-x-3 gap-y-5 p-5">
          <Stat label="Уровень" value={String(level)} />
          <Stat label="Стадия" value={`${evolutionStage} из ${TOTAL_STAGES}`} />
          <Stat
            label="Серия"
            value={String(streak)}
            sub={`${pluralRu(streak, "день", "дня", "дней")} подряд`}
          />
          <Stat
            label="Опыт"
            value={`${xpIntoLevel} / ${xpForNextLevel}`}
            sub="до следующего уровня"
          />
          {/* Тонкая спокойная полоса опыта — накопление, не вердикт. */}
          <div className="col-span-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400/70 to-amber-300"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
        </GameCard>
      </section>

      {/* ── Дополнительный блок: архив (входные точки) ────────────── */}
      <section className="mt-8 space-y-3">
        <ArchiveRow title="История" note="Хроника тренировок и вех пути." />
        <ArchiveRow title="Статистика" note="Тихие числа — по мере пути." />
        <ArchiveRow title="Достижения" note="Полка того, что уже случилось." />
        <p className="pt-1 text-center text-xs text-zinc-600 [font-family:var(--font-onest)]">
          Разделы архива появятся позже.
        </p>
      </section>
    </CinematicCanvas>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 [font-family:var(--font-onest)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-white [font-family:var(--font-unbounded)]">
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-[11px] text-zinc-500">{sub}</p> : null}
    </div>
  );
}

/**
 * Входная точка архива — в этом слайсе placeholder без действия:
 * обычный блок без chevron и без «выключенного» вида (принцип D086
 * для read-only строк) — отсутствие раздела не подаётся как недостаток.
 */
function ArchiveRow({ title, note }: { title: string; note: string }) {
  return (
    <GameCard className="flex items-baseline justify-between gap-3 px-5 py-4">
      <p className="text-sm font-semibold text-white [font-family:var(--font-onest)]">{title}</p>
      <p className="text-right text-xs text-zinc-500 [font-family:var(--font-onest)]">{note}</p>
    </GameCard>
  );
}

/** Русская плюрализация коротких счётчиков (1 день / 2 дня / 5 дней). */
function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
