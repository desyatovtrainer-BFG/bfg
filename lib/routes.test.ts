import assert from "node:assert/strict";
import test from "node:test";
import { ACTIVITY_ROUTE, getHomeCtaHref } from "./routes";

test("Continue Journey routes to the existing Activity surface", () => {
  assert.equal(getHomeCtaHref(null), ACTIVITY_ROUTE);
  assert.equal(ACTIVITY_ROUTE, "/workouts");
});

test("an active workout still resumes its session route", () => {
  assert.equal(getHomeCtaHref("cardio-pulse"), "/workouts/cardio-pulse");
});
