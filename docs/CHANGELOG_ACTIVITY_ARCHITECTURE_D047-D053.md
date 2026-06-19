# Changelog — D047–D053 Activity / Workout-session UX (approved)

Date: 2026-06-19
Scope: Activity surface + pre-start workout interface. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decisions 047–053** as Accepted. They specify workout accessibility, card state, the start/finish boundaries, the journey pointer, and pre-start awareness — and together they resolve the out-of-order start/pointer and in-progress-marker items left open by the Activity Screen Architecture work.

- **D047 — Workout Accessibility Model.** All workouts remain visible and manually accessible; no locked or hidden workouts. Later-in-cycle workouts are browsable, never gated (consistent with D030).
- **D048 — Workout State Model.** A workout card shows at most one state marker — **Upcoming Workout** or **Workout In Progress** — never both.
- **D049 — Workout Start Boundary.** A workout starts only on **Start Workout**; viewing is not starting.
- **D050 — Workout Completion Boundary.** A workout completes only via **Start → Finish**; only completed workouts advance the journey cycle; no data recorded before start.
- **D051 — Journey Pointer Logic.** The cycle pointer advances from the workout actually completed, even when the recommended order is broken.
- **D052 — Workout Start Awareness Model.** Before start, users may view exercises/videos/content freely; a persistent "not started" reminder stays visible throughout the workout interface (including during videos); content is never blocked.
- **D053 — Weight Logging Availability.** Weight fields are hidden before Start Workout and revealed after; no workout data is recorded before start.

These are explicit refinements (D047/D048 → D042/D045/D046; D049/D050 → D040; D051 → D046; D052/D053 → D044/D049). No contradictions.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decisions 047, 049, 050, 051, 053** (Fitness System) and **Decisions 048, 052** (UX), each with Decision / Reason / Implementation Status (all Not Implemented) / Related Documents.
  - Cross-references: **D046** Related Documents → `+047, 050, 051`; **D044** → `+053`; **D040** → `+049, 050, 053`.
  - Added a **Contradictions** line recording D047–D053 as non-contradicting refinements (still 0 unresolved).
  - Added a **D047–D053 acceptance note** under Registry Notes.
  - Updated Implementation Summary: Not Implemented 20 → 27 (+047–053); Total 46 → 53.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 46 → 53; Not Implemented 20 → 27 (D039–053); P1 gap items 16 → 23.
  - Extended the "captured under P1" note to include D047–D053.
  - Added **P1 gap entries** for D047, D048, D049, D050, D051, D052, D053.

- **`docs/BFG_UI_RULES.md`**
  - Extended **§16 — Activity composition** with the no-locked-workouts rule (D047) and the single mutually-exclusive card state marker (D048).
  - Added **§17 — Workout interface (pre-start & boundaries)**: start boundary (D049), completion boundary (D050/D046/D051), open pre-start content + persistent non-blocking not-started reminder (D052), and weight-field gating to the started state (D053). Home (§15) and Presence rules were not modified.

## Files added

- **`docs/CHANGELOG_ACTIVITY_ARCHITECTURE_D047-D053.md`** (this file).

---

## Documentation conflicts discovered

1. **Open Activity items now closed.** The Activity Screen Architecture work flagged ND-2 (out-of-order start + pointer behavior) and ND-3 (in-progress marker). D049/D051 resolve the start boundary and pointer behavior; D048 resolves the in-progress marker (one mutually exclusive state). No registry note required beyond the acceptance note.
2. **Card-content conflict (already decided, restated).** D045 (Title + Exercise Count only) plus D048 (one state marker) supersede the current flat-catalog card, which renders difficulty/duration/category (`WORKOUT_CONTENT_GUIDE.md` §4–§5). Those columns remain in the DB but must not render on the Activity card. Implementation note, not a new decision.
3. **No new conflicts.** D047–D053 are consistent with D040 (Start/Finish as the only required actions; completion as the primary event), D044 (weight optional, exercise-screen only, analytics-only), and D030 (never-gated core loop).

---

## Follow-up documentation required

1. **Implementation-time detail** (not registry decisions): how "in progress / unfinished" is persisted, how the cycle pointer is stored per user (D051), and how the persistent not-started reminder is realized without blocking the Kinescope video view (D052).
2. **`WORKOUT_CONTENT_GUIDE.md` rewrite** at implementation time to reflect the centralized Exercise Library (D041) and the D045/D048 card composition (already tracked from the D041 sync).
3. **Still pending from prior syncs (unchanged):** detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** and **D040–D041**; a possible `docs/fitness/BFG_WORKOUT_JOURNEY_ARCHITECTURE.md` spec (D046); add new fitness/UX decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
