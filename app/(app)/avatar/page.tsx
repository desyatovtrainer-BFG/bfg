import type { Metadata } from "next";
import Link from "next/link";
import { AvatarHero } from "@/app/components/avatar/avatar-hero";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  getAvatarAuraLabel,
  getAvatarEvolutionForLevel,
  getAvatarFormLabel,
  getAvatarStageFlavor,
} from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Аватар — BFG",
  description:
    "Твоя текущая форма, аура и стадия эволюции в Big Fitness Game.",
};

/**
 * Экран аватара.
 *
 * Источник истины — таблица `avatars` (по PK = auth.users.id), плюс
 * `profiles.level` как fallback, если строка аватара по какой-то причине
 * рассинхронизирована (старый юзер, гонка ensureBfgProfile и т.п.).
 *
 * Намеренно НЕ:
 *   - не пересчитываем стадию по уровню как «правильную» (это сделает
 *     awardXp при следующем XP-событии). Здесь мы показываем то, что
 *     реально лежит в БД — это и есть «настоящее состояние» аватара.
 *   - не плодим лишних абстракций: один select, один компонент.
 */
export default async function AvatarPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <SignedOutFallback />;
  }

  const supabase = await createSupabaseServerClient();

  const [avatarRes, profileRes] = await Promise.all([
    supabase
      .from("avatars")
      .select("form, aura, evolution_stage, glow_intensity")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("level")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (avatarRes.error) {
    console.error("[AvatarPage] read avatar", avatarRes.error);
  }
  if (profileRes.error) {
    console.error("[AvatarPage] read profile", profileRes.error);
  }

  // Если строки `avatars` ещё нет — строим стадию из уровня (тот же
  // helper, что и awardXp). Это держит UI согласованным с прогрессией.
  const level = Number(profileRes.data?.level ?? 1);
  const fallback = getAvatarEvolutionForLevel(level);

  const row = avatarRes.data;
  const form = (row?.form as string | undefined) ?? fallback.form;
  const aura = (row?.aura as string | undefined) ?? fallback.aura;
  const stage = Number(row?.evolution_stage ?? fallback.stage);
  const glowIntensity = Number(row?.glow_intensity ?? fallback.glowIntensity);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-black text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(100%_65%_at_50%_-15%,rgba(56,189,248,0.1),transparent_52%),radial-gradient(85%_50%_at_100%_40%,rgba(167,139,250,0.08),transparent_50%),radial-gradient(70%_45%_at_0%_85%,rgba(251,113,133,0.06),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-black" />
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.55)]" />

      <div className="relative z-[1] mx-auto max-w-lg px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 [font-family:var(--font-onest)]"
          >
            ← Главная
          </Link>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 [font-family:var(--font-onest)]">
            Аватар
          </span>
        </div>

        <header className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600 [font-family:var(--font-onest)]">
            Big Fitness Game
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-white [font-family:var(--font-unbounded)] sm:text-3xl">
            Твоя форма —{" "}
            <span className="bg-gradient-to-r from-sky-200 via-violet-200 to-rose-200 bg-clip-text text-transparent">
              отражение пути
            </span>
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
            Не косметика, а визуальная память твоего движения. С каждой стадией аура становится плотнее, а свет — устойчивее.
          </p>
        </header>

        <section className="mb-6">
          <AvatarHero
            stage={stage}
            formLabel={getAvatarFormLabel(form)}
            auraLabel={getAvatarAuraLabel(aura)}
            glowIntensity={glowIntensity}
            flavorText={getAvatarStageFlavor(stage)}
          />
        </section>

        <footer className="text-center">
          <p className="text-xs leading-relaxed text-zinc-600 [font-family:var(--font-onest)]">
            Следующая стадия откроется через рост уровня. Каждый закрытый день — это новая линия в твоём силуэте.
          </p>
        </footer>
      </div>
    </div>
  );
}

function SignedOutFallback() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 pb-28 pt-12 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600 [font-family:var(--font-onest)]">
        Big Fitness Game
      </p>
      <h1 className="mt-3 text-2xl font-bold text-white [font-family:var(--font-unbounded)] sm:text-3xl">
        Аватар
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500 [font-family:var(--font-onest)]">
        Войди, чтобы увидеть свою текущую форму и ауру.
      </p>
      <Link
        href="/login"
        className="mt-10 text-sm font-semibold text-sky-400 transition-colors hover:text-sky-300 [font-family:var(--font-onest)]"
      >
        Войти →
      </Link>
    </div>
  );
}
