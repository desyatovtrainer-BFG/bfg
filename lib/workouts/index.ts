/**
 * Барель модуля «тренировки» (MVP).
 *
 *   import { MVP_WORKOUTS, completeWorkoutAction } from "@/lib/workouts";
 */

export { MVP_WORKOUTS, findMvpWorkout, type MvpWorkout } from "./mvp-workouts";
export {
  buildCompanionFeedback,
  type CompanionFeedback,
  type CompanionTone,
} from "./companion-feedback";
export {
  completeWorkoutAction,
  type CompleteWorkoutResponse,
} from "./actions";
