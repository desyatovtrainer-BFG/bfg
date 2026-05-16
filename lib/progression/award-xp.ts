import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type AvatarEvolution,
  getAvatarEvolutionForLevel,
  hasEvolved,
} from "./avatar-evolution";
import { calculateLevel } from "./levels";
import { type XpRewardSource, getXpReward } from "./xp-rewards";

/**
 * Серверный update-цикл прогрессии.
 *
 * Делает три вещи и больше ничего:
 *   1. читает `profiles` (xp, level),
 *   2. считает новый xp/level,
 *   3. если прошёл порог стадии — двигает строку в `avatars`.
 *
 * Намеренно НЕ:
 *   - не управляет стриками (это другой helper),
 *   - не пишет историю XP (заведём, когда понадобится),
 *   - не делает оптимистичных обновлений в UI (это слой выше).
 *
 * RLS: ожидается, что `supabase` создан под сессией пользователя
 * (createSupabaseServerClient). Тогда `userId` — это и есть текущий юзер,
 * и политики `profiles`/`avatars` пропустят update.
 */

export type AwardXpInput =
  | { amount: number; reason?: string }
  | { source: XpRewardSource; reason?: string };

export type AwardXpResult = {
  xpGained: number;
  totalXp: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  /** true, если уровень пересёк порог стадии аватара. */
  evolved: boolean;
  /** Новая (или прежняя) стадия — удобно сразу отдать в UI. */
  evolution: AvatarEvolution;
};

export async function awardXp(
  supabase: SupabaseClient,
  userId: string,
  input: AwardXpInput,
): Promise<{ data: AwardXpResult | null; error: string | null }> {
  const amount = "amount" in input ? input.amount : getXpReward(input.source);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { data: null, error: "XP amount must be a positive number." };
  }

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("xp, level")
    .eq("id", userId)
    .maybeSingle();

  if (readError) {
    console.error("[awardXp] read profile", readError);
    return { data: null, error: readError.message };
  }
  if (!profile) {
    // Профиль должен быть создан ensureBfgProfile при первом входе.
    return { data: null, error: "Profile not found." };
  }

  const previousXp = Number(profile.xp ?? 0);
  const previousLevel = Number(profile.level ?? 1);
  const totalXp = previousXp + amount;
  const newLevel = calculateLevel(totalXp);
  const leveledUp = newLevel > previousLevel;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ xp: totalXp, level: newLevel })
    .eq("id", userId);

  if (updateError) {
    console.error("[awardXp] update profile", updateError);
    return { data: null, error: updateError.message };
  }

  const evolution = getAvatarEvolutionForLevel(newLevel);
  const evolved = leveledUp && hasEvolved(previousLevel, newLevel);

  if (evolved) {
    const { error: avatarError } = await supabase
      .from("avatars")
      .update({
        evolution_stage: evolution.stage,
        form: evolution.form,
        aura: evolution.aura,
        glow_intensity: evolution.glowIntensity,
      })
      .eq("id", userId);

    if (avatarError) {
      // Не валим всю прогрессию из-за косметики — XP уже начислен.
      // UI отрисует «старую» стадию; на следующем awardXp догоним.
      console.error("[awardXp] update avatar", avatarError);
    }
  }

  return {
    data: {
      xpGained: amount,
      totalXp,
      previousLevel,
      newLevel,
      leveledUp,
      evolved,
      evolution,
    },
    error: null,
  };
}
