import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type AvatarEvolution,
  getAvatarEvolutionForLevel,
} from "./avatar-evolution";
import { calculateLevel } from "./levels";
import { type XpRewardSource, getXpReward } from "./xp-rewards";

/**
 * Серверный update-цикл прогрессии.
 *
 * Три шага и больше ничего:
 *
 *   1. Атомарный инкремент XP через RPC bfg_increment_xp.
 *      Единственный UPDATE — нет TOCTOU-гонки между конкурентными вызовами.
 *      Возвращает новый суммарный XP и сохранённый уровень до пересчёта.
 *
 *   2. Пересчёт и запись profiles.level.
 *      calculateLevel — чистая функция в Node. Пишем, только если значение
 *      изменилось (включая исправление любого дрейфа между xp и level).
 *
 *   3. Сверка стадии аватара.
 *      Вычисляем ожидаемую стадию из нового уровня и обновляем avatars только
 *      если текущая сохранённая стадия расходится с ожидаемой (.neq-фильтр).
 *      Это закрывает оба сценария:
 *        • свежая эволюция — уровень только что пересёк порог;
 *        • reconciliation — предыдущий update avatars упал, но XP уже прошёл;
 *          следующий вызов awardXp автоматически выравнивает стадию.
 *
 * Намеренно НЕ:
 *   - не управляет стриками (другой helper),
 *   - не пишет историю XP (заведём, когда понадобится),
 *   - не делает оптимистичных обновлений в UI (слой выше).
 *
 * RLS: ожидается, что `supabase` создан под сессией пользователя
 * (createSupabaseServerClient). bfg_increment_xp использует security invoker —
 * работает под тем же JWT, политики profiles/avatars применяются как обычно.
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
  /** true если avatars.evolution_stage был обновлён в этом вызове. */
  evolved: boolean;
  /** Текущая (или новая) стадия аватара — удобно сразу отдать в UI. */
  evolution: AvatarEvolution;
};

/** Row returned by the bfg_increment_xp Postgres function. */
type IncrementXpRow = { new_xp: number; prev_level: number };

export async function awardXp(
  supabase: SupabaseClient,
  userId: string,
  input: AwardXpInput,
): Promise<{ data: AwardXpResult | null; error: string | null }> {
  const amount = "amount" in input ? input.amount : getXpReward(input.source);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { data: null, error: "XP amount must be a positive number." };
  }

  // ── Step 1: Atomic XP increment ─────────────────────────────────────────
  //
  // bfg_increment_xp does `xp = xp + p_amount` in a single SQL UPDATE.
  // No separate read → no TOCTOU race between concurrent qualifying actions.
  //
  // Returns:
  //   new_xp    — total XP after increment; used to derive newLevel below.
  //   prev_level — the stored level column, which this UPDATE does not touch,
  //                so it represents the level *before* any recomputation here.
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "bfg_increment_xp",
    { p_user_id: userId, p_amount: amount },
  );

  if (rpcError) {
    console.error("[awardXp] bfg_increment_xp", rpcError);
    return { data: null, error: rpcError.message };
  }

  // RETURNS TABLE → PostgREST delivers an array; expect exactly one row.
  // Zero rows = profile not found or RLS blocked the UPDATE.
  const rows = rpcData as IncrementXpRow[] | null;
  const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!row) {
    return { data: null, error: "Profile not found." };
  }

  const totalXp = Number(row.new_xp);
  const previousLevel = Number(row.prev_level ?? 1);
  const newLevel = calculateLevel(totalXp);
  const leveledUp = newLevel > previousLevel;

  // ── Step 2: Persist level ────────────────────────────────────────────────
  //
  // Write when newLevel !== previousLevel. This handles both the normal
  // level-up case and any prior drift where stored level diverged from
  // calculateLevel(stored xp) — including drift in either direction.
  // A failed level write is recoverable: XP is already committed, and the
  // next awardXp call will detect the mismatch and correct it.
  if (newLevel !== previousLevel) {
    const { error: levelError } = await supabase
      .from("profiles")
      .update({ level: newLevel })
      .eq("id", userId);

    if (levelError) {
      console.error("[awardXp] update level", levelError);
    }
  }

  // ── Step 3: Reconcile avatar evolution ──────────────────────────────────
  //
  // Compute the expected evolution stage from the new level, then write
  // avatars only when the stored stage differs — the .neq() filter makes
  // the UPDATE a no-op (0 rows) when stage is already correct, so this
  // check carries no meaningful cost on ordinary calls.
  //
  // Why this replaces `leveledUp && hasEvolved(previousLevel, newLevel)`:
  //   The old condition was gated on a fresh threshold crossing. If an
  //   avatar UPDATE had previously failed after profiles was already written,
  //   the next call would see previousLevel as the post-evolution level, so
  //   hasEvolved returned false and the avatar stayed stale indefinitely.
  //   This approach reconciles on every call, regardless of history.
  const evolution = getAvatarEvolutionForLevel(newLevel);

  const { data: avatarRows, error: avatarError } = await supabase
    .from("avatars")
    .update({
      evolution_stage: evolution.stage,
      form: evolution.form,
      aura: evolution.aura,
      glow_intensity: evolution.glowIntensity,
    })
    .eq("id", userId)
    .neq("evolution_stage", evolution.stage)
    .select("evolution_stage");

  if (avatarError) {
    // Non-fatal: XP and level are committed. The .neq() guard means the same
    // reconciliation check will fire on the next awardXp call.
    console.error("[awardXp] update avatar", avatarError);
  }

  // evolved = true when the UPDATE actually changed the row (stage was wrong).
  // evolved = false when .neq() matched 0 rows (stage was already correct).
  const evolved = Array.isArray(avatarRows) && avatarRows.length > 0;

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
