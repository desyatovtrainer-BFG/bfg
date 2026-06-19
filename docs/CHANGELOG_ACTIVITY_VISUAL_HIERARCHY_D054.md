# Changelog — D054 Activity Visual Hierarchy (approved)

Date: 2026-06-19
Scope: Activity workout-card visual hierarchy. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decision 054 — Activity Visual Hierarchy** as Accepted (MVP). It extends D045 (Workout Card Composition) and D048 (Workout State Model):

- **All workout cards use the same visual size; the current workout is never enlarged.**
- Visual emphasis is achieved through **state, color, and position** (D042) — never card size.
- **Card outline colors:** Default workout — neutral / blue; **Upcoming** — orange outline + Upcoming marker; **Workout In Progress** — green outline + In Progress marker.
- The **D048 one-state rule is unchanged**: Upcoming *or* In Progress, never both.
- Activity is not a dashboard and not Home; it explicitly does **not** modify D039 (Home) or D046 (Journey).

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decision 054** (Accepted, UX) with Decision / Reason / Implementation Status (Not Implemented) / Related Documents.
  - Cross-references: **D048** Related Documents → `+054`; **D045** Related Documents → `+054`.
  - Added a **Contradictions** line recording D054 as a non-contradicting extension and flagging the orange/green palette extension for §4 reconciliation (0 unresolved contradictions).
  - Added a **D054 acceptance note** under Registry Notes (records the equal-size rule, the color hierarchy, and that it supersedes the non-persisted "largest current card" idea from the earlier Activity design analysis).
  - Updated Implementation Summary: Not Implemented 27 → 28 (+054); Total 53 → 54.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 53 → 54; Not Implemented 27 → 28 (D039–054); P1 gap items 23 → 24.
  - Extended the "captured under P1" note to include D054.
  - Added a **P1 gap entry** for D054.

- **`docs/BFG_UI_RULES.md`**
  - Extended **§16 — Activity composition** with the equal-card-size rule (D054) and the card outline color hierarchy (Default neutral/blue, Upcoming orange, In Progress green), with a note that orange/green extend the §4 palette. Home (§15) and Presence rules were not modified.

## Files added

- **`docs/CHANGELOG_ACTIVITY_VISUAL_HIERARCHY_D054.md`** (this file).

---

## Documentation conflicts discovered

1. **Palette extension (recorded, not resolved).** D054's **orange** (Upcoming) and **green** (In Progress) card-outline accents are not in the documented base palette (`BFG_UI_RULES.md §4`: sky / violet / rose / cyan). §16 now states the Activity card colors; §4 was intentionally left unchanged (out of this task's scope and not Home/Presence). Reconcile in a dedicated §4 palette pass.
2. **Supersedes a non-persisted design suggestion (no doc fix needed).** The earlier Activity Screen Architecture analysis recommended emphasizing the current workout by making its card the largest/most prominent. D054 overrides that (equal size; emphasis via state/color/position). That analysis was delivered as conversation output and never written to a doc, so no document required correction — recorded here for traceability.
3. **No decision contradictions.** D054 is consistent with D042 (hierarchy via order/weight), D045 (minimal card), D048 (one state), and leaves D039/D046 untouched.

---

## Follow-up documentation required

1. **§4 palette pass** to formally admit the orange (Upcoming) and green (In Progress) state accents, or to remap them onto the existing palette, keeping contrast/accessibility rules (§9) intact.
2. **Still pending from prior syncs (unchanged):** detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** and **D040–D041**; a possible `docs/fitness/BFG_WORKOUT_JOURNEY_ARCHITECTURE.md` spec (D046); `WORKOUT_CONTENT_GUIDE.md` rewrite for the Exercise Library (D041) and the D045/D048/D054 card; add new decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
