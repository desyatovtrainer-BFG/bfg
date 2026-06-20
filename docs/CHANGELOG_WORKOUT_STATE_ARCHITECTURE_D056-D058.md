# Changelog — D056–D058 Workout State Architecture (approved)

Date: 2026-06-19
Scope: Activity workout-card states + single-active-workout flow. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decisions 056–058** as Accepted (MVP). They resolve the open items flagged in the Activity wireframe work (completed-card state, marker priority, single active workout).

- **D056 — Completed Workout Card State.** After Start → Finish, the card returns to the **Default** blue outline with **no marker**. No Completed/Finished state, no dedicated color. Completion history belongs to Progress (D008), not Activity.
- **D057 — Marker Priority Model.** **Workout In Progress has absolute priority over Upcoming.** While any workout is In Progress, no Upcoming marker and no orange card appear anywhere; on completion, the next workout becomes Upcoming. Preserves the one-state rule (D048) at list level.
- **D058 — Active Workout Exclusivity Model.** Only **one** workout may be In Progress. Users may leave it, navigate freely, and view any other workout/videos — but cannot start a second. Other workouts show **Return To Workout** (not Start Workout), returning to the active session. No cancellation system introduced.

Relationships: D056/D057 extend D048 and D054; D058 extends D046, D049, D050, and D057. None modify D039 (Home) or D046's journey model beyond referencing it.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decisions 056, 057** (UX) and **Decision 058** (Fitness System), each with Decision / Reason / Implementation Status (Not Implemented) / Related Documents.
  - Cross-references: **D048** → `+056, 057`; **D054** → `+056, 057`; **D046** → `+058`; **D049** → `+058`; **D050** → `+058`.
  - Added a **Contradictions** line recording D056–D058 as non-contradicting refinements (still 0 unresolved).
  - Added a **D056–D058 acceptance note** under Registry Notes (records resolution of the wireframe open items).
  - Updated Implementation Summary: Not Implemented 29 → 32 (+056–058); Total 55 → 58.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 55 → 58; Not Implemented 29 → 32 (D039–058); P1 gap items 25 → 28.
  - Extended the "captured under P1" note to include D056–D058.
  - Added **P1 gap entries** for D056, D057, D058.

- **`docs/BFG_UI_RULES.md`**
  - Extended **§16 — Activity composition** with the completed-→-Default rule (D056) and the marker-priority rule (D057).
  - Extended **§17 — Workout interface** with the one-active-workout / Return To Workout rule (D058). Home (§15) and Presence rules were not modified.

## Files added

- **`docs/CHANGELOG_WORKOUT_STATE_ARCHITECTURE_D056-D058.md`** (this file).

---

## Documentation conflicts discovered

1. **Open wireframe items now closed.** The Activity Wireframe v1 pass flagged three blockers: the undefined completed-this-cycle card state (→ **D056**: returns to Default), the one-Upcoming / In-Progress interaction (→ **D057**: In Progress has absolute priority), and the single-active-workout / entry behavior (→ **D058**: Return To Workout, no second start). All three are now decided. No registry note beyond the acceptance note required.
2. **Card state model is exactly three (confirmed, not a contradiction).** D056 confirms there is no fourth ("completed") card state — the model stays Default / Upcoming / In Progress (D048, D054). D057 ensures at most one special marker exists across the whole list at once.
3. **No new conflicts.** D056–D058 are consistent with D008 (history on Progress), D040/D049/D050 (start/finish boundaries), D046/D051 (cycle + pointer), and D047 (content never blocked — leaving an active workout and browsing others stays allowed).

---

## Follow-up documentation required

1. **Implementation-time detail** (not registry decisions): how the single In-Progress workout and its "active" state are persisted across navigation/app restart (D058), and how "Return To Workout" resolves the deep-link back into the active session.
2. **Still pending from prior syncs (unchanged):** the **§4 palette pass** for the D054 orange/green accents; detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** and **D040–D041**; a possible `docs/fitness/BFG_WORKOUT_JOURNEY_ARCHITECTURE.md` spec (D046); `WORKOUT_CONTENT_GUIDE.md` rewrite for the Exercise Library (D041) and the D045/D048/D054/D055 card; add new decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
