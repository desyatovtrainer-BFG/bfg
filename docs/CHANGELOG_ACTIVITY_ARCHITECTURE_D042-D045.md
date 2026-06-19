# Changelog — D042–D045 Activity Screen Architecture (approved)

Date: 2026-06-19
Scope: Activity screen architecture / product decisions. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decisions 042–045 — Activity Screen Architecture** as Accepted (MVP). The four decisions specify the Activity surface and refine prior decisions without contradiction:

- **D042 — Activity Information Hierarchy.** The Activity screen presents **Assigned Workouts above Daily Quests**. Workouts are always primary; quests are always secondary and never carry workout-card weight. Applies training primacy (D020) and the quests-in-Workouts placement (D004) to the Activity layout.
- **D043 — Continue Journey Routing.** "Continue Journey" (the Home CTA from D039) opens the **next assigned workout directly**, not the Activity screen. **Home is the resume surface; Activity is a browsing surface.** Workout 1 complete → Continue Journey → Workout 2.
- **D044 — Weight Logging Placement.** Optional weight logging appears **on the exercise screen only** — never before/after the workout, on a separate tracking screen, on the Activity surface, or on a workout card. Analytics-only, keyed to the Exercise ID. Refines the placement left open by D040.
- **D045 — Workout Card Composition.** Workout cards display **only Workout Title + Exercise Count** — no previous results, analytics, categories, weight history, or progress metrics. Intentionally minimal.

These are explicit refinements (D042→D004/D020, D043→D039, D044→D040, D045→D040/D008), not new contradictions.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decisions 042, 043, 045** (Accepted, UX) and **Decision 044** (Accepted, Fitness System), each with Decision / Reason / Implementation Status (all Not Implemented) / Related Documents.
  - Added a "Continue Journey routing" cross-reference to **Decision 039** (→ D043).
  - Added a paragraph to the **Contradictions** note recording D042–D045 as explicit refinements (0 unresolved).
  - Added a **D042–D045 acceptance note** under Registry Notes (per-decision summary; flags the undefined journey/sequence model as a follow-up).
  - Updated Implementation Summary: Not Implemented 15 → 19 (+042–045); Total 41 → 45.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 39 → 45; Not Implemented 13 → 19 (D039–045); P1 gap items 11 → 15.
  - Corrected pre-existing drift: the gaps doc had never been updated for **D040–D041**; both are now counted as Not Implemented, with a note that their detailed gap entries are pending the next fitness gap sync.
  - Added **P1 gap entries** for D042, D043, D044, D045.

- **`docs/BFG_UI_RULES.md`**
  - Added **§16 — Activity composition**: Workouts-primary/Quests-secondary hierarchy, minimal workout card (Title + Exercise Count only, reuse `GameCard`), Activity-is-browsing-not-resume (no competing primary CTA), no weight entry on Activity, and the no-shame tone guard for completion/empty states. Home (§15) and Presence rules were not modified.

## Files added

- **`docs/CHANGELOG_ACTIVITY_ARCHITECTURE_D042-D045.md`** (this file).

---

## Documentation conflicts surfaced

1. **Registry/brief numbering gap (now resolved).** D042–D045 were referenced as "approved and documented" by the source brief but did not exist in `BFG_PRODUCT_DECISIONS.md` (which ended at D041). This sync persists them; the registry is the source of truth and now contains them.
2. **Gaps-doc drift on D040–D041 (corrected here).** `BFG_PRODUCT_GAPS.md` still reported 39 total decisions and omitted D040–D041 entirely, while the registry already held 41. Counts are now aligned to the registry (45); D040–D041 detailed gap entries remain pending the next fitness gap sync.
3. **Undefined journey/sequence model (recorded, not resolved).** D043 ("Continue Journey → next assigned workout") presumes an ordered training sequence, but no document defines what makes "Workout 2" the successor to "Workout 1" (no program/plan-sequence, assignment cadence, or locked/future-workout model). Recorded as a follow-up; no decision is created here.

---

## Follow-ups (later documentation syncs)

1. Define the **journey/sequence model** that D043 routing and the Activity surface depend on (ordered list vs. coach calendar vs. unlock chain), then revisit the D043 gap entry.
2. Write detailed `BFG_PRODUCT_GAPS.md` entries for **D040–D041** (and the still-pending **D036–D038** entries) in the next fitness/companion gap sync.
3. Add D042–D045 and `BFG_UI_RULES.md §16` to `docs/PROJECT_INDEX.md` / `docs/SOURCE_OF_TRUTH.md` if those indexes are maintained.
4. At Activity implementation time, reconcile with the D003–D006 navigation unit (quests fold into the Workouts/Activity area per D004).
