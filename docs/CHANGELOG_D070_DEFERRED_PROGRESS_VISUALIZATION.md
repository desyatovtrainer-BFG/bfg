# Changelog — D070 Deferred Progress Visualization + D067/D069 finalization + first Wireframe Layer

Date: 2026-06-23
Scope: Product-decision registry + UI rules + gap analysis + first official screen-wireframe document. Documentation only — no code, schema, or migrations.

---

## Summary

Three approved updates were synced into the documentation set:

1. **Decision 067 — Workout Reward Modal (final version).** The interim "Result Banner" presentation is finalized as a **modal window over a dimmed background** (not a screen, not a bottom banner, not a toast). It shows only the values that changed, in order **Stage → Level → XP**. **No Stage growth →** a single **Return To Activity** button. **Stage growth →** no button, **5–7s auto-advance to Home**, **tap to speed up** (never skip the Evolution Animation).
2. **Decision 069 — Evolution Flow (final version).** Destination logic unchanged (Stage Evolution overrides the destination and routes to Home regardless of trigger; normal workout completion → Activity, normal quest completion stays on Activity). Now references the **Reward Modal** and makes explicit that the **transformation is unskippable** — a tap may accelerate the transition to Home but can never skip the Evolution Animation.
3. **Decision 070 — Deferred Progress Visualization (new decision).** After any progression change, the system persists the **last visually-shown state per progress surface separately** (not an "unviewed XP" flag), so the user always sees the indicators **move**. Memory is **per-screen and independent**: **Home** (Level Progress + Activity Progress ring) and **Progress** (XP / Level / Stage / other) animate last-seen → current and clear independently; viewing one surface never clears the other's memory.

It also delivers the **first official Wireframe Layer document** (`docs/ui/BFG_SCREEN_WIREFRAMES.md`) for a first slice of screens.

No new product direction was invented; D067/D069 were finalized as approved, D070 was added as approved, and the wireframes restate accepted decisions only.

---

## Files added

- **`docs/ui/BFG_SCREEN_WIREFRAMES.md`** — first official Wireframe Layer document. Covers Activity, Workout Start Screen, Single Exercise Step, Superset Step, Workout Finish Screen, Reward Modal, and Evolution Flow. Each screen documents Goal, top-to-bottom composition, primary visual accent, secondary element, the user action, and the destination after the action. Built only from accepted decisions (D031, D035, D039, D042–D069 as relevant, D070).
- **`docs/CHANGELOG_D070_DEFERRED_PROGRESS_VISUALIZATION.md`** — this file.

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - **D067** retitled "Workout Result Banner" → "Workout Reward Modal"; Decision text rewritten to the final modal-over-dimmed-background spec with the no-Stage-growth / Stage-growth behavior split; dated update note added; Related Documents now include D070.
  - **D069** Decision text updated: "Result Banner" → "Reward Modal" in the flow lines; new explicit "Rules (final version)" block (absolute priority, unskippable transformation, tap-speeds-up-never-skips); dated update note added; Related Documents now include D070.
  - **D070 added** as a full decision entry (Deferred Progress Visualization) after D069.
  - Implementation summary table: Not Implemented 43 → 44 (range 039–069 → 039–070); Total decisions 69 → 70.
  - Registry Notes: D062–069 note paragraph updated for the D067 modal wording; new paragraphs added recording the D067/D069 finalization and the D070 acceptance.

- **`docs/BFG_UI_RULES.md`**
  - **§18** "Workout Result Banner" bullet → "Workout Reward Modal" (modal/dimmed background, behavior split, tap-to-speed-up-never-skip); Evolution Reveal flow bullet updated to reference the Reward Modal and the unskippable-transformation rule.
  - **§15** new bullet: Home owns its own progress-visualization memory (Level Progress + Activity Progress ring), animates last-seen → current then clears, independent of Progress; cross-references §19.
  - **§19 added** — "Deferred progress visualization (Decision 070)": persist last-shown state per surface (not "unviewed XP"); animate last-seen → current then clear; per-screen independent memory (Home vs Progress); required scenarios; tone guard; relation to the Reward Modal / Evolution flow.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Summary counts: Total 69 → 70; Not Implemented 43 → 44 (range 039–069 → 039–070).
  - **D067** gap entry retitled to "Workout Reward Modal (finalized 2026-06-23)" with updated missing-work text (modal + behavior split).
  - **D069** gap entry retitled "(finalized 2026-06-23)" with updated missing-work text (Reward Modal + unskippable transformation).
  - **D070** gap entry added under P1 (Deferred Progress Visualization).

---

## Sections changed (exact)

- `BFG_PRODUCT_DECISIONS.md` — Decision 067 (full block), Decision 069 (Decision/Reason/Related blocks), new Decision 070 block, "Implementation summary" table + "Total decisions" line, Registry Notes (D062–069 paragraph + two new paragraphs).
- `BFG_UI_RULES.md` — §15 (new bullet), §18 (reward + evolution bullets), new §19 (full section).
- `BFG_PRODUCT_GAPS.md` — Summary counts table, D067 entry, D069 entry, new D070 entry.

---

## Documentation conflicts discovered

1. **"Result Banner" vs "Reward Modal" terminology.** The interim term "Result Banner" appeared in D067, D069, §18, and the gap entries. Resolved by finalizing D067 to "Reward Modal" and updating all four locations; a note states that any remaining "Result Banner" reference means the Reward Modal.
2. **No prior UI-rules home for the Progress screen.** `BFG_UI_RULES.md` had sections for Home (§15), Activity (§16), pre-start (§17), session (§18) but none governing the Progress screen or cross-screen progress animation. D070's Progress-side rule had no host section. Resolved by adding a dedicated §19 that governs the cross-screen visualization memory (Home + Progress), keeping the Progress screen's block hierarchy itself with D008.
3. **No structural conflict with the fitness architecture.** D067/D069/D070 are presentation/visualization decisions and do not touch the Exercise Library (D041), Workout Step (D060), Program (D061), or Workout Tracking architecture; those documents were reviewed and required no change.

No unresolved contradictions were introduced (registry remains "Contradictions: 0 unresolved").

---

## Follow-up documentation (not performed here)

1. Detailed gap entries for D060/D061 and the D036–D041 backlog still pending the next fitness/registry gap sync (pre-existing item, unchanged by this task).
2. The §4 palette reconciliation (orange/green Activity card accents) and the §1/§13 reconciliation (D065 horizontal superset layout at mobile width) remain open follow-ups (pre-existing).
3. Extend `docs/ui/BFG_SCREEN_WIREFRAMES.md` to the remaining screens (Home, Progress, the per-state Activity variants, the Reward Modal value variants) in a later wireframe pass; the current document is the first official slice only.
4. When the Progress screen hierarchy (D008) is designed, confirm exactly which progression elements participate in the §19 Progress memory (XP / Level / Stage and any additional elements).
