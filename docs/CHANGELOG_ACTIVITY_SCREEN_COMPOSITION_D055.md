# Changelog — D055 Activity Screen Composition (approved)

Date: 2026-06-19
Scope: Activity screen layout / composition. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decision 055 — Activity Screen Composition** as Accepted (MVP). It defines the concrete Activity layout and extends D042, D045, D048, and D054; it does not modify D039 (Home) or D046 (Journey).

- **Activity is a functional navigation surface; Home remains the emotional center.**
- **Header:** "Activity" only — no date, no Today section, no motivational subtitle, no journey subtitle.
- **Two sections, visible headers:** Workouts, then Daily Quests; workouts always above quests (D042).
- **Workout section:** vertical list, **no horizontal scrolling**, always in **program order** (Workout 1, 2, 3, …); cards never reorder; cycle position via **state markers only** (D048, D054).
- **Workout card content:** Workout Number + Workout Title + Exercise Count — nothing else (extends D045 by adding the Workout Number).
- **Daily Quests section:** a visible "Daily Quests" header below the workouts.
- **Quest state model:** Completed or Not Completed only — no partial progress, percentages, progress bars, or counters ("3/5 л", "8000/10000 шагов"); no intermediate states. Done or Not Done.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decision 055** (Accepted, UX) with Decision / Reason / Implementation Status (Not Implemented) / Related Documents.
  - Cross-references: **D042** → `+055`; **D045** → `+055 (adds Workout Number)`; **D048** → `+055`; **D054** → `+055`.
  - Added a **Contradictions** line recording D055 as a non-contradicting extension and noting the D045 card now carries three items (Workout Number + Title + Exercise Count); the D045 forbidden list is unchanged; binary quest state is consistent with D031 and does not change D016/D017/D033.
  - Added a **D055 acceptance note** under Registry Notes.
  - Updated Implementation Summary: Not Implemented 28 → 29 (+055); Total 54 → 55.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 54 → 55; Not Implemented 28 → 29 (D039–055); P1 gap items 24 → 25.
  - Extended the "captured under P1" note to include D055.
  - Added a **P1 gap entry** for D055.

- **`docs/BFG_UI_RULES.md`**
  - Extended **§16 — Activity composition**: card composition now reads Workout Number + Title + Exercise Count (D045 + D055); added the "Activity"-only header rule, visible section headers in fixed order, vertical list / program order / no reorder / no horizontal scroll, and the binary quest state rule. Home (§15) and Presence rules were not modified.

## Files added

- **`docs/CHANGELOG_ACTIVITY_SCREEN_COMPOSITION_D055.md`** (this file).

---

## Documentation conflicts discovered

1. **D045 card composition extended (recorded, not a contradiction).** D045 specified "Workout Title + Exercise Count only"; D055 adds the **Workout Number**, making the card a three-item composition. D055 declares itself an extension of D045, and the D045 forbidden list (categories / analytics / duration / previous results / weight) is unchanged. §16 and the D045 cross-reference were updated to reflect this.
2. **Binary quest state vs. numeric quest categories (no conflict).** D033 includes inherently numeric categories (Walking/Steps, Hydration). D055 governs **display state only** (Done / Not Done); it does not change how completion is determined, nor the catalog/selection model (D016, D017, D033). The binary display reinforces the no-shame rule (D031).
3. **No other conflicts.** D055 leaves D039 (Home) and D046 (Journey) untouched and is consistent with D042/D048/D054.

---

## Follow-up documentation required

1. **Still pending from prior syncs (unchanged):** the **§4 palette pass** for the D054 orange/green state accents; detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** and **D040–D041**; a possible `docs/fitness/BFG_WORKOUT_JOURNEY_ARCHITECTURE.md` spec (D046); `WORKOUT_CONTENT_GUIDE.md` rewrite for the Exercise Library (D041) and the D045/D048/D054/D055 card; add new decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
2. At implementation time, confirm how a numeric-target quest (e.g. steps) maps to the binary Completed / Not Completed display without surfacing intermediate counters (D055).
