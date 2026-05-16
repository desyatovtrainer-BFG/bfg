import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Какие ежедневные квесты пользователь уже закрыл сегодня.
 *
 * Возвращает массив `quest_id`. Дату считаем серверным `current_date`
 * через фильтр `eq("completed_on", todayISO())` — этого достаточно
 * для MVP. Сброс «нового дня» — естественный, по смене даты в БД.
 *
 * Ошибки логируем и возвращаем пустой массив: лучше показать
 * «всё активно», чем уронить экран контрактов из-за чтения.
 */

export async function getTodayCompletedQuestIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const today = todayISO();

  const { data, error } = await supabase
    .from("daily_quest_completions")
    .select("quest_id")
    .eq("user_id", userId)
    .eq("completed_on", today);

  if (error) {
    console.error("[getTodayCompletedQuestIds]", error);
    return [];
  }

  return (data ?? []).map((row) => String(row.quest_id));
}

/** YYYY-MM-DD по UTC — совпадает с дефолтом `current_date` в Supabase. */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
