import { GameCard } from "../ui/game-card";
import type {
  UnlockableCosmetic,
  UnlockedCosmetics,
} from "@/lib/cosmetics";
import type { CosmeticMark } from "@/lib/cosmetics";

/**
 * Блок косметических наград на странице аватара.
 *
 * MVP-правило:
 *   - это не магазин — это «дневник того, что ты заработал»;
 *   - закрытые карточки видны, но приглушены, и подсказывают
 *     условие открытия (это и есть мотивация продолжать);
 *   - блок добавлен к существующей странице, а не заменяет её —
 *     AvatarHero остаётся главным героем экрана.
 *
 * Серверный компонент: данные приходят сверху, нет интерактивности.
 */
export type CosmeticRewardsProps = {
  cosmetics: UnlockedCosmetics;
};

export function CosmeticRewards({ cosmetics }: CosmeticRewardsProps) {
  return (
    <div className="space-y-5">
      <header className="px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 [font-family:var(--font-onest)]">
          Награды пути
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-white [font-family:var(--font-unbounded)]">
          То, что ты заработал
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
          Косметика BFG не продаётся. Она появляется сама, когда твой путь
          доходит до новой точки.
        </p>
      </header>

      <RewardSection
        title="Варианты ауры"
        subtitle="Открываются с эволюцией формы"
        totals={cosmetics.totals.auras}
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {cosmetics.auras.map((aura) => (
            <RewardRow key={aura.id} reward={aura} accent="violet" />
          ))}
        </div>
      </RewardSection>

      <RewardSection
        title="Визуальные титулы"
        subtitle="Появляются с ростом уровня"
        totals={cosmetics.totals.titles}
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {cosmetics.titles.map((title) => (
            <RewardRow key={title.id} reward={title} accent="cyan" />
          ))}
        </div>
      </RewardSection>

      <RewardSection
        title="Символические метки"
        subtitle="Знаки эволюции аватара"
        totals={cosmetics.totals.marks}
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {cosmetics.marks.map((mark) => (
            <MarkTile key={mark.id} mark={mark} />
          ))}
        </div>
      </RewardSection>
    </div>
  );
}

type SectionProps = {
  title: string;
  subtitle: string;
  totals: { unlocked: number; total: number };
  children: React.ReactNode;
};

function RewardSection({ title, subtitle, totals, children }: SectionProps) {
  return (
    <GameCard className="p-4 sm:p-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-100 [font-family:var(--font-onest)]">
            {title}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500 [font-family:var(--font-onest)]">
            {subtitle}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-400 [font-family:var(--font-onest)]">
          {totals.unlocked} / {totals.total}
        </span>
      </div>
      {children}
    </GameCard>
  );
}

type Accent = "cyan" | "violet";

const ACCENT_DOT: Record<Accent, string> = {
  cyan: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]",
  violet: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]",
};

function RewardRow({
  reward,
  accent,
}: {
  reward: UnlockableCosmetic;
  accent: Accent;
}) {
  const unlocked = reward.unlocked;
  return (
    <div
      className={[
        "rounded-xl border p-3 transition-colors",
        unlocked
          ? "border-white/10 bg-white/[0.04]"
          : "border-white/[0.06] bg-black/30",
      ].join(" ")}
      aria-label={unlocked ? `${reward.label}: открыто` : `${reward.label}: закрыто`}
    >
      <div className="flex items-center gap-2">
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            unlocked ? ACCENT_DOT[accent] : "bg-zinc-700",
          ].join(" ")}
          aria-hidden
        />
        <p
          className={[
            "text-sm font-semibold [font-family:var(--font-onest)]",
            unlocked ? "text-zinc-100" : "text-zinc-500",
          ].join(" ")}
        >
          {reward.label}
        </p>
      </div>
      <p
        className={[
          "mt-1.5 text-[11px] leading-relaxed [font-family:var(--font-onest)]",
          unlocked ? "text-zinc-400" : "text-zinc-600",
        ].join(" ")}
      >
        {unlocked ? reward.description : reward.requirement}
      </p>
    </div>
  );
}

function MarkTile({ mark }: { mark: UnlockableCosmetic<CosmeticMark> }) {
  const unlocked = mark.unlocked;
  return (
    <div
      className={[
        "flex flex-col items-center rounded-xl border p-3 text-center transition-colors",
        unlocked
          ? "border-white/10 bg-white/[0.04]"
          : "border-white/[0.06] bg-black/30",
      ].join(" ")}
      aria-label={unlocked ? `${mark.label}: открыто` : `${mark.label}: закрыто`}
    >
      <div
        className={[
          "flex h-12 w-12 items-center justify-center rounded-full border",
          unlocked
            ? "border-white/15 bg-gradient-to-br from-sky-400/15 via-violet-400/10 to-rose-400/10"
            : "border-white/[0.06] bg-black/40",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          className={[
            "h-6 w-6",
            unlocked ? "text-zinc-100" : "text-zinc-700",
          ].join(" ")}
          aria-hidden
        >
          <path d={mark.glyph} fill="currentColor" />
        </svg>
      </div>
      <p
        className={[
          "mt-2 text-[11px] font-semibold [font-family:var(--font-onest)]",
          unlocked ? "text-zinc-100" : "text-zinc-500",
        ].join(" ")}
      >
        {mark.label}
      </p>
      <p
        className={[
          "mt-0.5 text-[10px] leading-tight [font-family:var(--font-onest)]",
          unlocked ? "text-zinc-500" : "text-zinc-600",
        ].join(" ")}
      >
        {unlocked ? mark.description : mark.requirement}
      </p>
    </div>
  );
}
