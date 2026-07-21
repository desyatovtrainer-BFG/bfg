export const ACTIVITY_ROUTE = "/workouts" as const;

export function getHomeCtaHref(activeWorkoutId: string | null): string {
  return activeWorkoutId
    ? `${ACTIVITY_ROUTE}/${activeWorkoutId}`
    : ACTIVITY_ROUTE;
}
