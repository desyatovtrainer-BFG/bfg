/**
 * Барель модуля «тренировки» (MVP).
 *
 *   import {
 *     listActiveWorkouts,
 *     getWorkoutWithExercises,
 *     getExerciseVideoEmbedUrl,
 *     completeWorkoutAction,
 *     type Workout,
 *     type WorkoutExercise,
 *   } from "@/lib/workouts";
 */

export {
  mapWorkoutRow,
  mapWorkoutExerciseRow,
  formatWorkoutDuration,
  formatExerciseDuration,
  getWorkoutVideoEmbedUrl,
  getExerciseVideoEmbedUrl,
  WORKOUT_DIFFICULTY_LABELS,
  WORKOUT_DIFFICULTY_ACCENT,
  type Workout,
  type WorkoutRow,
  type WorkoutExercise,
  type WorkoutExerciseRow,
  type WorkoutDifficulty,
  type WorkoutVideoProvider,
} from "./types";
export {
  listActiveWorkouts,
  getWorkoutById,
  listWorkoutExercises,
  getWorkoutWithExercises,
} from "./queries";
export {
  buildCompanionFeedback,
  type CompanionFeedback,
  type CompanionTone,
} from "./companion-feedback";
export {
  completeWorkoutAction,
  type CompleteWorkoutResponse,
} from "./actions";
export {
  detectSupersets,
  type SupersetInfo,
  type SupersetPosition,
} from "./superset";
