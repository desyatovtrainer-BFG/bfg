import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Серия активных дней (streak) для MVP.
 *
 * Источник правды — `profiles.streak` + `profiles.last_active_on`.
 * `touchStreak` вызывается после любого «зачётного» действия:
 *   - завершение тренировки,
 *   - закрытие ежедневного квеста.
 *
 * Логика максимально простая и надёжная:
 *   - last_active_on === today  → no-op (идемпотентно для повторных
 *     действий за один день — стрик нельзя «накрутить»);
 *   - last_active_on === вчера   → streak += 1 (продолжение серии);
 *   - иначе (null или старее)    → streak = 1 (мягкий рестарт).
 *
 * Намеренно НЕ:
 *   - не наказывает за пропуск дня (никаких -1, никакого «штрафа»),
 *   - не считает «защиту серии» / «заморозку» (это будущая фича),
 *   - не пишет историю активности (для MVP достаточно последней даты).
 *
 * Возвращаемый StreakUpdate нужен слою экшенов: компаньон может
 * по нему подобрать тёплую реплику на продолжение серии.
 */

export type StreakUpdate = {
  previousStreak: number;
  newStreak: number;
  /** true, если стрик увеличился (вчера → сегодня). */
  increased: boolean;
  /** true, если был разрыв и стрик начался заново. Без шейминга — просто факт. */
  restarted: boolean;
  /** true, если активность сегодня уже была учтена и БД не трогали. */
  alreadyCountedToday: boolean;
};

/** YYYY-MM-DD по UTC. Совпадает с дефолтом `current_date` в Supabase. */
export function todayUtcISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Дата минус 1 день в формате YYYY-MM-DD по UTC. */
export function yesterdayOf(todayIso: string): string {
  const d = new Date(`${todayIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function touchStreak(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ data: StreakUpdate | null; error: string | null }> {
  const today = todayUtcISO();
  const yesterday = yesterdayOf(today);

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("streak, last_active_on")
    .eq("id", userId)
    .maybeSingle();

  if (readError) {
    console.error("[touchStreak] read profile", readError);
    return { data: null, error: readError.message };
  }
  if (!profile) {
    // Профиль должен быть создан ensureBfgProfile при первом входе.
    return { data: null, error: "Profile not found." };
  }

  const previousStreak = Number(profile.streak ?? 0);
  // Supabase отдаёт date как строку 'YYYY-MM-DD'; на всякий случай режем.
  const lastActive = profile.last_active_on
    ? String(profile.last_active_on).slice(0, 10)
    : null;

  if (lastActive === today) {
    return {
      data: {
        previousStreak,
        newStreak: previousStreak,
        increased: false,
        restarted: false,
        alreadyCountedToday: true,
      },
      error: null,
    };
  }

  const isFirstEver = previousStreak === 0 && lastActive === null;
  const continuedFromYesterday = lastActive === yesterday;
  const newStreak = continuedFromYesterday ? previousStreak + 1 : 1;
  const restarted = !isFirstEver && !continuedFromYesterday;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ streak: newStreak, last_active_on: today })
    .eq("id", userId);

  if (updateError) {
    console.error("[touchStreak] update profile", updateError);
    return { data: null, error: updateError.message };
  }

  return {
    data: {
      previousStreak,
      newStreak,
      increased: newStreak > previousStreak,
      restarted,
      alreadyCountedToday: false,
    },
    error: null,
  };
}
