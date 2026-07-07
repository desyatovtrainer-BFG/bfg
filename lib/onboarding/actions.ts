"use server";

/**
 * Server Actions онбординга (D078/D079/D085).
 *
 * Пишут ТОЛЬКО onboarding-колонки (goal/sex/уровень/место/частота/формат,
 * avatars.name, onboarding_completed_at) — колонки прогрессии
 * (xp/level/streak) недостижимы по построению: онбординг ничего не
 * начисляет (D061 — назначение не даёт XP).
 *
 * Условный training_structure (D085): обязателен ТОЛЬКО для
 * Зал + не-новичок; всем остальным вопрос не задаётся и значение
 * принудительно остаётся null (даже если клиент его прислал).
 * Флаг завершения ставится только на S4 при валидном имени (D078).
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  ALLOWED_FREQUENCIES,
  FITNESS_LEVELS,
  GOALS,
  isStructureEligible,
  SEXES,
  TRAINING_FORMATS,
  TRAINING_STRUCTURES,
  type FitnessLevel,
  type Goal,
  type Sex,
  type TrainingFormat,
  type TrainingStructure,
  type WeeklyFrequency,
} from "./types";

type ActionResult = { error: string | null };

/** S2: цели (мульти, ≥1) + Герой/Героиня (D079). */
export async function saveOnboardingS2Action(input: {
  goals: string[];
  sex: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован." };

  const goals = Array.isArray(input.goals)
    ? input.goals.filter((g): g is Goal => (GOALS as readonly string[]).includes(g))
    : [];
  if (goals.length === 0) {
    return { error: "Выбери хотя бы одну цель." };
  }
  if (!(SEXES as readonly string[]).includes(input.sex)) {
    return { error: "Выбери, чью главу мы открываем." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ goal: goals, sex: input.sex as Sex })
    .eq("id", user.id);

  if (error) {
    console.error("[saveOnboardingS2Action]", error);
    return { error: "Не удалось сохранить. Попробуй ещё раз." };
  }
  return { error: null };
}

/** S3: уровень + место + частота (матрица D085) + условный формат (D085). */
export async function saveOnboardingS3Action(input: {
  fitnessLevel: string;
  trainingFormat: string;
  weeklyFrequency: number;
  trainingStructure?: string | null;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован." };

  if (!(FITNESS_LEVELS as readonly string[]).includes(input.fitnessLevel)) {
    return { error: "Выбери уровень." };
  }
  if (!(TRAINING_FORMATS as readonly string[]).includes(input.trainingFormat)) {
    return { error: "Выбери, где будешь тренироваться." };
  }
  const level = input.fitnessLevel as FitnessLevel;
  const format = input.trainingFormat as TrainingFormat;

  const allowed = ALLOWED_FREQUENCIES[level];
  if (!allowed.includes(input.weeklyFrequency as WeeklyFrequency)) {
    return { error: "Выбери, сколько раз в неделю тебе удобно." };
  }

  // Условный формат тренировок (D085): обязателен только Зал+не-новичок;
  // остальным — принудительно null, что бы ни пришло с клиента.
  let structure: TrainingStructure | null = null;
  if (isStructureEligible(format, level)) {
    if (
      !input.trainingStructure ||
      !(TRAINING_STRUCTURES as readonly string[]).includes(input.trainingStructure)
    ) {
      return { error: "Выбери формат тренировок." };
    }
    structure = input.trainingStructure as TrainingStructure;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      fitness_level: level,
      training_format: format,
      weekly_frequency: input.weeklyFrequency,
      training_structure: structure,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[saveOnboardingS3Action]", error);
    return { error: "Не удалось сохранить. Попробуй ещё раз." };
  }
  return { error: null };
}

/** S4: обязательное наречение (D078/D079) → флаг завершения → Home. */
export async function completeOnboardingAction(input: {
  name: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован." };

  const name = String(input.name ?? "").trim();
  if (name.length < 1 || name.length > 40) {
    return { error: "Выбери имя — от 1 до 40 символов." };
  }

  const supabase = await createSupabaseServerClient();

  // S4 завершается только после S2/S3 (D078 — флаг только после S4,
  // резюм — с раннего неотвеченного): проверяем состояние на сервере.
  const { data: p, error: readError } = await supabase
    .from("profiles")
    .select("goal, sex, fitness_level, training_format, weekly_frequency, training_structure")
    .eq("id", user.id)
    .maybeSingle();
  if (readError || !p) {
    console.error("[completeOnboardingAction] read", readError);
    return { error: "Не удалось сохранить. Попробуй ещё раз." };
  }
  const goalsOk = Array.isArray(p.goal) && p.goal.length > 0;
  const structureOk =
    !isStructureEligible(
      (p.training_format ?? null) as TrainingFormat | null,
      (p.fitness_level ?? null) as FitnessLevel | null,
    ) || p.training_structure !== null;
  if (!goalsOk || !p.sex || !p.fitness_level || !p.training_format || !p.weekly_frequency || !structureOk) {
    return { error: "Сначала ответь на вопросы пути." };
  }

  const { error: nameError } = await supabase
    .from("avatars")
    .update({ name })
    .eq("id", user.id);
  if (nameError) {
    console.error("[completeOnboardingAction] name", nameError);
    return { error: "Не удалось сохранить имя. Попробуй ещё раз." };
  }

  const { error: flagError } = await supabase
    .from("profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.id);
  if (flagError) {
    console.error("[completeOnboardingAction] flag", flagError);
    return { error: "Не удалось завершить. Попробуй ещё раз." };
  }

  // Home покажет имя/направление сразу (D082).
  revalidatePath("/dashboard");
  return { error: null };
}
