# BFG Product Gaps

Gap analysis between accepted product decisions and current implementation, as of 2026-06-10.

This document is NOT a roadmap and NOT a decision registry. It answers: what has been decided, what is implemented, what is missing, what contradicts accepted decisions, and what should be prioritized next.

Authoritative source of truth: `BFG_PRODUCT_DECISIONS.md`. Where any other document conflicts with the registry, the conflict is recorded under Documentation Drift, not treated as an active decision.

---

## Summary

| Metric | Count |
|---|---|
| Total accepted decisions | 35 |
| Implemented | 7 (D001, 021, 023, 029, 030, 031, 032) |
| Partially Implemented | 5 (D002, 007, 009, 022, 035) |
| Not Implemented | 23 (D003–006, 008, 010–020, 024–028, 033, 034) |

Gap items below: P0 = 10, P1 = 10, P2 = 7. (D002 is folded into the D007 entry; the 7 implemented decisions produce no gap items.)

---

## P0 Gaps

Critical: live code actively contradicts accepted decisions, or the accepted economy cannot function without the item. These form one coherent implementation unit (the progression economy rebalance).

### D015 — Workout = 10 XP
- Current status: Not Implemented
- Current implementation: `WORKOUT_COMPLETE: 100` in `lib/progression/xp-rewards.ts`
- Missing work: change constant to 10
- Recommended priority: P0 — anchor value of the entire accepted economy

### D016 — Quest = 3–5 XP by difficulty
- Current status: Not Implemented
- Current implementation: `DAILY_QUEST: 50` flat in `lib/progression/xp-rewards.ts`; catalog cards display 40–140 XP
- Missing work: per-difficulty quest XP (3–5) on the server path; catalog display values aligned to server truth
- Recommended priority: P0 — current values invert training primacy (D020)

### D013 — Flat level cost: 50 XP
- Current status: Not Implemented
- Current implementation: rising curve `100 + 50·(n−1)` in `lib/progression/levels.ts`
- Missing work: replace `xpRequiredForLevel` with flat 50 XP per level; `calculateLevel` / `getLevelProgress` API unchanged
- Recommended priority: P0 — every other pacing decision is computed on top of it

### D012 — 100 vertical levels
- Current status: Not Implemented
- Current implementation: no level cap (guard at 999) in `lib/progression/levels.ts`
- Missing work: cap vertical levels at 100; define post-100 XP behavior (XP may continue accruing for horizontal systems later, but level display stops at 100)
- Recommended priority: P0 — part of the same curve change as D013

### D010 — Ten evolution stages, Stage 10 final
- Current status: Not Implemented
- Current implementation: 5-stage ladder in `lib/progression/avatar-evolution.ts` (thresholds 1/5/10/20/35)
- Missing work: 10-entry ladder data; forms/auras/labels for stages 6–10; `glowIntensity` scale decision (1..10 or reuse)
- Recommended priority: P0 for the ladder data (pure function, pacing depends on it); distinct stage *art* may land progressively (tracked under D009/P1)

### D011 — Square stage thresholds (1, 4, 9, … 100)
- Current status: Not Implemented
- Current implementation: thresholds 1/5/10/20/35
- Missing work: same change as D010 — thresholds become n²
- Recommended priority: P0 — same edit as D010

### D018 — Workout Quest removed
- Current status: Not Implemented
- Current implementation: quest `workout` (140 XP) still in `lib/quests/daily-quests.ts`
- Missing work: delete from catalog
- Recommended priority: P0 — active double-dipping with `WORKOUT_COMPLETE`, the most distorting single item in the live economy

### D019 — Streak Quest removed
- Current status: Not Implemented
- Current implementation: quest `streak` (50 XP) still in `lib/quests/daily-quests.ts`
- Missing work: delete from catalog
- Recommended priority: P0 — pays XP for streak-holding, contradicting the *implemented* D021 ("streak never grants XP") through the quest side door

### D017 — Three daily quests from the catalog
- Current status: Not Implemented
- Current implementation: 4 quests, all claimable daily; no selection layer
- Missing work: daily selection of 3 from the catalog (deterministic per user/day is sufficient); claim path rejects non-selected quests
- Recommended priority: P0 — the bound that keeps quest aggregation from breaking training primacy (verified in Phase 3 simulations)

### D020 — Training is the primary progression source
- Current status: Not Implemented (violated by current numbers)
- Current implementation: max daily quest XP (290) ≈ 3× workout XP (100)
- Missing work: none of its own — fully satisfied by D015 + D016 + D017 + D018 + D019 landing together
- Recommended priority: P0 — acceptance criterion for the economy unit, not a separate task

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

### D033 — Quest categories, no same-category duplication per day
- Current status: Not Implemented
- Current implementation: flat 4-quest list, no category field, no selection logic
- Missing work: category field on quest templates; selection rule avoiding same-category duplicates; catalog content (≥5 quests across categories — M1 checklist)
- Recommended priority: P1 — implement together with D017's selection layer to avoid building selection twice

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

Documents that no longer match accepted decisions. Per the registry's rule, the registry wins; these need a sync pass when the corresponding implementation lands (or sooner, to stop misleading readers).

1. **`BFG_GAME_SYSTEMS.md` §2.2** — XP table says workout 100 / quest 50 / milestone 75. Accepted: D015 (10), D016 (3–5), milestone value TBD with D014. Sync with the economy implementation.
2. **`BFG_GAME_SYSTEMS.md` §3.1** — level curve documented as `100·n + 25·n·(n−1)` with rising costs. Accepted: D012/D013 (100 levels, flat 50). Sync with the curve change.
3. **`BFG_GAME_SYSTEMS.md` §5.2** — 5-stage ladder, thresholds 1/5/10/20/35, "intentionally short". Accepted: D010/D011 (10 stages, squares). Sync with the ladder change.
4. **`BFG_MVP_SCOPE.md` §6 and `MVP_STATUS.md` (M1 checklists)** — "5-stage avatar evolution visually distinct" and "≥5 daily quests in catalog". Accepted: D010 (10 stages) and D017 (catalog ≥5, daily surface = 3 — the registry's Quest Architecture note reconciles the counts, but the checklist wording should say "catalog"). Update acceptance criteria text.
5. **`CURRENT_STATE.md` and `MVP_STATUS.md` (progression sections)** — accurately describe the pre-rebalance code, which is their job, but they will be stale the moment the economy lands. Scheduled sync, post-implementation.
6. **`CURRENT_PRIORITIES.md` Phase 3** — names `BFG_PROGRESSION_ECONOMY.md` as the deliverable. The accepted economy now lives in `BFG_PRODUCT_DECISIONS.md` (D012–D020); the roadmap also has no milestone hosting the navigation redesign (D003–D006) or endgame systems (D025–D028). Update the deliverable pointer and place the new work in milestones.

Documentation drift count: 6.

---

## Code Drift

Code that contradicts accepted decisions. Confirmed by direct inspection this session; no speculation.

1. **`lib/quests/daily-quests.ts`** — contains the `workout` quest (140 XP — violates D018, and at 140 XP a quest out-pays a workout, violating D016/D020) and the `streak` quest (50 XP — violates D019 and the spirit of implemented D021). Catalog `rewards.xp` values (140/60/50/40) also diverge from the server's flat `DAILY_QUEST: 50` — display lies about server truth.
2. **`lib/progression/xp-rewards.ts`** — `WORKOUT_COMPLETE: 100` (D015 says 10), `DAILY_QUEST: 50` (D016 says 3–5), plus dead constants `DAILY_LOGIN` and `STREAK_BONUS` whose removal is the accepted cleanup for D021/D023.
3. **`lib/progression/levels.ts`** — rising per-level cost (D013 says flat 50), no 100-level cap (D012).
4. **`lib/progression/avatar-evolution.ts`** — 5-stage ladder with thresholds 1/5/10/20/35 (D010/D011 say 10 stages at square levels).
5. **`app/components/dashboard/bottom-nav.tsx`** — tab set Главная / Тренировки / Аватар / Прогресс / Профиль (D003 says Workouts / Nutrition / Home / Progress / Multimedia; D005 merges Avatar into Progress; D006 moves Profile to a header button).

Code drift count: 5 files.

---

## Recommended Next Steps

Ordered by alignment value, MVP impact, and implementation risk (lowest-risk first within each step).

1. **Economy rebalance code unit (P0, one PR-sized change).** `xp-rewards.ts` (10 / 3–5, delete dead constants), `levels.ts` (flat 50, cap 100), `avatar-evolution.ts` (10-stage square ladder data), `daily-quests.ts` (remove workout + streak quests, align XP values, add category field + 3-per-day selection for D017/D033). All pure functions and constants — lowest-risk, highest-alignment change available. Includes one data decision that needs explicit confirmation: existing `profiles.xp` rows are on the old scale and must be reset or recomputed (pre-launch, reset is simplest), with the corresponding `avatars` rows reconciled.
2. **Doc sync pass.** Apply Documentation Drift items 1–4 and 6 in the same change window as step 1 so no document misleads (item 5 follows automatically).
3. **M1 emotional must-ships under the new model.** Stage celebration moment + Presence reaction (D035, already an M1 item), first-level-up onboarding milestone (D014), stage visual distinctness and per-level variation as art allows (D009).
4. **Navigation unit (D003–D006), then Progress screen (D008).** One coordinated UX change: new tab structure with Nutrition/Multimedia placeholders, quests folded into Workouts, Avatar+Profile merged into Progress, profile header button — then the three-block Progress hierarchy with the pre-Legend placeholder. Doing D008 after D005 avoids restructuring the screen twice.
5. **Quest catalog content growth.** ≥5 categorized quests (M1 checklist) on top of the step-1 selection layer.
6. **P2 systems in dependency order, post-MVP per roadmap.** Currency (D034) first since D022 and D035 reference it, then Energy (D024), then endgame layer (D025–D028) — with D025 scheduled to exist before the first cohort approaches level 81.

