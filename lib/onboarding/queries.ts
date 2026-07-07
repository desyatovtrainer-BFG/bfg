import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isStructureEligible,
  type FitnessLevel,
  type Goal,
  type OnboardingScreen,
  type OnboardingState,
  type Sex,
  type TrainingFormat,
  type TrainingStructure,
  type WeeklyFrequency,
} from "./types";

/**
 * Read-only состояние онбординга текущего пользователя.
 *
 * Точка резюма (D078 — «с самого раннего неотвеченного экрана»)
 * выводится из null-полей:
 *   completed_at задан            → done;
 *   goal/sex не заполнены         → s1 (первая встреча ещё не пройдена);
 *   уровень/место/частота/(формат, если положен) не заполнены → s3;
 *   всё заполнено, но не завершено → s4 (наречение).
 */
export async function getOnboardingState(
  supabase: SupabaseClient,
  userId: string,
): Promise<OnboardingState> {
  const [profileRes, avatarRes] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "goal, sex, fitness_level, training_format, weekly_frequency, training_structure, onboarding_completed_at",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("avatars").select("name").eq("id", userId).maybeSingle(),
  ]);

  if (profileRes.error) {
    console.error("[getOnboardingState] read profile", profileRes.error);
  }
  if (avatarRes.error) {
    console.error("[getOnboardingState] read avatar", avatarRes.error);
  }

  const p = profileRes.data;
  const goals = (p?.goal ?? []) as Goal[];
  const sex = (p?.sex ?? null) as Sex | null;
  const fitnessLevel = (p?.fitness_level ?? null) as FitnessLevel | null;
  const trainingFormat = (p?.training_format ?? null) as TrainingFormat | null;
  const weeklyFrequency = (p?.weekly_frequency ?? null) as WeeklyFrequency | null;
  const trainingStructure = (p?.training_structure ?? null) as TrainingStructure | null;
  const avatarName = avatarRes.data?.name ? String(avatarRes.data.name) : null;
  const completed = Boolean(p?.onboarding_completed_at);

  const s2Done = goals.length > 0 && sex !== null;
  const s3Done =
    fitnessLevel !== null &&
    trainingFormat !== null &&
    weeklyFrequency !== null &&
    (!isStructureEligible(trainingFormat, fitnessLevel) || trainingStructure !== null);

  let screen: OnboardingScreen;
  if (completed) screen = "done";
  else if (!s2Done) screen = "s1";
  else if (!s3Done) screen = "s3";
  else screen = "s4";

  return {
    screen,
    goals,
    sex,
    fitnessLevel,
    trainingFormat,
    weeklyFrequency,
    trainingStructure,
    avatarName,
  };
}
