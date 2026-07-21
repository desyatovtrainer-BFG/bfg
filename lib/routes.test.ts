import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVITY_ROUTE,
  buildWorkoutRoute,
  resolveContinueJourneyDestination,
} from "./routes";

test("Continue Journey prioritizes the active workout over the next workout", () => {
  assert.equal(
    resolveContinueJourneyDestination({
      activeWorkoutId: "strength-mini",
      nextWorkoutId: "cardio-pulse",
    }),
    "/workouts/strength-mini",
  );
});

test("Continue Journey opens the next workout when no workout is active", () => {
  assert.equal(
    resolveContinueJourneyDestination({
      activeWorkoutId: null,
      nextWorkoutId: "cardio-pulse",
    }),
    "/workouts/cardio-pulse",
  );
});

test("Continue Journey falls back to Activity when no workout is available", () => {
  assert.equal(
    resolveContinueJourneyDestination({
      activeWorkoutId: null,
      nextWorkoutId: null,
    }),
    ACTIVITY_ROUTE,
  );
});

test("Activity stays distinct from valid workout destinations", () => {
  assert.equal(ACTIVITY_ROUTE, "/workouts");
  assert.equal(buildWorkoutRoute("cardio-pulse"), "/workouts/cardio-pulse");
  assert.notEqual(buildWorkoutRoute("cardio-pulse"), ACTIVITY_ROUTE);
});
