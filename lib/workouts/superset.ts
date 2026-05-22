/**
 * Superset detection utility for the workout session.
 *
 * A valid superset pair = two consecutive exercises sharing the same
 * non-null supersetGroupId. Non-consecutive matching IDs are silently
 * ignored (treated as normal exercises) and flagged in dev mode.
 *
 * Scope: pure UI-layer detection. No backend writes, no state machines,
 * no grouping abstractions beyond what the session slide renderer needs.
 */

import type { WorkoutExercise } from "./types";

export type SupersetPosition = "first" | "second";

export type SupersetInfo = {
  groupId: string;
  position: SupersetPosition;
};

/**
 * Returns a Map<exerciseIndex, SupersetInfo> for every exercise that
 * participates in a valid consecutive superset pair.
 *
 * Exercises absent from the map render as normal slides — no behaviour change.
 */
export function detectSupersets(
  exercises: WorkoutExercise[],
): Map<number, SupersetInfo> {
  const result = new Map<number, SupersetInfo>();

  for (let i = 0; i < exercises.length - 1; i++) {
    const gid = exercises[i].supersetGroupId;
    if (gid === null) continue;

    if (exercises[i + 1].supersetGroupId === gid) {
      result.set(i, { groupId: gid, position: "first" });
      result.set(i + 1, { groupId: gid, position: "second" });
      i++; // consume both; next iteration won't revisit i+1
    }
  }

  if (process.env.NODE_ENV === "development") {
    warnOrphanedGroupIds(exercises, result);
  }

  return result;
}

function warnOrphanedGroupIds(
  exercises: WorkoutExercise[],
  paired: Map<number, SupersetInfo>,
): void {
  const groupToIndices = new Map<string, number[]>();
  exercises.forEach((ex, idx) => {
    if (!ex.supersetGroupId) return;
    const arr = groupToIndices.get(ex.supersetGroupId) ?? [];
    arr.push(idx);
    groupToIndices.set(ex.supersetGroupId, arr);
  });
  for (const [gid, indices] of groupToIndices) {
    const orphaned = indices.filter((idx) => !paired.has(idx));
    if (orphaned.length > 0) {
      console.warn(
        `[superset] Non-consecutive superset_group_id "${gid}" at exercise index(es) [${orphaned.join(", ")}] — treated as normal exercises.`,
      );
    }
  }
}
