# BFG Product Decisions

The official registry of accepted product decisions. Single source of truth for **what was decided**, not how it is built.

This document is NOT:

- implementation documentation (see `CURRENT_STATE.md`)
- roadmap documentation (see `BFG_ROADMAP.md`)
- architecture documentation (see `BFG_ARCHITECTURE.md`)
- code documentation

Rules:

- A decision enters this registry only when accepted.
- A decision is removed only by a superseding decision, never silently.
- Implementation Status reflects the codebase at the time of the last registry update (2026-06-10).
- When another doc disagrees with this registry, this registry wins and the other doc must be updated.

---

# Decision 001

Title:
Unified Presence — one being, two roles

Category:
Companion

Status:
Accepted

Decision:
Avatar and Companion are a single entity. Avatar = Body. Companion = Voice. They are never presented, designed, or implemented as two separate systems. The companion's progression inputs (stage, level, streak) are the entity's self-knowledge, not observation of an external avatar.

Reason:
One presence creates an emotional bond; two parallel mascots dilute it.

Implementation Status:
Implemented

Related Documents:
BFG_GAME_SYSTEMS.md §10, BFG_AI_COMPANION.md, BFG_ARCHITECTURE.md §3

---

# Decision 002

Title:
Presence is the central emotional element of BFG

Category:
Companion

Status:
Accepted

Decision:
The presence (avatar body + companion voice) is the emotional core of the product. Every screen and system is evaluated by whether it feeds the presence loop.

Reason:
BFG's differentiation is emotional continuity, not workout content volume.

Implementation Status:
Partially Implemented — presence appears on dashboard and post-action feedback, but is not yet a living animated entity (see Decision 007).

Related Documents:
BFG_GAME_SYSTEMS.md §1, BFG_MVP_SCOPE.md §1

---

# Decision 003

Title:
Bottom navigation structure

Category:
Navigation

Status:
Accepted

Decision:
Bottom navigation contains exactly five tabs: Workouts, Nutrition, Home, Progress, Multimedia. Home is the center tab. Nutrition and Multimedia are accepted future navigation destinations: their presence in the bottom navigation is an accepted product decision, while their detailed feature scope remains roadmap-driven. MVP may ship them with placeholder / disabled / coming-soon handling if implementation is deferred — the navigation direction itself is accepted.

Reason:
Five stable destinations; presence-centered home; consolidates today's seven scattered routes; reserves room for future expansion areas without a later navigation redesign.

Implementation Status:
Not Implemented — current nav serves dashboard / workouts / quests / companion / avatar / progress / profile routes.

Related Documents:
BFG_UI_RULES.md §2, CURRENT_STATE.md
Note: see Registry Notes — Future Product Surface Notes (Nutrition, Multimedia).

---

# Decision 004

Title:
Quests move into the Workouts/Activity area

Category:
Navigation

Status:
Accepted

Decision:
Daily quests lose their dedicated top-level destination and live inside the Workouts/Activity area.

Reason:
Quests support training (Decision 020); navigation should not present them as a peer of training.

Implementation Status:
Not Implemented — `/quests` is a standalone route today.

Related Documents:
CURRENT_STATE.md, BFG_GAME_SYSTEMS.md §6

---

# Decision 005

Title:
Progress merges Avatar + Progress + Profile

Category:
Navigation

Status:
Accepted

Decision:
The Progress destination absorbs the current Avatar screen, Progress screen, and Profile content into one surface.

Reason:
All three answer the same user question ("who have I become"); three routes fragment it.

Implementation Status:
Not Implemented — `/avatar`, `/progress`, `/profile` are separate routes today.

Related Documents:
CURRENT_STATE.md

---

# Decision 006

Title:
Profile becomes a small header button

Category:
Navigation

Status:
Accepted

Decision:
Profile (account, subscription state) is reached via a small header button, not a bottom-nav tab.

Reason:
Profile is administrative, not part of the daily emotional loop.

Implementation Status:
Not Implemented

Related Documents:
CURRENT_STATE.md, BFG_UI_RULES.md §2

---

# Decision 007

Title:
Home screen is the living animated Presence

Category:
UX

Status:
Accepted

Decision:
The Home screen is built around a living, animated Presence. It is the emotional center of the application.

Reason:
The first thing the user sees must be the being they return to, not a dashboard of numbers.

Implementation Status:
Partially Implemented — dashboard shows a static stage-colored avatar + companion phrase; living animation not built.

Related Documents:
BFG_UI_RULES.md §5, CURRENT_STATE.md, MVP_STATUS.md (avatar animation is an M1 must-ship)

---

# Decision 008

Title:
Progress screen block hierarchy

Category:
UX

Status:
Accepted

Decision:
The Progress screen is structured in three blocks, in order: Primary — Presence / Evolution / Legend; Secondary — Level / XP / Streak; Additional — History / Statistics. Legends are earned later through long-term behavior analysis (Decision 027); before a Legend is earned, the Legend slot displays a placeholder presentation state — suggested wording: "Path is still forming" (final copy in Russian, per UI rules). The placeholder is a presentation state, not a Legend. It should reinforce curiosity and anticipation: the user should feel that a future identity is emerging, never that something is empty or missing.

Reason:
Identity (who the presence is) leads; numbers support; archives close. The placeholder keeps the primary block honest for the majority of users who have not yet earned a Legend.

Implementation Status:
Not Implemented — current `/progress` shows XP bar, streak panel, evolution block without this hierarchy; Legend, History, Statistics blocks do not exist.

Related Documents:
CURRENT_STATE.md, MVP_STATUS.md

---

# Decision 009

Title:
Levels = small visual changes; Stages = major visual changes

Category:
Progression

Status:
Accepted

Decision:
Each level produces a small visual change within a stage. Each evolution stage is a major visual transformation. Two registers, never mixed.

Reason:
Frequent small rewards and rare large ones must not compete for the same emotional weight.

Implementation Status:
Partially Implemented — stages change avatar color scheme; per-level visual changes do not exist; stage visuals beyond color are an open M1 item.

Related Documents:
BFG_GAME_SYSTEMS.md §5, MVP_STATUS.md

---

# Decision 010

Title:
Ten evolution stages; Stage 10 is final

Category:
Progression

Status:
Accepted

Decision:
The avatar has exactly 10 evolution stages. Stage 10 is the final vertical evolution; nothing vertical exists beyond it.

Reason:
Ten transformations sustain a multi-year journey; a hard final stage gives the endgame a clean boundary.

Implementation Status:
Not Implemented — code has a 5-stage ladder (`lib/progression/avatar-evolution.ts`).

Related Documents:
BFG_GAME_SYSTEMS.md §5 (outdated — documents 5 stages)

---

# Decision 011

Title:
Stage thresholds are square levels (Model A)

Category:
Progression

Status:
Accepted

Decision:
Stage N begins at level N²: stages at levels 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. Evolution remains a pure function of level.

Reason:
Monotonically increasing rarity to the very end; formula-clean (stage = ⌊√level⌋); earliest possible first evolution for beginners. Chosen over a linear-accelerating model whose truncated final gap broke rarity at the climax.

Implementation Status:
Not Implemented

Related Documents:
BFG_GAME_SYSTEMS.md §5 (outdated thresholds: 1/5/10/20/35)

---

# Decision 012

Title:
100 vertical levels before horizontal progression

Category:
Progression

Status:
Accepted

Decision:
The level system has exactly 100 vertical levels. Level 100 coincides with Stage 10 and ends vertical progression — it does not end the user's journey. After level 100, horizontal progression continues: Legends, Achievement Constellations, Cosmetics, Currency, Avatar History, and Loyalty Rewards (Decisions 025–028).

Reason:
A finite, legible vertical ladder gives the journey a real summit; growth continues afterward in breadth, not height.

Implementation Status:
Not Implemented — current code has no level cap (guard at 999).

Related Documents:
lib/progression/levels.ts (via CURRENT_STATE.md)

---

# Decision 013

Title:
Flat level cost — 50 XP per level

Category:
Economy

Status:
Accepted

Decision:
Every normal level costs exactly 50 XP. The cost never increases.

Reason:
Predictable rhythm; pacing differentiation comes from stage threshold spacing (Decision 011), not from inflating level costs.

Implementation Status:
Not Implemented — current curve is 100 + 50·(n−1) per level, uncapped.

Related Documents:
BFG_GAME_SYSTEMS.md §3 (outdated curve)

---

# Decision 014

Title:
Level 1 → 2 is a special onboarding milestone

Category:
Progression

Status:
Accepted

Decision:
The first level-up is treated as a special onboarding moment, not a routine level.

Reason:
Under a flat 50 XP cost the first level-up otherwise arrives days late for the beginner target user; the first progression event must land in the first session(s).

Implementation Status:
Not Implemented

Related Documents:
BFG_MVP_SCOPE.md §1, BFG_GAME_SYSTEMS.md §2.2 (MILESTONE reserved)

---

# Decision 015

Title:
Workout = 10 XP

Category:
Economy

Status:
Accepted

Decision:
Completing a workout grants 10 XP.

Reason:
Anchors the economy: a workout-only active user (5/week) reaches Stage 10 in ≈ 2 years, matching the target journey length.

Implementation Status:
Not Implemented — `WORKOUT_COMPLETE` is 100 XP in `lib/progression/xp-rewards.ts`.

Related Documents:
BFG_GAME_SYSTEMS.md §2.2 (outdated values)

---

# Decision 016

Title:
Quest = 3–5 XP depending on difficulty

Category:
Economy

Status:
Accepted

Decision:
A daily quest grants 3 to 5 XP, scaled by difficulty. Each individual quest grants less XP than a workout (10 XP). Multiple quests may collectively exceed the XP value of a single workout — this is accepted, because quests represent multiple distinct supportive health behaviors (Decision 033), not a repeated alternative to training.

Reason:
Quests support training, never rival it (Decision 020); per action, a workout remains the largest single XP source.

Implementation Status:
Not Implemented — `DAILY_QUEST` is 50 XP flat; catalog cards display 40–140 XP.

Related Documents:
BFG_GAME_SYSTEMS.md §2.2, lib/quests/daily-quests.ts (via CURRENT_STATE.md)

---

# Decision 017

Title:
Three daily quests, selected from the Quest Catalog

Category:
Economy

Status:
Accepted

Decision:
The user receives, sees, and can complete 3 daily quests per day. The daily selection is drawn from the larger Quest Catalog and is the active daily surface; the catalog is the content pool behind it. Catalog size and daily quest count are intentionally independent: the catalog contains all available quest templates, is expected to grow over time (potentially to 20, 50, or 100+ quests), and MVP may launch with a smaller catalog — while the daily surface stays at 3. Daily quest XP is therefore bounded at 9–15 XP.

Reason:
Caps quest aggregation — without a daily bound, a quest-heavy user out-earns trainers and breaks training primacy (verified in Phase 3 simulations). A separate, growing catalog keeps content fresh without inflating the daily XP budget.

Implementation Status:
Not Implemented — current catalog offers 4 quests, all claimable daily; no selection layer exists.

Related Documents:
lib/quests/daily-quests.ts (via CURRENT_STATE.md)
Note: see Registry Notes — Quest Architecture. The M1 checklist item "≥5 daily quests in catalog" refers to the catalog pool, not the daily surface; the two requirements do not conflict.

---

# Decision 018

Title:
Workout Quest removed

Category:
Economy

Status:
Accepted

Decision:
The "Сделать тренировку" daily quest is removed. Completing a workout is rewarded once, through `WORKOUT_COMPLETE` only.

Reason:
The quest double-dipped with workout XP, rewarding the same action twice.

Implementation Status:
Not Implemented — quest `workout` (140 XP) is still in the catalog.

Related Documents:
lib/quests/daily-quests.ts (via CURRENT_STATE.md)

---

# Decision 019

Title:
Streak Quest removed

Category:
Economy

Status:
Accepted

Decision:
The "Удержать серию" daily quest is removed. No quest rewards holding a streak.

Reason:
It paid XP for streak-holding (violating Decision 021 in spirit) and was circular — auto-satisfied by any counting action.

Implementation Status:
Not Implemented — quest `streak` (50 XP) is still in the catalog.

Related Documents:
lib/quests/daily-quests.ts (via CURRENT_STATE.md)

---

# Decision 020

Title:
Training is the primary progression source; quests are supportive

Category:
Economy

Status:
Accepted

Decision:
Workouts are the dominant XP source. Quests exist to support training (recovery, hydration, consistency), never to replace it as a progression path.

Reason:
BFG is a fitness product; progression must reflect training, or the avatar's growth is a lie.

Implementation Status:
Not Implemented — current numbers violate it (a single quest card pays up to 140 XP vs workout 100).

Related Documents:
BFG_GAME_SYSTEMS.md §2, BFG_MVP_SCOPE.md §2.2

---

# Decision 021

Title:
Streak never grants XP

Category:
Progression

Status:
Accepted

Decision:
Streaks never grant XP, directly or indirectly. Accepted 2026-06-09.

Reason:
Streak pressure converted into XP creates loss-anxiety mechanics; the streak is presence continuity, not currency.

Implementation Status:
Implemented — no streak XP path exists; the dead `STREAK_BONUS` constant awaits cleanup.

Related Documents:
BFG_GAME_SYSTEMS.md §2.2 / §4.2, CURRENT_STATE.md

---

# Decision 022

Title:
Streak may grant Energy, Currency, or emotional feedback

Category:
Progression

Status:
Accepted

Decision:
Streaks may reward the user with Energy (Decision 024), Currency (Decision 034 — Currency is a global system, not endgame-only), or emotional presence feedback — never XP.

Reason:
Streak loyalty deserves acknowledgment through the presence and soft systems, outside the progression ladder.

Implementation Status:
Partially Implemented — emotional feedback on streak milestones exists (companion phrases); Energy and Currency do not exist.

Related Documents:
BFG_GAME_SYSTEMS.md §4.2, lib/workouts/companion-feedback.ts (via CURRENT_STATE.md)

---

# Decision 023

Title:
Daily login XP removed from MVP

Category:
Economy

Status:
Accepted

Decision:
Logging in grants no XP. The daily login reward path and its UI are removed.

Reason:
Login is not a fitness action; rewarding it inflates XP with zero training signal.

Implementation Status:
Implemented — daily reward panel removed; the dead `DAILY_LOGIN` constant awaits cleanup.

Related Documents:
BFG_GAME_SYSTEMS.md §2.2, CURRENT_STATE.md

---

# Decision 024

Title:
Energy — hidden internal resource

Category:
Progression

Status:
Accepted

Decision:
Energy is a hidden internal resource. The user never sees a numeric value or percentage. Energy affects visual state: aura, animation intensity, appearance, and companion behavior. Energy never affects XP, levels, stages, achievements, or legends.

Energy is a reflection system, not a progression system. It may influence presentation and emotional feedback, but it never accelerates progression, never modifies XP gains, and never modifies level progression.

Reason:
A felt-not-counted resource lets the presence reflect the user's rhythm without creating a second grindable meter.

Implementation Status:
Not Implemented

Related Documents:
BFG_GAME_SYSTEMS.md §10 (companion inputs), BFG_UI_RULES.md §5

---

# Decision 025

Title:
Horizontal progression begins after Stage 10

Category:
Endgame

Status:
Accepted

Decision:
After Stage 10 (level 100) vertical progression ends and horizontal progression begins. The avatar's final form is permanent; growth continues in breadth, not height.

Reason:
The vertical arc must end to stay meaningful; years 2+ are carried by horizontal systems.

Implementation Status:
Not Implemented

Related Documents:
BFG_ROADMAP.md (post-MVP milestones), BFG_GAME_SYSTEMS.md §13

---

# Decision 026

Title:
Endgame content set

Category:
Endgame

Status:
Accepted

Decision:
The post-Stage-10 horizontal layer includes: Legends, Achievement Constellations, Cosmetics, Currency, Avatar History, and Loyalty Rewards. Currency is not introduced by the endgame: it is a global progression system that exists before Stage 10 (Decision 034). Horizontal progression expands the importance, uses, and spending opportunities of Currency rather than creating it.

Reason:
Multiple non-competing reward registers keep long-tenure users progressing without reopening the vertical ladder.

Implementation Status:
Not Implemented — only a catalog-only cosmetics preview exists today.

Related Documents:
BFG_GAME_SYSTEMS.md §8 / §13, BFG_ROADMAP.md §5

---

# Decision 027

Title:
Legends are system-assigned from long-term behavior

Category:
Endgame

Status:
Accepted

Decision:
Legends (titles) are not chosen by the user, and Legends are not classes. Users never choose a Legend at any point. The system infers Legends from long-term behavior patterns; they are earned over time and may evolve over time. Names such as Warrior, Guardian, Wanderer, Sage are examples of future Legends — observed identities the system assigns, never selectable character classes. The shared achievement system remains available to everyone alongside Legends.

A user is never permanently locked into a Legend. Legends may evolve over time as long-term behavior patterns change — a Legend is a living reflection of user history, not a permanent classification.

Reason:
An earned, observed identity is emotionally heavier than a picked label; evolution over time keeps Legends alive rather than archival. Ruling out class selection protects this — a chosen class is a preference, an inferred Legend is a mirror.

Implementation Status:
Not Implemented

Related Documents:
BFG_GAME_SYSTEMS.md §13

---

# Decision 028

Title:
Loyalty rewards are independent of Stage 10

Category:
Endgame

Status:
Accepted

Decision:
Loyalty rewards do not require reaching Stage 10. Long-term activity may unlock subscription rewards regardless of progression position. Loyalty rewards may include subscription benefits, including free subscription periods unlocked by long-term activity. No specific duration or threshold is hardcoded in this registry — this is a product principle, not a tariff.

Reason:
Loyalty measures time and constancy, not performance; casual long-term users must be reachable by it. Exact loyalty thresholds and durations may change in future balancing, so the registry records the principle only.

Implementation Status:
Not Implemented

Related Documents:
BFG_ROADMAP.md §4 (subscription), BFG_GAME_SYSTEMS.md §9

---

# Decision 029

Title:
No pay-to-win — cosmetics never affect gameplay

Category:
Economy

Status:
Accepted

Decision:
Cosmetics never give a gameplay or progression advantage. Paid cosmetics expand personalization only.

Reason:
Product invariant; selling progression destroys the honesty of the avatar's growth.

Implementation Status:
Implemented — invariant holds in the cosmetics catalog design.

Related Documents:
BFG_GAME_SYSTEMS.md §8

---

# Decision 030

Title:
Core emotional loop is never subscription-gated

Category:
UX

Status:
Accepted

Decision:
Companion presence, daily quests, basic workouts, avatar, and streak are never gated by subscription state. Trial expiry never deletes progression.

Reason:
Churn must not be built on top of the emotional core; gating attaches only to optional expansion content.

Implementation Status:
Implemented — `checkAccess` gates nothing in the core loop; trial expiry preserves state.

Related Documents:
BFG_GAME_SYSTEMS.md §9, CURRENT_STATE.md

---

# Decision 031

Title:
Streak breaks are soft — no shame, no protection mechanics (MVP)

Category:
Progression

Status:
Accepted

Decision:
A missed day soft-restarts the streak to 1. No shaming copy, no penalties, no streak freeze / break protection in MVP. Returning is always safe.

Reason:
Fear-driven streaks contradict the calm philosophy; protection tokens are deferred (M4) and must not break the no-shame promise.

Implementation Status:
Implemented — `touchStreak` soft-restart behavior.

Related Documents:
BFG_GAME_SYSTEMS.md §4.2, BFG_ROADMAP.md §5.1

---

# Decision 032

Title:
No leaderboards, no PvP

Category:
UX

Status:
Accepted

Decision:
BFG has no leaderboards and no player-versus-player competition. Rejected permanently for emotional safety, not deferred.

Reason:
Comparison mechanics import shame into a product whose core promise is its absence.

Implementation Status:
Implemented — by deliberate absence.

Related Documents:
BFG_GAME_SYSTEMS.md §13, BFG_MVP_SCOPE.md §3.1

---

# Decision 033

Title:
Quest categories — no same-category duplication per day

Category:
Economy

Status:
Accepted

Decision:
Quest generation must support behavior categories. Example categories: Training, Mobility, Walking, Recovery, Hydration, Sleep, Breathing, Nutrition, Mindfulness, Seasonal, Special Events. The daily quest selection (Decision 017) should avoid generating multiple quests that represent the same behavior category on the same day.

Acceptable daily selection: Hydration · Walking · Stretching.
Not desirable daily selection: Walk 8,000 steps · Walk 10,000 steps · Walk 12,000 steps.

This is a product decision and a future quest-system requirement, not an implementation task at registry time.

Reason:
Daily quests should encourage a variety of healthy behaviors, not repeat the same behavior under different names.

Implementation Status:
Not Implemented — the current catalog is a flat list with no category field and no daily selection logic.

Related Documents:
lib/quests/daily-quests.ts (via CURRENT_STATE.md), BFG_GAME_SYSTEMS.md §6

---

# Decision 034

Title:
Currency is a global progression system

Category:
Economy

Status:
Accepted

Decision:
Currency exists before and after Stage 10. It is not restricted to endgame users. Users may earn Currency from: Evolution Stages (Decision 035), long-term activity, achievements, loyalty systems, special events, selected milestone moments, and future systems. Horizontal progression does not introduce Currency — it expands the importance, uses, and spending opportunities of Currency (Decision 026). Currency never grants XP (Decision 021 logic applies: reward channels outside the ladder stay outside the ladder).

Currency is primarily intended for cosmetic and personalization systems — examples: cosmetics, avatar customization, exclusive appearance items, and future personalization systems. Currency never purchases progression power and never grants competitive advantage. Currency supports personalization, not power.

Reason:
Resolves the registry ambiguity between streak rewards (Decision 022) and endgame content (Decision 026); long-term constancy deserves a tangible non-XP reward channel from day one, not from year two. The personalization-only spending rule reinforces the anti-pay-to-win invariant (Decision 029) from the earning side as well as the buying side.

Implementation Status:
Not Implemented

Related Documents:
Decisions 022, 026, 035; BFG_GAME_SYSTEMS.md §13

---

# Decision 035

Title:
Evolution Stage rewards

Category:
Progression

Status:
Accepted

Decision:
Evolution Stages are the most important progression moments in BFG. Each Evolution Stage is a major progression milestone, and every Evolution Stage should feel rewarding. Each stage grants: a major visual transformation, an emotional Presence reaction, and a Currency reward (Decision 034). Every Evolution Stage includes a dedicated celebration moment — stage transitions should always feel memorable and emotionally significant (implementation details are not prescribed by this registry; tone rules in `BFG_UI_RULES.md` apply). Level-ups are routine progression moments; Evolution Stages are milestone progression moments. Stage rewards must always feel more significant than ordinary level-ups — the user should immediately feel the difference between the two.

Reason:
Ten stages across a multi-year journey only carry their weight if every transition is felt; stage rewards mark the milestone without inflating XP.

Implementation Status:
Partially Implemented — a stage change alters avatar visuals today (color scheme only); the evolution presence moment (< 600ms animation) is an open M1 item; Currency rewards do not exist.

Related Documents:
BFG_GAME_SYSTEMS.md §5, MVP_STATUS.md, Decisions 009, 034

---

# Registry Notes

## Duplicates detected (4)

Each duplicate in the input list was normalized — either registered as a single decision, or deliberately split into two cross-referenced decisions at different granularity (principle vs application, scope vs mechanics):

1. "Presence is the central emotional element" appeared in both the Unified Presence set and the Home Screen set → registered as Decision 002 (principle) and Decision 007 (screen application).
2. Legends appeared in both the Endgame content set and the standalone Legends set → Decision 026 lists scope; Decision 027 holds the mechanics.
3. Loyalty Rewards appeared in both the Endgame content set and the standalone Loyalty set → Decision 026 lists scope; Decision 028 holds the mechanics.
4. "Streak may grant Energy" appeared in both the Streaks set and the Energy set → registered once as Decision 022, with the Energy definition in Decision 024.

## Contradictions detected (0)

No contradictions remain between accepted decisions and existing scope documents.

Two items provisionally listed as contradictions in the first registry draft were reclassified at the 2026-06-10 refinement:

1. Nutrition and Multimedia tabs (Decision 003) → **Future Product Surface Notes** (below). The navigation direction is accepted; the feature scope is roadmap-driven. No conflict with `BFG_MVP_SCOPE.md`.
2. "3 quests per day" (Decision 017) vs "≥5 quests in catalog" (`BFG_MVP_SCOPE.md §6`, `MVP_STATUS.md`) → **Quest Architecture** (below). Catalog and daily selection are separate systems; the requirements address different layers and do not conflict.

One ambiguity found by the 2026-06-10 registry review was resolved by a new decision rather than reclassification: Currency appearing both as a streak reward (Decision 022) and as endgame content (Decision 026) is reconciled by Decision 034 — Currency is a global system; the endgame expands it, not introduces it.

## Future Product Surface Notes (2)

1. **Nutrition** (Decision 003) — an accepted future navigation destination. Its existence in the bottom navigation is an accepted product decision; its detailed feature scope remains roadmap-driven. It does not conflict with MVP scope: `BFG_MVP_SCOPE.md §3.1` excludes calorie/weight/BMI tracking as MVP *features*, which stays true — the tab represents a future expansion area. MVP may ship it with placeholder / disabled / coming-soon handling if implementation is deferred.
2. **Multimedia** (Decision 003) — an accepted future navigation destination under the same terms: navigation direction accepted, feature scope roadmap-driven, no MVP-scope conflict, placeholder / disabled / coming-soon handling permitted at MVP.

## Quest Architecture

```text
Quest Catalog
↓
Daily Quest Selection
↓
3 quests per day
```

- The Quest Catalog and the Daily Quest Selection are separate systems and must not be treated as conflicting requirements.
- The catalog contains all available quest templates and is expected to grow over time (20, 50, 100+ quests); MVP may launch with a smaller catalog.
- Catalog size and daily quest count are intentionally independent.
- The daily selection is the active daily surface: 3 quests per day, drawn from the catalog (Decision 017).
- The daily selection must avoid same-category duplication where possible (Decision 033).

## Doc drift (not contradictions)

`BFG_GAME_SYSTEMS.md` (§2.2 XP values, §3.1 level curve, §5.2 stage ladder), `CURRENT_STATE.md`, and `MVP_STATUS.md` describe the pre-rebalance economy (100/50 XP, 5 stages, increasing level cost). They document the implemented state, which Decisions 010–019 intentionally supersede. They require a sync pass when the rebalance is implemented.

## Implementation summary

| Status | Count | Decisions |
|---|---|---|
| Implemented | 7 | 001, 021, 023, 029, 030, 031, 032 |
| Partially Implemented | 5 | 002, 007, 009, 022, 035 |
| Not Implemented | 23 | 003–006, 008, 010–020, 024–028, 033, 034 |

Total decisions: 35.
Contradictions: 0 (two first-draft items reclassified; one Currency ambiguity resolved by Decision 034 — see above).
Future Product Surface Notes: 2 (Nutrition, Multimedia).
