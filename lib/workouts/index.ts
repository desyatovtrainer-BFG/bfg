/**
 * Барель модуля «тренировки» (MVP).
 *
 *   import {
 *     listActiveWorkouts,
 *     getWorkoutVideoEmbedUrl,
 *     completeWorkoutAction,
 *     type Workout,
 *   } from "@/lib/workouts";
 */

export {
  mapWorkoutRow,
  formatWorkoutDuration,
  getWorkoutVideoEmbedUrl,
  WORKOUT_DIFFICULTY_LABELS,
  WORKOUT_DIFFICULTY_ACCENT,
  type Workout,
  type WorkoutRow,
  type WorkoutDifficulty,
  type WorkoutVideoProvider,
} from "./types";
export { listActiveWorkouts, getWorkoutById } from "./queries";
export {
  buildCompanionFeedback,
  type CompanionFeedback,
  type CompanionTone,
} from "./companion-feedback";
export {
  completeWorkoutAction,
  type CompleteWorkoutResponse,
} from "./actions";
