export const ACTIVITY_ROUTE = "/workouts" as const;

export type WorkoutRoute = `${typeof ACTIVITY_ROUTE}/${string}`;

export function buildWorkoutRoute(workoutId: string): WorkoutRoute {
  return `${ACTIVITY_ROUTE}/${workoutId}`;
}

type ContinueJourneyDestinationInput = {
  activeWorkoutId: string | null;
  nextWorkoutId: string | null;
};

export function resolveContinueJourneyDestination({
  activeWorkoutId,
  nextWorkoutId,
}: ContinueJourneyDestinationInput): WorkoutRoute | typeof ACTIVITY_ROUTE {
  if (activeWorkoutId) return buildWorkoutRoute(activeWorkoutId);
  if (nextWorkoutId) return buildWorkoutRoute(nextWorkoutId);
  return ACTIVITY_ROUTE;
}
