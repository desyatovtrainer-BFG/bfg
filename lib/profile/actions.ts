"use server";

/**
 * Server Actions Профиля — безопасные поля D084/D086 (слайс 16).
 *
 * Граница доверия: клиент присылает только намерение (выбранные цели /
 * новое имя). Владелец строки — всегда аутентифицированный пользователь
 * (getCurrentUser), user_id с клиента не принимается; записи идут через
 * SSR-клиент под RLS «своя строка».
 *
 * Пишутся ТОЛЬКО profiles.goal и avatars.name — «безопасные» поля D084:
 * ни назначение тренировок, ни XP/уровень/стадия/серия/история, ни
 * направление и слоты аватара (D083) недостижимы по построению.
 * Program-changing поля (уровень/место/частота/формат/направление)
 * редактируются в более позднем слайсе после Program Assignment.
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  AVATAR_NAME_MAX_LENGTH,
  GOALS,
  type Goal,
} from "@/lib/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase";

type ActionResult<T> = { data: T | null; error: string | null };

/**
 * Обновить цели (мульти-выбор, ≥1 — D079/D084). Безопасное поле:
 * сохраняется сразу, без модала подтверждения D084. Ревалидируется
 * только /profile — другие текущие поверхности цель не читают.
 */
export async function updateProfileGoalsAction(input: {
  goals: string[];
}): Promise<ActionResult<{ goals: Goal[] }>> {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: "Не авторизован." };

  if (!Array.isArray(input?.goals)) {
    return { data: null, error: "Выбери хотя бы одну цель." };
  }
  const unknown = input.goals.some(
    (g) => !(GOALS as readonly string[]).includes(g),
  );
  if (unknown) {
    return { data: null, error: "Не удалось сохранить. Попробуй ещё раз." };
  }
  const goals = [...new Set(input.goals)] as Goal[];
  if (goals.length === 0) {
    return { data: null, error: "Выбери хотя бы одну цель." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ goal: goals })
    .eq("id", user.id);

  if (error) {
    console.error("[updateProfileGoalsAction]", error);
    return { data: null, error: "Не удалось сохранить. Попробуй ещё раз." };
  }

  revalidatePath("/profile");
  return { data: { goals }, error: null };
}

/**
 * Обновить имя аватара (глобальное, D083). Безопасное поле D084:
 * без подтверждения, без влияния на назначение/прогрессию/слоты.
 * Лимит — единый онбординговый (1–40 после trim). Home показывает
 * имя (D082), поэтому ревалидируем /profile и /dashboard.
 */
export async function updateAvatarNameAction(input: {
  name: string;
}): Promise<ActionResult<{ name: string }>> {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: "Не авторизован." };

  const name = String(input?.name ?? "").trim();
  if (name.length < 1 || name.length > AVATAR_NAME_MAX_LENGTH) {
    return {
      data: null,
      error: `Выбери имя — от 1 до ${AVATAR_NAME_MAX_LENGTH} символов.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("avatars")
    .update({ name })
    .eq("id", user.id);

  if (error) {
    console.error("[updateAvatarNameAction]", error);
    return { data: null, error: "Не удалось сохранить. Попробуй ещё раз." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { data: { name }, error: null };
}
