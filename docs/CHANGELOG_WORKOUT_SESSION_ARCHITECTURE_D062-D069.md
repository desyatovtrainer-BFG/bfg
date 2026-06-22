# Changelog — D062–D069 Workout Session Architecture (approved)

Date: 2026-06-22
Scope: Workout session UX — Start Screen, navigation, Step layouts, Finish Screen, Result Banner, card-count semantics, Evolution Reveal flow. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decisions 062–069 (UX, MVP)** as Accepted — the concrete workout-session screens and flow on top of the accepted content/journey model (D040–D061).

- **D062 — Workout Start Screen.** Displays only the **Workout Title** and an **ordered Workout Step list**; button is **Start Workout**, or **Return To Workout** if another workout is In Progress (D058). No duration / difficulty / categories / analytics / companion content.
- **D063 — Workout Navigation.** **Swipe-only** (forward / backward); **no visible Next/Previous buttons**. Flow: Start Screen → Steps → Finish Screen; swiping past the final Step opens the Finish Screen.
- **D064 — Single Exercise Step Layout.** Vertical hierarchy **Video → Title → Prescription (Sets, Reps/Duration) → optional Weight**; video primary; weight hidden before Start, visible after (D053).
- **D065 — Superset Step Layout.** One Step; **both exercises shown simultaneously** in a **horizontal card structure**; **vertical-orientation videos**; two independent weight fields; visually distinct; reads as one Step. No Superset entity, no "1/2"/"2/2" notation, no "2 exercises" label.
- **D066 — Workout Finish Screen.** Separate screen; **"Workout Complete"** + **Finish Workout** button (D050); no companion content, no extra metrics.
- **D067 — Workout Result Banner.** Show **only changes**, **Stage → Level → XP** (largest first); rare companion reactions for meaningful milestones only (D036/D037).
- **D068 — Workout Card Count Semantics.** Workout card shows **Exercise Count**; Workout Start Screen shows **Workout Steps**; the two counts are **different concepts**. Resolves the count ambiguity flagged in the Activity architecture review (D045/D055 vs D060).
- **D069 — Evolution Reveal Flow.** A **Stage Evolution overrides the destination** and routes to **Home** for the Evolution Animation, regardless of trigger. Normal workout completion → return to Activity; normal quest completion → remain on Activity. Home is the emotional stage for the transformation (D002/D007/D035/D039).

Relationships: D062 extends D045/D049/D055/D058; D063 builds on D060; D064/D065 layout the D060 Step with weight gated post-start (D044/D053); D066/D067 sit on the completion boundary (D050) and the event-driven Voice (D036/D037); D068 clarifies D045/D055 vs D060; D069 stages evolution (D035) on Home (D039). No contradictions.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decisions 062–069** (all UX, Accepted, Not Implemented), each with Decision / Reason / Implementation Status / Related Documents.
  - Added a **Contradictions** paragraph recording D062–D069 as non-contradicting refinements (still 0 unresolved), including the **D065 §1/§13 layout reconciliation** follow-up (horizontal two-card superset at mobile width).
  - Added a **D062–D069 acceptance note** under Implementation summary.
  - Updated Implementation Summary: Not Implemented 35 → 43 (range now 039–069); Total 61 → 69.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 59 → 69; Not Implemented 33 → 43 (D039–069); P1 gap items 29 → 37. (The table also absorbs the previously-unsynced D060/D061 totals; D060/D061 detailed entries remain pending the next fitness gap sync.)
  - Extended the summary note to record D062–D069 under P1 and the D060/D061 count reconciliation.
  - Added **P1 gap entries** for D062, D063, D064, D065, D066, D067, D068, D069.

- **`docs/BFG_UI_RULES.md`**
  - **§15 — Home composition:** added a note that **Home is the stage for the Evolution Animation** (D069), as a transient milestone moment; the §15 composition itself is unchanged.
  - **§16 — Activity composition:** added the **Exercise Count vs Step Count** clarification (D068).
  - **§18 — Workout session screens & flow (new):** session flow + swipe navigation (D063), Start Screen (D062), single-exercise Step layout (D064), superset Step layout (D065, with the §1/§13 reconciliation note), Finish Screen (D066), Result Banner (D067), and the Evolution Reveal flow (D069).

## Files added

- **`docs/CHANGELOG_WORKOUT_SESSION_ARCHITECTURE_D062-D069.md`** (this file).

## Files reviewed, not changed

- **`WORKOUT_CONTENT_GUIDE.md`** — reviewed per the task. D062–D069 are session-UX / layout / reward-flow decisions; they do not change the content-authoring model. §13 already documents the Program → Workout Template → Workout Step → Exercise authoring model (D060/D061), including that a superset is a two-exercise Step. No direct cross-reference is required, so the guide was not modified.

---

## Documentation conflicts discovered

1. **Gaps table was lagging the registry (resolved).** Before this sync the `BFG_PRODUCT_GAPS.md` summary table still read Total 59 / Not Implemented 33 (D039–059) while the registry already held D060/D061 (Total 61). The table is now reconciled to Total 69 / Not Implemented 43 (D039–069); D060/D061 remain counted with detailed gap entries deferred (as previously noted).
2. **Open item closed — card count ambiguity.** The Activity architecture review flagged that "Exercise Count" (D045/D055) was undefined under the Workout Step model (D060). **D068 resolves it**: the card counts exercises, the Start Screen lists Steps.
3. **One UI reconciliation, not a contradiction (D065).** The accepted **horizontal two-card superset layout with vertical-orientation videos** must be validated at mobile width against `BFG_UI_RULES.md §1` (mobile-first 360–430px) and the §13 "no carousels where a list would do" guidance. Both exercise cards are shown simultaneously (not a scrolling carousel), and portrait video is chosen to fit the two-up layout. Recorded as a §1/§13 follow-up in §18 and the Contradictions note — not a contradiction.
4. **No other conflicts.** D069's use of Home as the evolution stage is consistent with Home as the emotional center (D002/D007/D039) and the evolution-as-milestone moment (D035); non-evolution completions return to Activity, so only the milestone redirects. D062/D066 metric-light surfaces are consistent with D040/D045. D067's rare companion reaction is consistent with the frequency governor (D037).

---

## Follow-up documentation required

1. **D065 mobile-layout reconciliation** — confirm the horizontal two-card superset against §1/§13 in the next `BFG_UI_RULES.md §1/§4` pass (carried alongside the existing D054 orange/green palette reconciliation).
2. **D067 Result Banner ↔ reward systems** — when Currency (D034) and the stage celebration moment (D035) are specified for build, confirm the "Stage → Level → XP" banner ordering accommodates a Currency line; the registry records the changes-only philosophy, not the full reward set.
3. **D060/D061 detailed gap entries** — still pending the next fitness gap sync (unchanged); the count table now reflects them.
4. **Still pending from prior syncs (unchanged):** detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038**; the **§4 palette pass** (D054 orange/green); `WORKOUT_CONTENT_GUIDE.md` / `WORKOUT_AUTHORING.md` rewrite to the target model at implementation time; add new decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
