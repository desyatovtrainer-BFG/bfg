"use server";

/**
 * ВРЕМЕННЫЙ dev-only Server Action для ручного теста прогрессии.
 *
 * Назначение: на дашборде есть кнопка «Тест: +XP», которая дёргает
 * `awardXp` с источником WORKOUT_COMPLETE — чтобы на живом окружении
 * проверить, что профиль и аватар обновляются как ожидается.
 *
 * УДАЛИТЬ перед релизом MVP (вместе с компонентом DevXpTestButton).
 * Оставлен отдельным файлом, чтобы один rm и одна правка дашборда
 * убирали всю экспериментальную поверхность целиком.
 */

import { getCurrentUser } from "@/lib/auth/get-user";
import { createSupabaseServerClient } from "@/lib/supabase";
import { awardXp, type AwardXpResult } from "./award-xp";

export type DevAwardXpResponse = {
  data: AwardXpResult | null;
  error: string | null;
};

export async function awardTestWorkoutXp(): Promise<DevAwardXpResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { data: null, error: "Не авторизован." };
  }

  const supabase = await createSupabaseServerClient();
  return awardXp(supabase, user.id, { source: "WORKOUT_COMPLETE" });
}
