# BFG Product Gaps

Gap analysis between accepted product decisions and current implementation, as of 2026-06-12 (post P0A/P0B economy rebalance and data reset).

This document is NOT a roadmap and NOT a decision registry. It answers: what has been decided, what is implemented, what is missing, what contradicts accepted decisions, and what should be prioritized next.

Authoritative source of truth: `BFG_PRODUCT_DECISIONS.md`. Where any other document conflicts with the registry, the conflict is recorded under Documentation Drift, not treated as an active decision.

---

## Summary

| Metric | Count |
|---|---|
| Total accepted decisions | 39 |
| Implemented | 17 (D001, 010, 011, 012, 013, 015, 017, 018, 019, 020, 021, 023, 029, 030, 031, 032, 033) |
| Partially Implemented | 9 (D002, 007, 009, 016, 022, 035, 036, 037, 038) |
| Not Implemented | 13 (D003–006, 008, 014, 024–028, 034, 039) |

Gap items below: P0 = 0 (economy unit resolved 2026-06-12), P1 = 11, P2 = 7. (D002 is folded into the D007 entry; fully implemented decisions produce no gap items.) Note: Decisions 036–038 (Presence Response System) and Decision 039 (Home composition) were accepted after the prior gap pass; the D039 Home gap is captured under P1 below, and detailed gap entries for D036–D038 are pending the next gap sync.

---

## P0 Gaps

**None open.** The progression economy unit (D010–D013, D015, D017–D020, D033) was implemented in two PRs and verified:

- **P0A** (pure rebalance): workout = 10 XP, flat 50 XP levels capped at 100, 10-stage square evolution ladder, supportive 5-quest catalog with categories, dead XP constants removed. Loop review: PASS.
- **P0B** (selection layer): deterministic 3-per-day quest selection, category de-duplication, server-side claim validation. Loop review: PASS.
- **Data reset**: profiles XP/level, avatar state, and completion tables reset to the new economy scale.

D016 carries a residual content item (per-difficulty quest XP values) — tracked in P1 below.

---

## P1 Gaps

Important, not blocking: the app functions today, but these are accepted product direction and several are M1-adjacent.

### D007 — Home screen is the living animated Presence (includes D002 — presence centrality)
- Current status: Partially Implemented
- Current implementation: static stage-colored SVG avatar + companion phrase on dashboard
- Missing work: living/animated presence treatment (calm, < 600ms moments, `prefers-reduced-motion` respected)
- Recommended priority: P1 — the emotional core; overlaps the M1 must-ship evolution animation

### D035 — Evolution Stage rewards (celebration moment + Presence reaction)
- Current status: Partially Implemented
- Current implementation: stage change updates avatar color scheme only; no celebration moment; no Currency
- Missing work: dedicated stage celebration moment within UI tone rules; Presence reaction wiring. The Currency component waits for D034 (P2)
- Recommended priority: P1 — the evolution moment is already an M1 must-ship

### D009 — Levels = small visual changes; Stages = major
- Current status: Partially Implemented
- Current implementation: stage color change only; levels produce no visual change
- Missing work: per-level small visual variation; visually distinct stage forms beyond color
- Recommended priority: P1 — required for the two-register reward rhythm to be felt

### D008 — Progress screen block hierarchy (with pre-Legend placeholder)
- Current status: Not Implemented
- Current implementation: `/progress` shows XP bar, streak panel, evolution block in legacy order
- Missing work: restructure into Primary (Presence / Evolution / Legend with "Path is still forming" placeholder), Secondary (Level / XP / Streak), Additional (History / Statistics)
- Recommended priority: P1 — depends on navigation merge (D005) to avoid restructuring twice

### D003 — Bottom navigation: Workouts / Nutrition / Home / Progress / Multimedia
- Current status: Not Implemented
- Current implementation: `app/components/dashboard/bottom-nav.tsx` serves Главная / Тренировки / Аватар / Прогресс / Профиль
- Missing work: new five-tab structure; Nutrition and Multimedia may ship as placeholder/disabled/coming-soon (accepted)
- Recommended priority: P1 — do as one navigation unit with D004–D006

### D004 — Quests move into Workouts/Activity area
- Current status: Not Implemented
- Current implementation: standalone `/quests` route
- Missing work: relocate quest surface into the Workouts area; retire the standalone destination
- Recommended priority: P1 — navigation unit

### D005 — Progress merges Avatar + Progress + Profile
- Current status: Not Implemented
- Current implementation: three separate routes (`/avatar`, `/progress`, `/profile`)
- Missing work: single Progress surface absorbing all three
- Recommended priority: P1 — navigation unit; prerequisite for D008

### D006 — Profile becomes a small header button
- Current status: Not Implemented
- Current implementation: Профиль is a bottom-nav tab
- Missing work: header button entry point for account/subscription
- Recommended priority: P1 — navigation unit

### D014 — Level 1 → 2 onboarding milestone
- Current status: Not Implemented
- Current implementation: nothing special on first level-up; `MILESTONE` constant unwired
- Missing work: special first-level-up moment so the first progression event lands in the first session(s) under the flat 50 XP curve
- Recommended priority: P1 — directly targets the beginner week-1 dead zone identified in Phase 3 simulations

### D016 — Per-difficulty quest XP values (residual content item)
- Current status: Partially Implemented
- Current implementation: catalog-driven quest XP inside the approved 3–5 band, temporary uniform 4 XP; three quests carry DRAFT Russian copy
- Missing work: approve per-difficulty values (3–5) and final quest copy; one-line-per-quest catalog change. Related pending approval: final stage names/auras/flavor for stages 2–10 (D010 placeholder labels)
- Recommended priority: P1 — content approvals, no code architecture work

### D039 — Home Concept Candidate A (approved Home composition)
- Current status: Not Implemented
- Current implementation: dashboard shows a static stage-colored avatar + companion phrase; no living Presence, no rings, no Stage Block, no "Continue Journey" CTA
- Missing work: living Presence in the visual center (overlaps the D007/D035 M1 living-Presence work), inner Level Progress ring, outer Weekly Progress ring, Stage Block (Stage Title + Stage Number) under the Presence, "Continue Journey" primary CTA. Home shows simplified progress only — detailed stats stay on Progress (D008). Presence Voice placement on Home is intentionally deferred (D036–037). The Weekly Progress presentation must honor the no-shame rule (D031)
- Recommended priority: P1 — defines the MVP Home surface; overlaps M1 living-Presence and evolution work, and the D003–D008 navigation/Progress unit

---

## P2 Gaps

Future systems and long-term work. None are MVP-blocking; all are post-Stage-10-relevant or post-MVP per roadmap.

### D034 — Currency (global progression system)
- Current status: Not Implemented
- Current implementation: none
- Missing work: currency balance, earn hooks (stages, streaks/long-term activity, achievements), personalization-only spending
- Recommended priority: P2 — first P2 to build, since D022 and D035 both reference it

### D024 — Energy (hidden reflection system)
- Current status: Not Implemented
- Current implementation: none
- Missing work: hidden internal resource affecting aura/animation/companion behavior; hard wall against progression
- Recommended priority: P2

### D022 — Streak rewards: Energy / Currency (emotional feedback exists)
- Current status: Partially Implemented
- Current implementation: companion streak-milestone phrases work today
- Missing work: Energy and Currency grant paths once D024/D034 exist
- Recommended priority: P2 — feedback half already live

### D025 — Horizontal progression after Stage 10
- Current status: Not Implemented
- Current implementation: none
- Missing work: post-level-100 progression layer
- Recommended priority: P2 — needed before the first cohort approaches level 81 (Stage 9→10 is the longest gap; pre-endgame churn window)

### D026 — Endgame content set
- Current status: Not Implemented
- Current implementation: catalog-only cosmetics preview exists
- Missing work: Achievement Constellations, Avatar History, expanded cosmetics/currency uses
- Recommended priority: P2

### D027 — Legends (system-assigned, evolving)
- Current status: Not Implemented
- Current implementation: none
- Missing work: long-term behavior analysis and assignment; never user-selected; never permanent
- Recommended priority: P2 — the D008 placeholder ships first and stands alone

### D028 — Loyalty rewards (independent of Stage 10)
- Current status: Not Implemented
- Current implementation: none
- Missing work: long-term-activity tracking; subscription-benefit rewards (principle only, no hardcoded thresholds)
- Recommended priority: P2 — naturally follows M3 (payments)

---

## Documentation Drift

Documents that no longer match accepted decisions. Per the registry's rule, the registry wins.

**Resolved by the 2026-06-12 sync pass:** `BFG_GAME_SYSTEMS.md` §2.2/§3.1/§4.2/§5.2/§6.2, `BFG_MVP_SCOPE.md` §2.2/§6, `BFG_SECURITY.md` §8, `CURRENT_STATE.md`, `MVP_STATUS.md` — all now describe the implemented 10/4-XP economy, flat-50 curve with level-100 cap, 10-stage square ladder, and the 3-per-day quest selection.

**Remaining:**

1. **`CURRENT_PRIORITIES.md` Phase 3** — names `BFG_PROGRESSION_ECONOMY.md` as the deliverable; the accepted economy lives in `BFG_PRODUCT_DECISIONS.md` (D012–D020) and is now implemented. The roadmap also has no milestone hosting the navigation redesign (D003–D006) or endgame systems (D025–D028). Update the deliverable pointer and place the new work in milestones.

Documentation drift count: 1 open (5 resolved).

---

## Code Drift

Code that contradicts accepted decisions. Confirmed by direct inspection; no speculation.

**Resolved by P0A/P0B (2026-06-12):** `lib/quests/daily-quests.ts`, `lib/progression/xp-rewards.ts`, `lib/progression/levels.ts`, `lib/progression/avatar-evolution.ts` — all now match D010–D020/D033.

**Remaining:**

1. **`app/components/dashboard/bottom-nav.tsx`** — tab set Главная / Тренировки / Аватар / Прогресс / Профиль (D003 says Workouts / Nutrition / Home / Progress / Multimedia; D005 merges Avatar into Progress; D006 moves Profile to a header button). Tracked as the P1 navigation unit.
2. **`lib/cosmetics/get-unlocked.ts` / `lib/cosmetics/catalog.ts`** (informational, found in P0A review) — stage input clamped to `min(5, …)` and unlock thresholds (`minLevel` 3/7/12/20/30, `minStage` 1–5) tuned to the old curve/ladder. No crash and no wrong unlock today; needs retuning with the D009 visuals pass.

Code drift count: 1 contradiction + 1 informational (4 resolved).

---

## Recommended Next Steps

Ordered by alignment value, MVP impact, and implementation risk (lowest-risk first within each step). Steps 1–2 of the original sequence (economy code unit, doc sync) completed 2026-06-12.

1. **Content approvals closing the economy unit.** Per-difficulty quest XP values (D016 residual), final Russian quest copy, and stage 2–10 names/auras/flavor (D010 placeholders). All one-line-per-entry catalog/ladder changes once approved.
2. **M1 emotional must-ships under the new model.** Stage celebration moment + Presence reaction (D035, already an M1 item), first-level-up onboarding milestone (D014), stage visual distinctness and per-level variation as art allows (D009) — including the cosmetics clamp/threshold retune noted under Code Drift.
3. **Navigation unit (D003–D006), then Progress screen (D008).** One coordinated UX change: new tab structure with Nutrition/Multimedia placeholders, quests folded into Workouts, Avatar+Profile merged into Progress, profile header button — then the three-block Progress hierarchy with the pre-Legend placeholder. Doing D008 after D005 avoids restructuring the screen twice.
4. **Quest catalog content growth.** Additional categorized quests on top of the selection layer (catalog = pool; surface stays 3/day).
5. **P2 systems in dependency order, post-MVP per roadmap.** Currency (D034) first since D022 and D035 reference it, then Energy (D024), then endgame layer (D025–D028) — with D025 scheduled to exist before the first cohort approaches level 81.
6. **`CURRENT_PRIORITIES.md` pointer fix** (remaining doc-drift item) — next time that file is touched.

