# BFG Product Gaps

Gap analysis between accepted product decisions and current implementation, as of 2026-06-12 (post P0A/P0B economy rebalance and data reset).

This document is NOT a roadmap and NOT a decision registry. It answers: what has been decided, what is implemented, what is missing, what contradicts accepted decisions, and what should be prioritized next.

Authoritative source of truth: `BFG_PRODUCT_DECISIONS.md`. Where any other document conflicts with the registry, the conflict is recorded under Documentation Drift, not treated as an active decision.

---

## Summary

| Metric | Count |
|---|---|
| Total accepted decisions | 74 |
| Implemented | 17 (D001, 010, 011, 012, 013, 015, 017, 018, 019, 020, 021, 023, 029, 030, 031, 032, 033) |
| Partially Implemented | 9 (D002, 007, 009, 016, 022, 035, 036, 037, 038) |
| Not Implemented | 48 (D003–006, 008, 014, 024–028, 034, 039–074) |

Gap items below: P0 = 0 (economy unit resolved 2026-06-12), P1 = 41, P2 = 7. (D002 is folded into the D007 entry; fully implemented decisions produce no gap items.) Note: Decisions 036–038 (Presence Response System) and Decision 039 (Home composition) were accepted after the prior gap pass; the D039 Home gap is captured under P1 below, and detailed gap entries for D036–D038 are pending the next gap sync. Decisions 040–041 (Workout Tracking Philosophy, Centralized Exercise Library) were also accepted after the prior gap pass and are counted as Not Implemented; their detailed gap entries are pending the next fitness gap sync. Decisions 042–045 (Activity Screen Architecture), Decision 046 (Workout Journey Architecture), and Decisions 047–053 (Activity / Workout-session UX), Decision 054 (Activity Visual Hierarchy), Decision 055 (Activity Screen Composition), Decisions 056–058 (Workout state architecture), and Decision 059 (Initial Journey State) are captured under P1 below. Decisions 060 (Workout Step Architecture) and 061 (Program Architecture) were accepted after the prior gap pass and are counted as Not Implemented; their detailed gap entries are pending the next fitness gap sync. For the workout content stack specifically, the current-vs-target gap (today's flat `workouts` / `workout_exercises` model vs the approved **Program → Workout Template → Workout Step → Exercise** hierarchy of D041/D060/D061) is tracked in the bridge document `docs/fitness/BFG_WORKOUT_MIGRATION_STATUS.md`; treat the current tables as temporary scaffolding when scoping new work. Decisions 062–069 (Workout Session Architecture — Start Screen, swipe navigation, single/superset Step layouts, Finish Screen, Result Banner, card count semantics, Evolution Reveal flow) were accepted 2026-06-22 and are captured under P1 below. (The count table above also absorbs the previously-unsynced D060/D061 totals; D060/D061 remain counted as Not Implemented with detailed gap entries still pending the next fitness gap sync.) Decision 070 (Deferred Progress Visualization) was accepted 2026-06-23 and Decision 071 (Final Home Product Structure) was accepted 2026-06-25, both after the prior gap pass; both are counted as Not Implemented and are captured under P1 below. D071 finalizes the Home composition opened by D039 and forms one Home unit with D039/D043/D070 (range across this document: D039–D071). Decisions 072 (Final Progress Product Structure) and 073 (Avatar Customization Entry & Interaction) were accepted 2026-06-26 and are counted as Not Implemented and captured under P1 below: D072 finalizes/refines the Progress hierarchy (D008) and completes the D005 merge (static identity portrait, Legend slot, Achievements in the Additional block, D070 Progress memory); D073 refines D071 by defining the Home Presence tap → Avatar Customization and the single shared avatar visual state (Home↔Progress visual parity). Decision 074 (Entry / Auth Start Screen) was accepted 2026-06-26 and is counted as Not Implemented and captured under P1 below: it is the first decision covering the **unauthenticated** surface (all prior screen decisions are post-auth) and is self-contained — the onboarding Seed Form interaction is governed separately by future onboarding decisions (none accepted yet). Full range across this document: D039–D074.

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

### D008 — Progress screen block hierarchy (with pre-Legend placeholder) — finalized/refined by D072
- Current status: Not Implemented
- Current implementation: `/progress` shows XP bar, streak panel, evolution block in legacy order
- Missing work: restructure into Primary (static identity portrait / Evolution / Legend with "Path is still forming" placeholder), Secondary (Level / XP / Streak / Stage position), Additional (History / Statistics / Achievements). **Now finalized and refined by D072** (Final Progress Product Structure): "Presence" on Progress is standardized as a **static, non-interactive identity portrait** (not a large render, not Home's living center), Achievements live inside the Additional block (MVP earned shelf → Post-MVP Constellations, D026), and the D070 Progress-memory participants are XP / Level / Stage — see the D072 entry below
- Recommended priority: P1 — depends on navigation merge (D005); build per D072 / BFG_UI_RULES §20

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

### D005 — Progress merges Avatar + Progress + Profile — structure resolved by D072/D073
- Current status: Not Implemented
- Current implementation: three separate routes (`/avatar`, `/progress`, `/profile`)
- Missing work: single Progress surface absorbing all three — **structure now resolved by D072** (static identity portrait absorbs the old `/avatar` surface; Profile reached via the small header button, D006) **and D073** (the absorbed Avatar surface's customization now enters from the Home Living Presence, not from Progress)
- Recommended priority: P1 — navigation unit; prerequisite for D008/D072

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

### D039 — Home Concept Candidate A (approved Home composition; finalized by D071)
- Current status: Not Implemented
- Current implementation: dashboard shows a static stage-colored avatar + companion phrase; no living Presence, no rings, no Stage Block, no "Continue Journey" CTA
- Missing work: living Presence in the visual center (overlaps the D007/D035 M1 living-Presence work), inner Level Progress ring, outer Weekly Progress ring, Stage Block (Stage Title + Stage Number) under the Presence, "Continue Journey" primary CTA. Home shows simplified progress only — detailed stats stay on Progress (D008). The Weekly Progress presentation must honor the no-shame rule (D031). **Now finalized/refined by D071** (Final Home Product Structure): the two rings are open arcs, the outer ring is "Weekly Activity Progress", and the previously-deferred Presence Voice placement (D036–037) is now resolved as an event-driven, non-permanent Voice Slot under the Stage Block — see the D071 entry below for the full final structure
- Recommended priority: P1 — defines the MVP Home surface (finalized by D071); overlaps M1 living-Presence and evolution work, and the D003–D008 navigation/Progress unit

### D042 — Activity Information Hierarchy
- Current status: Not Implemented
- Current implementation: standalone `/quests` route; no unified Activity surface
- Missing work: Activity surface presenting Assigned Workouts (primary) above Daily Quests (secondary), with quests never given workout-card weight; folds in the D004 quests-in-Workouts relocation
- Recommended priority: P1 — defines the MVP Activity surface; pairs with the D003–D006 navigation unit and D004

### D043 — Continue Journey Routing
- Current status: Not Implemented
- Current implementation: no "Continue Journey" CTA exists (D039 Not Implemented); no journey/sequence routing
- Missing work: route "Continue Journey" to the next assigned workout (Home = resume surface, Activity = browsing surface); journey/sequence model now specified by D046
- Recommended priority: P1 — overlaps the D039 Home build

### D046 — Workout Journey Architecture (MVP)
- Current status: Not Implemented
- Current implementation: no program/sequence/cycle model; no Continue Journey routing
- Missing work: count-agnostic program model, generic repeating workout cycle, and the Continue Journey resume order (unfinished workout first, else next in cycle); supplies the journey model D042/D043 depend on
- Recommended priority: P1 — prerequisite for the D043 routing and the D042 Activity surface

### D047 — Workout Accessibility Model
- Current status: Not Implemented
- Current implementation: flat `/workouts` catalog; no program/cycle surface
- Missing work: all workouts visible and manually accessible within the cycle — no locked/hidden workouts (consistent with D030)
- Recommended priority: P1 — Activity surface rule (pairs with D042, D046)

### D048 — Workout State Model
- Current status: Not Implemented
- Current implementation: no Activity workout cards exist (D045 Not Implemented)
- Missing work: at most one mutually exclusive card state marker — Upcoming Workout or Workout In Progress, never both
- Recommended priority: P1 — part of the Activity card composition (D045)

### D049 — Workout Start Boundary
- Current status: Not Implemented
- Current implementation: no workout session start/finish flow (D040 Not Implemented)
- Missing work: Start Workout as the sole start boundary; viewing is not starting
- Recommended priority: P1 — part of the workout-session build (D040)

### D050 — Workout Completion Boundary
- Current status: Not Implemented
- Current implementation: no start/finish flow; no journey cycle (D040, D046 Not Implemented)
- Missing work: completion only via Start → Finish; only completed workouts advance the cycle; no data recorded before start
- Recommended priority: P1 — part of the workout-session build and the journey pointer (D046, D051)

### D051 — Journey Pointer Logic
- Current status: Not Implemented
- Current implementation: no journey cycle/pointer (D046 Not Implemented)
- Missing work: advance the cycle pointer from the workout actually completed, even when the recommended order is broken
- Recommended priority: P1 — part of the journey cycle (D046)

### D052 — Workout Start Awareness Model
- Current status: Not Implemented
- Current implementation: no workout interface exists
- Missing work: persistent "not started" reminder throughout the pre-start workout interface (incl. during videos), content never blocked
- Recommended priority: P1 — part of the workout-interface build (D049); UI rule in BFG_UI_RULES.md §17

### D053 — Weight Logging Availability
- Current status: Not Implemented
- Current implementation: no workout session or exercise-screen weight field (D040, D044 Not Implemented)
- Missing work: hide weight fields before Start Workout, reveal after; no data recorded before start
- Recommended priority: P1 — part of the exercise-screen/weight build (D044)

### D054 — Activity Visual Hierarchy
- Current status: Not Implemented
- Current implementation: no Activity workout cards exist (D045, D048 Not Implemented)
- Missing work: equal-size workout cards (current never enlarged); emphasis via state/color/position only; outline colors — Default neutral/blue, Upcoming orange, In Progress green; one state per D048. Note: orange/green extend the §4 palette (sky/violet/rose/cyan) — pending §4 reconciliation
- Recommended priority: P1 — part of the Activity card composition (D045, D048)

### D055 — Activity Screen Composition
- Current status: Not Implemented
- Current implementation: no Activity surface; quests on a standalone `/quests` route, workouts on a flat `/workouts` catalog
- Missing work: "Activity"-only header (no date/Today/subtitle); two sections with visible headers (Workouts above Daily Quests); workout cards as a vertical list in fixed program order (no horizontal scroll, no reordering, position via state markers); card content Workout Number + Title + Exercise Count (extends D045); binary quest state (Completed / Not Completed only — no counters/percentages/progress bars)
- Recommended priority: P1 — defines the concrete Activity layout (extends D042/D045/D048/D054)

### D056 — Completed Workout Card State
- Current status: Not Implemented
- Current implementation: no Activity workout cards exist (D045, D048, D054 Not Implemented)
- Missing work: on completion, the card returns to Default (blue outline, no marker); no Completed/Finished state or dedicated color; completion history lives on Progress (D008)
- Recommended priority: P1 — part of the Activity card state model (D048, D054)

### D057 — Marker Priority Model
- Current status: Not Implemented
- Current implementation: no Activity workout list exists (D045, D048, D054 Not Implemented)
- Missing work: In Progress has absolute priority over Upcoming — while any workout is In Progress, no Upcoming marker/orange card appears anywhere; on completion the next becomes Upcoming
- Recommended priority: P1 — part of the Activity card state model (D048, D054)

### D058 — Active Workout Exclusivity Model
- Current status: Not Implemented
- Current implementation: no workout session start/finish flow (D040, D049, D050 Not Implemented)
- Missing work: only one workout In Progress at a time; users may leave/navigate/view freely but cannot start a second; other workouts show "Return To Workout" (not Start Workout), returning to the active session; no cancellation system
- Recommended priority: P1 — part of the workout-session flow (D049, D050); UI rule in BFG_UI_RULES.md §17

### D044 — Weight Logging Placement
- Current status: Not Implemented
- Current implementation: workout tracking and the exercise screen are not built (D040 Not Implemented)
- Missing work: optional weight field on the exercise screen only — not before/after the workout, not on Activity, not on workout cards; analytics-only, keyed to Exercise ID (D041)
- Recommended priority: P1 — part of the workout-session / exercise-screen build (D040)

### D045 — Workout Card Composition
- Current status: Not Implemented
- Current implementation: no workout cards of this composition; exercises embedded per workout today
- Missing work: minimal workout card showing Title + Exercise Count only; no previous results / analytics / categories / weight history / progress metrics
- Recommended priority: P1 — part of the Activity surface (D042)

### D059 — Initial Journey State
- Current status: Not Implemented
- Current implementation: no journey pointer, program/cycle model, or Continue Journey routing exists (D043, D046 Not Implemented)
- Missing work: initialize the journey pointer to Workout 1 when no workout has ever been completed and none is In Progress — Activity shows Workout 1 as Upcoming (orange outline + marker, D054/D057) and Continue Journey resolves to Workout 1 (D043); after the first completion the D046 cycle becomes authoritative (pointer advances per D051). Adds no expiration / cancellation / reset / session recovery — started workouts follow D058
- Recommended priority: P1 — first-render correctness for the Activity surface and Home resume (pairs with D046, D043)

### D062 — Workout Start Screen
- Current status: Not Implemented
- Current implementation: no workout session interface; `/workouts/[id]` renders per-exercise slides on the flat model
- Missing work: pre-start screen showing Workout Title + ordered Workout Step list; Start Workout / Return To Workout button (D058); no duration / difficulty / categories / analytics / companion content
- Recommended priority: P1 — part of the workout-session build (D040, D049)

### D063 — Workout Navigation
- Current status: Not Implemented
- Current implementation: no swipe-based session flow
- Missing work: swipe forward/backward only, no visible Next/Previous buttons; Start Screen → Steps → Finish Screen; swiping past the final Step opens the Finish Screen (D066)
- Recommended priority: P1 — part of the workout-session build (D060)

### D064 — Single Exercise Step Layout
- Current status: Not Implemented
- Current implementation: no Workout Step screen exists
- Missing work: vertical hierarchy Video → Title → Prescription (Sets, Reps/Duration) → optional Weight; video primary; weight hidden before Start, visible after (D053)
- Recommended priority: P1 — part of the workout-session build (D044, D060)

### D065 — Superset Step Layout
- Current status: Not Implemented
- Current implementation: a primitive `superset_group_id` precursor on two consecutive rows; no Step screen
- Missing work: one Step showing both exercises simultaneously in a horizontal card structure (vertical-orientation videos), two independent weight fields, visually distinct, read as one Step; no Superset entity, no "1/2"/"2/2" notation, no "2 exercises" label. Reconcile the horizontal layout with §1/§13 at mobile width
- Recommended priority: P1 — part of the workout-session build (D041, D060)

### D066 — Workout Finish Screen
- Current status: Not Implemented
- Current implementation: no finish screen / completion boundary UI
- Missing work: separate screen showing "Workout Complete" + Finish Workout button (D050); no companion content, no extra metrics
- Recommended priority: P1 — part of the workout-session build (D050)

### D067 — Workout Reward Modal (finalized 2026-06-23)
- Current status: Not Implemented
- Current implementation: no post-completion result feedback
- Missing work: a **modal over a dimmed background** (not a screen/banner/toast) showing only changes, Stage → Level → XP (largest first); **no Stage growth →** a Return To Activity button; **Stage growth →** no button, 5–7s auto-advance to Home, tap to speed up (never skip the Evolution Animation, D069); rare companion reaction for meaningful milestones only (D036/D037)
- Recommended priority: P1 — part of the workout-session build (D035, D066, D069)

### D068 — Workout Card Count Semantics
- Current status: Not Implemented
- Current implementation: no Activity card; flat model has no Step concept
- Missing work: workout card shows Exercise Count; Workout Start Screen shows Workout Steps; the two counts are distinct concepts (clarifies D045/D055 vs D060)
- Recommended priority: P1 — part of the Activity card + workout-session build (D045, D055, D060)

### D069 — Evolution Reveal Flow (finalized 2026-06-23)
- Current status: Not Implemented
- Current implementation: no reward-flow routing; stage change updates avatar color only (D035 Partially Implemented)
- Missing work: route any Stage Evolution to Home for the Evolution Animation regardless of trigger; normal workout completion → Reward Modal → Return To Activity, normal quest completion remains on Activity; Stage Evolution overrides the destination with **absolute priority**; the transformation is **unskippable** (a tap may speed the transition to Home but never skip the animation)
- Recommended priority: P1 — overlaps the M1 evolution moment (D035) and the Home build (D039)

### D070 — Deferred Progress Visualization
- Current status: Not Implemented
- Current implementation: no Home rings/bars, no Progress screen hierarchy (D008), no visualization-memory persistence
- Missing work: persist the **last visually-shown state per progress surface separately** (not an "unviewed XP" flag); on first visit after a change, animate each surface last-seen → current then clear that surface's memory; **Home memory** — per D071 specifically the **Inner Level Progress open ring** and the **Outer Weekly Activity Progress open ring** (e.g. 12/24) — and **Progress memory** (XP / Level / Stage / other elements) are **independent** — viewing one never clears the other; calm motion budget and no-shame framing (§5/§13/D031)
- Recommended priority: P1 — depends on the Home composition (D039, finalized by D071) and Progress hierarchy (D008); part of the reward-feedback experience (D067, D069)

### D071 — Final Home Product Structure
- Current status: Not Implemented
- Current implementation: the current dashboard/Home does not yet have the final D071 structure — static stage-colored avatar + companion phrase, no minimal header/Profile button, no living Presence treatment, no rings, no Stage Block, no Voice Slot, no "Continue Journey" CTA, no weekly-activity counting
- Missing work: **Minimal Header with the Profile button only** (D006; no notification bell in MVP); **Living Presence as the dominant center**; **exactly two open progress rings** (open arcs — visible start/end + split, value label in the split, calm fill §5/§13); **Inner Ring = Level Progress** (e.g. "12 УР.", no weekly reset); **Outer Ring = Weekly Activity Progress** (e.g. "12/24 АКТ.") where **one completed workout = one activity** and **one completed daily quest = one activity** (only completed actions count), **weekly UTC reset**, **denominator = 21 daily-quest activities (3×7, D017) + the active Program cycle length (2–5, D061)** → 23–26 (the **Program cycle length, not "workouts per week"** — count-agnostic per D046/D061), **capped overflow display** (e.g. "24/24 АКТ."); **Stage Block** (Stage Title + Stage Number); **event-driven, non-permanent Voice Slot** under the Stage Block (D036–038, idle Home may be silent); **"Continue Journey" primary CTA** (D043 routing). **Forbidden on Home:** no notification bell in MVP, no third ring / streak ring / separate XP ring / quest progress ring, no dashboard stats, no workout list, no quest list, no detailed analytics, no shame/hype copy, no casino-style animation
- Recommended priority: P1 — finalizes the MVP Home surface; should be implemented together with the D039/D043/D070 Home unit (and overlaps the M1 living-Presence and evolution work)

### D072 — Final Progress Product Structure
- Current status: Not Implemented
- Current implementation: legacy `/progress` (XP bar, streak panel, evolution block in legacy order); no three-block hierarchy, no static portrait, no Legend slot, no History/Statistics/Achievements blocks, no D070 Progress memory
- Missing work: build per BFG_UI_RULES §20 — Minimal Header (title + Profile button, D006); **Primary** static **identity portrait** (non-interactive, no animation, no tap, never opens customization) that **always reflects the current customized avatar state** (D001/D073) and updates silently; Stage/Evolution as journey position ("3 из 10"); Legend slot + "Path is still forming" placeholder (D027); **Secondary** Level / XP / Streak / Stage position (calm, no streak pressure — D021/D031); **Additional** History (chronicle, D056) / Statistics (opt-in, post-first-weight, D040) / Achievements (MVP earned shelf → Post-MVP Constellations, D026) as entry points; **D070 Progress memory** for XP / Level / Stage (independent of Home). Forbidden: see D072 / BFG_UI_RULES §20 (no second Home, no dashboard, no interactive avatar, no shame/closed-ring/verdict/comparison/completion-% patterns)
- Recommended priority: P1 — part of the D003–D008 navigation/Progress unit; the portrait's read-side sync depends on the D073 shared avatar visual state

### D073 — Avatar Customization Entry & Interaction
- Current status: Not Implemented
- Current implementation: static stage-colored avatar on the dashboard; no living Presence, no tap-to-customize entry, no customization surface, no shared avatar visual state
- Missing work (MVP, correctness): **Home Living Presence tap → Avatar Customization / Appearance / Clothing** (primary, MVP-only customization entry; an affordance on the Presence, not a second CTA; short calm transition, §5/§13); a **single shared avatar visual state** (appearance/clothing/cosmetics/current stage form) read by **both** the Home live Presence and the Progress static portrait — **Home↔Progress visual parity is a correctness property** (D001 at the rendering layer); Progress never opens customization; Profile (D006) is not the primary emotional customization entry
- Customization catalog depth (scoped later, may be MVP or Post-MVP): clothing catalog, cosmetics catalog, currency-linked cosmetics (D034), rich editor depth — **not** locked to MVP by D073; cosmetics never affect gameplay (D029), currency-bought items are personalization-only (D034). The entry model + shared-state are decided now; catalog depth is separate
- Recommended priority: P1 — refines D071 Home; blocks the D072 portrait read-side synchronization

### D074 — Entry / Auth Start Screen (unauthenticated first contact)
- Current status: Not Implemented
- Current implementation: the current unauthenticated start screen has an all-caps motivational headline ("...ТВОИ ПОБЕДЫ"), a descriptive paragraph, a central placeholder/avatar form, and "Старт" / "Есть аккаунт" buttons
- Missing work: rebuild per BFG_UI_RULES §21 / BFG_SCREEN_WIREFRAMES §0 — minimal brand mark; a **Seed Form (First Presence Form)** in the optical center (neutral, unfinished, not gendered, **never a default/final avatar, never Stage 10** — D010; alive but minimal breathing + glow, **Voice-silent**); **Seed Form tap-reactive decoratively only, not a navigation affordance** (decorative path hint toward the CTA, within the §5 motion budget, `prefers-reduced-motion` respected); a **single primary CTA → Sign Up** (the only path forward) with a quiet secondary **Log In** link; calm sentence-case copy (no all-caps, no exclamation, no "победы"/competition framing — D032/§11, no corporate fitness vocabulary, "ты"); **no trial/subscription/pricing** on entry (D006/D030); **no scroll**, mobile-first 360–430px (§1). Onboarding Seed Form behavior is outside D074 scope (governed separately; none accepted yet). D074 approves structure, interaction rules, and copy principles only — **no final copy**
- Recommended priority: P1 — first contact preceding the in-scope MVP Sign Up (BFG_MVP_SCOPE §2.1); self-contained, no dependency on the navigation/Home/Progress units

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
4. **Home unit (D039 + D043 + D070 + D071).** Build the MVP Home surface as one unit per the **final structure in D071** (not just the D039 composition): minimal header (Profile button only, D006), living Presence center, the two open progress rings (Inner = Level Progress, Outer = Weekly Activity Progress with weekly UTC reset and the D071 denominator/overflow rules), Stage Block, the event-driven non-permanent Voice Slot, and the "Continue Journey" CTA routing (D043). Include the deferred progress-visualization memory (D070) so the rings animate last-seen → current on entry. Pairs with the M1 living-Presence work (step 2) and depends on the navigation/Profile-button unit (step 3).
5. **Quest catalog content growth.** Additional categorized quests on top of the selection layer (catalog = pool; surface stays 3/day).
6. **P2 systems in dependency order, post-MVP per roadmap.** Currency (D034) first since D022 and D035 reference it, then Energy (D024), then endgame layer (D025–D028) — with D025 scheduled to exist before the first cohort approaches level 81.
7. **`CURRENT_PRIORITIES.md` pointer fix** (remaining doc-drift item) — next time that file is touched.

