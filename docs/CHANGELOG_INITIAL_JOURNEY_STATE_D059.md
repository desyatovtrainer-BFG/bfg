# Changelog — D059 Initial Journey State (approved)

Date: 2026-06-20
Scope: Workout journey initial-state model. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decision 059 — Initial Journey State (MVP)** as Accepted. It resolves the zero-completion initial-state item left open by the journey/cycle model (Decision 046), which defined the "next workout" transition only *after* a completion (Decision 057) and so left a brand-new user with no defined pointer value, Upcoming marker, or Continue Journey target.

- For a brand-new user — **no workout ever completed** and **none currently In Progress** — the system initializes the journey pointer to **Workout 1**.
- **Activity behavior:** Workout 1 receives the **Upcoming** state — Upcoming marker + orange outline (Decisions 054, 057). No other workout carries a marker (one special state at a time).
- **Home behavior:** "Continue Journey" (Decision 043) resolves to **Workout 1**.
- **Transition:** after the first completed workout (Start Workout → Finish Workout, Decisions 049, 050), the Workout Journey Architecture (Decision 046) becomes authoritative and all future navigation follows the normal repeating cycle (e.g. 1 → 2 → 3 → 1, or 1 → 2 → 3 → 4 → 5 → 1, depending on program size), with the pointer advancing from the workout actually completed (Decision 051).

D059 **extends D043, D046, and D057** and **does not modify D058 (Active Workout Exclusivity Model)**. It introduces no workout expiration, cancellation, reset, or automatic session recovery; started workouts continue to follow Decision 058. It introduces no contradictions.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decision 059** (Accepted, Fitness System): initial-pointer = Workout 1, Workout 1 Upcoming on Activity, Continue Journey → Workout 1, hand-off to D046 after first completion, with Decision / Reason / Implementation Status (Not Implemented) / Related Documents.
  - Cross-references: **D043** Related Documents → `+059 (initial state)`; **D046** Related Documents → `+059`; **D057** Related Documents → `+059`.
  - Added a **Contradictions** line recording D059 as a non-contradicting extension (still 0 unresolved; explicitly does not modify D058).
  - Added a **D059 acceptance note** under Implementation summary.
  - Updated Implementation Summary: Not Implemented 32 → 33 (+059, range now 039–059); Total 58 → 59.

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts: Total 58 → 59; Not Implemented 32 → 33 (D039–059); P1 gap items 28 → 29.
  - Extended the "captured under P1" note to include D059.
  - Added a **P1 gap entry** for D059.

- **`docs/BFG_UI_RULES.md`**
  - Extended **§16 — Activity composition** with the initial-journey-state rule (D059): Workout 1 is Upcoming for a brand-new user. Home (§15) and Presence rules were **not** modified.

## Files added

- **`docs/CHANGELOG_INITIAL_JOURNEY_STATE_D059.md`** (this file).

---

## Documentation conflicts discovered

1. **Open follow-up now closed.** The Activity architecture review flagged the zero-completion initial state (undefined pointer, marker, and Continue Journey target) as an open item. D059 resolves it; no prior registry note required correction (the item had not been written into the registry as a decision).
2. **No new conflicts.** D059 is consistent with D043 (Continue Journey routing), D046/D051 (cycle + pointer), D054/D057 (card state + marker priority), and D058 (single active workout — explicitly unmodified). The "Workout 1 Upcoming" initial render is the natural N=any base case of the D057 transition rule.
3. **D058 boundary preserved.** D059 deliberately adds no expiration / cancellation / reset / recovery mechanic, so the "no cancellation system" intent of D058 stays intact. The separate abandoned-In-Progress-session question (raised in the Activity architecture review) remains open and is **not** addressed here.

---

## Follow-up documentation required

1. **Implementation-time detail** (not a registry decision): how the journey pointer is persisted per user/program and how its initial (pre-first-completion) value is represented in storage.
2. **Still open from the Activity architecture review (not addressed by D059):** the abandoned / stale **In Progress** session recovery question (no cancel per D058, no expiry) and program-mutation semantics — candidates for a future decision if pursued.
3. **Still pending from prior syncs (unchanged):** the **§4 palette pass** for the D054 orange/green accents; detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** and **D040–D041**; a possible `docs/fitness/BFG_WORKOUT_JOURNEY_ARCHITECTURE.md` spec (D046); `WORKOUT_CONTENT_GUIDE.md` rewrite for the Exercise Library (D041) and the D045/D048/D054/D055 card; add new decisions to `PROJECT_INDEX.md` / `SOURCE_OF_TRUTH.md` if those indexes are maintained.
