# Changelog — D046 Workout Journey Architecture (approved)

Date: 2026-06-19
Scope: Workout journey / sequence model. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decision 046 — Workout Journey Architecture (MVP)** as Accepted. It defines the journey/sequence model that the D042–D045 Activity sync explicitly flagged as missing:

- A user is assigned a workout **program** of a finite but **non-fixed** number of workouts (2, 3, 4, 5, or any future amount). The architecture must not depend on a specific count.
- Workouts have a defined **sequence** that **repeats as a cycle** after the final workout (e.g. 1 → 2 → 3 → 1 → 2 → 3; for four: 1 → 2 → 3 → 4 → 1 → 2 → 3 → 4). The model is generic and count-agnostic.
- **Continue Journey resume order:** (1) if an unfinished workout exists, open it; (2) otherwise open the next workout in the current cycle. Continue Journey must not depend on the number of workouts — its purpose is "continue the next logical step in the current training journey."

D046 **refines D043** (supplies the meaning of "next assigned workout") and **D042** (the ordered list of assigned workouts the Activity hierarchy presents). It introduces no contradictions.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decision 046** (Accepted, Fitness System): program model, generic repeating cycle, and the Continue Journey resume order, with Decision / Reason / Implementation Status (Not Implemented) / Related Documents.
  - Added cross-references: **Decision 043** Related Documents → `046 (journey model)`; **Decision 042** Related Documents → `046`.
  - Updated the **D042–D045 acceptance note**: the journey/sequence model previously "not yet specified — flagged as a follow-up" now reads "specified by Decision 046."
  - Added a **D046 acceptance note** under Registry Notes (records the resolution of the journey follow-up and the no-UI-change review outcome).
  - Added a **Contradictions** line recording D046 as a non-contradicting refinement (still 0 unresolved).
  - Updated Implementation Summary: Not Implemented 19 → 20 (+046); Total 45 → 46.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 45 → 46; Not Implemented 19 → 20 (D039–046); P1 gap items 15 → 16.
  - Added a **P1 gap entry** for D046.
  - Updated the **D043 gap entry**: the journey/sequence dependency previously "not yet specified anywhere" now reads "now specified by D046."

## Files added

- **`docs/CHANGELOG_WORKOUT_JOURNEY_D046.md`** (this file).

## Files reviewed, not changed

- **`docs/BFG_UI_RULES.md`** — reviewed per the task. D046 is resume **logic** behind the Continue Journey CTA (which lives on Home, §15) and a journey **architecture** model; it introduces no new Activity-composition or navigation **layout** rule. §16 (Activity) already states that Activity is a browsing surface and that Continue Journey lives on Home, which remains accurate. Home rules (§15) and Presence rules were not touched.

---

## Documentation conflicts discovered

1. **Open follow-up now closed.** The D042–D045 sync recorded "undefined journey/sequence model" as an open follow-up and a documentation conflict. D046 resolves it; the corresponding notes in `BFG_PRODUCT_DECISIONS.md` and `BFG_PRODUCT_GAPS.md` were updated to point at D046.
2. **No new conflicts.** D046 does not contradict D040 (workout-completion tracking), D042, or D043; the cycle model and the "unfinished workout first" rule are consistent with completion-as-primary-event (D040) and Workouts-primary hierarchy (D042).

---

## Follow-up documentation required

1. At implementation time, decide how an **"unfinished workout"** is determined and persisted (in-progress session state) and how **cycle position** is stored per user — architecture detail, not a registry decision.
2. Consider whether a future `docs/fitness/BFG_WORKOUT_JOURNEY_ARCHITECTURE.md` spec is warranted (parallel to the Tracking and Library specs) if the cycle/program model grows beyond what the registry entry captures.
3. Still pending from prior syncs (unchanged): detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** and **D040–D041**; add new fitness decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
