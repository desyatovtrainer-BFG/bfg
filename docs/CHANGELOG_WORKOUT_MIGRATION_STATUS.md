# Changelog — Workout Migration Status bridge document

Date: 2026-06-22
Scope: Workout content-architecture documentation. Documentation only — no code, schema, UI, product decisions, or new decisions.

---

## Summary

Created `docs/fitness/BFG_WORKOUT_MIGRATION_STATUS.md`, a **reference / living document** that bridges the **current implementation** (flat `workouts` / `workout_exercises` model) and the **approved target architecture** (Program → Workout Template → Workout Step → Exercise, Decisions 041 / 060 / 061).

Its purpose is to stop future Cursor or Claude sessions from mistaking the live database shape for the intended design. It states the current model, the approved hierarchy, a per-block implementation-status table, an explicit source-of-truth precedence (D041/D060/D061 override `WORKOUT_CONTENT_GUIDE.md` on conflict; the registry overrides everything), rules for future agents, and high-level migration steps.

This change records **no new decision** and modifies **no product decision**. `docs/BFG_PRODUCT_DECISIONS.md` was intentionally not touched.

---

## Files added

- **`docs/fitness/BFG_WORKOUT_MIGRATION_STATUS.md`** — the bridge document (Purpose, Current Implementation, Approved Target Architecture, Implementation Status table, Source Of Truth, Rules For Future Agents, Next Planned Migration Steps).
- **`docs/CHANGELOG_WORKOUT_MIGRATION_STATUS.md`** — this file.

## Files changed

- **`WORKOUT_CONTENT_GUIDE.md`**
  - Added a cross-reference banner at the top (under the H1) stating the guide describes the **temporary** flat model; that the target hierarchy is Program → Workout Template → Workout Step → Exercise (D041/D060/D061); that those decisions and the `BFG_*_ARCHITECTURE.md` specs override this guide on conflict; and that agents should read `BFG_WORKOUT_MIGRATION_STATUS.md` before designing new systems. (No other section changed; §13 already carries the conceptual hierarchy.)

- **`docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md`** (Decision 041)
  - Added `BFG_WORKOUT_MIGRATION_STATUS.md` to the Companion documents list, flagged "Approved / Not Implemented."

- **`docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md`** (Decision 060)
  - Added `BFG_WORKOUT_MIGRATION_STATUS.md` to the Companion documents list, flagged "Approved / Not Implemented."

- **`docs/fitness/BFG_PROGRAM_ARCHITECTURE.md`** (Decision 061)
  - Added `BFG_WORKOUT_MIGRATION_STATUS.md` to the Companion documents list, flagged "Approved / Not Implemented."

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Extended the fitness-decisions summary note: recorded D060 and D061 as Not Implemented (detailed gap entries pending the next fitness gap sync) and pointed the workout content-stack current-vs-target gap at `BFG_WORKOUT_MIGRATION_STATUS.md`. The stale summary counts (Total / Implemented / Not Implemented) were **not** changed here — count reconciliation belongs to a registry gap sync, not to this documentation task.

---

## Sections changed (exact)

- `WORKOUT_CONTENT_GUIDE.md` — new banner block immediately under the title `# BFG — Гайд по контенту тренировок (MVP)`.
- `BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` — "Companion documents" list (header block).
- `BFG_WORKOUT_STEP_ARCHITECTURE.md` — "Companion documents" list (header block).
- `BFG_PROGRAM_ARCHITECTURE.md` — "Companion documents" list (header block).
- `BFG_PRODUCT_GAPS.md` — "Summary" section note paragraph (after the counts table).

---

## Documentation conflicts resolved

1. **Current-vs-target ambiguity (the reason this doc exists).** Until now, `WORKOUT_CONTENT_GUIDE.md` and `WORKOUT_AUTHORING.md` described the live flat model with no prominent signal that it is temporary, while D041/D060/D061 describe a different, accepted hierarchy that is Not Implemented. The bridge document plus the guide banner make the precedence explicit (registry → architecture specs → bridge → authoring guides), resolving the risk that an agent treats the database shape as the design.
2. **No new conflicts introduced.** The bridge document is descriptive and decision-free; it restates accepted decisions without altering them. No product decision was modified and no decision was created.

## Conflicts noted, not resolved here (out of scope)

- **`docs/BFG_PRODUCT_GAPS.md` stale counts.** The Summary still reads Total 59 / Not Implemented 33 (range 039–059); the registry is now at 61 with D060–D061 added. Reconciliation is a registry gap-sync task, deliberately not done here.
- **`docs/WORKOUT_AUTHORING.md` superset model.** Still documents the live `superset_group_id` model (a D060 rewrite is pending at implementation time). It is a strong candidate to also carry a banner/link to the bridge doc in a future pass — not changed in this task to stay within the approved file set.

---

## Follow-up documentation (not performed here)

1. Optionally add a bridge-doc banner/link to `docs/WORKOUT_AUTHORING.md` (highest remaining current-vs-target confusion risk after the content guide).
2. Reconcile `BFG_PRODUCT_GAPS.md` summary counts and add detailed D060/D061 gap entries during the next fitness gap sync.
3. Add the bridge doc to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
4. Consider linking the bridge doc from `AGENTS.md` Research Path so fitness/workout tasks read it first.
