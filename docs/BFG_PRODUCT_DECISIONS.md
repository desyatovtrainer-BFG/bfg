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
- Implementation Status reflects the codebase at the time of the last registry update (2026-06-12, after the P0A/P0B progression economy rebalance and data reset).
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
BFG_UI_RULES.md §5, CURRENT_STATE.md, MVP_STATUS.md (avatar animation is an M1 must-ship); refined by Decision 039 (approved Home composition adds a simplified progress layer — Presence remains primary)

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
Implemented — 10-stage ladder in `lib/progression/avatar-evolution.ts`; stage names/auras/flavor for stages 2–10 are temporary placeholders pending approval (visual distinctness tracked under D009).

Related Documents:
BFG_GAME_SYSTEMS.md §5

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
Implemented — `lib/progression/avatar-evolution.ts`

Related Documents:
BFG_GAME_SYSTEMS.md §5

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
Implemented — `calculateLevel` caps at 100 (`lib/progression/levels.ts`); horizontal systems beyond it remain future work (D025).

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
Implemented — flat 50 XP per level in `lib/progression/levels.ts`.

Related Documents:
BFG_GAME_SYSTEMS.md §3

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
Implemented — `WORKOUT_COMPLETE: 10` in `lib/progression/xp-rewards.ts`.

Related Documents:
BFG_GAME_SYSTEMS.md §2.2

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
Partially Implemented — quest XP is catalog-driven and inside the 3–5 band, but currently a temporary uniform 4 XP; per-difficulty values pending approval.

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
Implemented — `selectDailyQuestIds` (deterministic per user/UTC-day) + server-side validation in `completeDailyQuestAction`; catalog holds 5, daily surface is 3.

Related Documents:
lib/quests/daily-quests.ts, lib/quests/actions.ts (via CURRENT_STATE.md)
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
Implemented — removed from the catalog (P0A).

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
Implemented — removed from the catalog (P0A).

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
Implemented — workout (10 XP) out-earns any single quest (4 XP) 2.5×; the daily quest ceiling is 12 XP across the 3 selected quests (P0A + P0B).

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
Implemented — no streak XP path exists; the former `STREAK_BONUS` constant has been removed (P0A).

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
Implemented — daily reward panel removed; the former `DAILY_LOGIN` constant has been removed (P0A).

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
Implemented — every catalog quest carries a `category`; the daily selection admits at most one quest per category (the category-agnostic fill pass is reachable only in future catalogs with fewer than 3 distinct categories, per the "where possible" clause).

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

# Decision 036

Title:
Presence Response System — Body, Voice, or both

Category:
Companion

Status:
Accepted

Decision:
A Presence response is any reaction to an event and is not limited to speech. The Presence responds through its Body (avatar), its Voice (companion), or both. Eligibility is separate from frequency: eligibility grants an event the right to a response; the frequency governor (Decision 037) may still resolve it to silence. One moment produces at most one Voice response. The Voice is always embodied — a Voice response is always accompanied by a Body reaction — while the Body lives and reacts continuously without the Voice. The full architecture (response categories, the event eligibility table, priority resolution, and the decision flow) is specified in `BFG_PRESENCE_RESPONSE_SYSTEM.md`.

Reason:
The Body is acknowledgment without address — continuous, safe, and uninterpretable as a verdict — so it carries the primary communication load; the Voice is the rare figure against that silence, and rarity is what makes a line read as chosen. Two channels expressing one emotional state is what keeps the Presence a single being rather than a talking avatar.

Implementation Status:
Partially Implemented — the Voice exists (deterministic phrases + post-action reactions); the living Body, the response-type selection, and the governor are not yet built.

Related Documents:
BFG_PRESENCE_RESPONSE_SYSTEM.md, BFG_AI_COMPANION.md, companion/BFG_Companion_Doctrine.md §V/§VI/§X, Decisions 001, 007, 035

---

# Decision 037

Title:
Response frequency is an output, never tied to Level or Evolution Stage

Category:
Companion

Status:
Accepted

Decision:
Communication frequency is an output of the relationship, not a control surface, and is never a function of Level or Evolution Stage. The frequency governor draws only on relationship tenure, session count, recent response history, event depletion, and return history. Body frequency may be generous (the Body is continuously available); Voice frequency is scarce and irregular, and its absence must never become readable as feedback. The accepted long-term frequency taper is a by-product of tenure and event depletion, not of progression rank.

Reason:
Binding social cadence to a performance ladder would make the Presence appear to speak less as the user succeeds — withdrawal-for-achievement — recreating the ledger the secure base forbids. Tenure-and-depletion produces the same taper while keeping care non-contingent.

Implementation Status:
Partially Implemented — no frequency path is tied to stage today; the tenure/depletion/return governor itself is not yet built.

Related Documents:
BFG_PRESENCE_RESPONSE_SYSTEM.md §6, companion/BFG_Companion_Doctrine.md §VI/§XII, Decisions 009, 011, 036

---

# Decision 038

Title:
The no-ledger principle binds the Body as well as the Voice

Category:
Companion

Status:
Accepted

Decision:
The no-ledger principle applies to every Presence channel, not only the Voice. Neither Body nor Voice ever expresses disappointment, decline, or withdrawal in response to user inactivity, and no channel marks a streak break (Decision 031). When the user is absent, the Body's resting state is calm or at-rest, never reproachful; any Energy-driven change (Decision 024) reflects the user's own rhythm neutrally and is never the Presence reacting to being left.

Reason:
A presence that keeps no score cannot be failed, which is what makes it safe to be loved. If the Body could look hurt by absence, it would reintroduce through motion the exact ledger the Voice is forbidden from keeping.

Implementation Status:
Partially Implemented — the Voice already never shames and streak breaks are already silent; the living Body that must honor this is not yet built.

Related Documents:
BFG_PRESENCE_RESPONSE_SYSTEM.md §10, companion/BFG_Companion_Doctrine.md §X, Decisions 024, 031, 036

---

# Decision 039

Title:
Home Concept Candidate A — approved Home composition

Category:
UX

Status:
Accepted

Decision:
The MVP Home screen adopts Home Concept Candidate A. The approved content composition is:

1. The living Presence occupies the visual center and remains the primary visual focus.
2. An inner ring around the Presence shows Level Progress.
3. An outer ring around the Presence shows Weekly Progress.
4. A Stage Block sits directly under the Presence and contains both a Stage Title and a Stage Number (reference: "SEEKER / STAGE 3"; final naming may evolve later — the architectural structure is what is approved, not the specific words).
5. The primary call to action is "Continue Journey".
6. The Presence remains dominant; the two rings are a supporting layer, never the focus.
7. The two progress rings (Level, Weekly) are approved as part of the Home composition.
8. Home shows simplified progress only. Detailed statistics remain on the Progress screen (Decision 008).
9. Presence dialogue (the Voice) placement on Home remains open and will be decided later — consistent with the event-driven Voice of the Presence Response System (Decisions 036–037).

Scope note: this decision covers the Home screen content composition only. Bottom navigation remains governed by Decisions 003–006, and notification surfaces are not in scope here.

This decision refines Decision 007: Home remains Presence-first, but a simplified progress layer (the two rings + Stage Block) is now an approved part of the Home composition. Any reading of Decision 007 as "no progress indicators of any kind on Home" is superseded here; the "not a dashboard of numbers" intent is preserved by keeping the Presence primary and limiting Home to simplified progress, with detailed metrics on Progress (Decision 008). The Weekly Progress indicator's presentation must honor the no-shame rule (Decision 031).

Reason:
The accepted concept keeps the Presence as the emotional center while giving the user a light, legible sense of progression on the Home screen itself. Detailed metrics stay on Progress; Home carries only a simplified progress layer, so the Presence remains the primary focus.

Implementation Status:
Not Implemented — the current dashboard shows a static stage-colored avatar + companion phrase; the living Presence, the two rings, the Stage Block, and the "Continue Journey" CTA are not built.

Related Documents:
BFG_UI_RULES.md §15, BFG_PRESENCE_RESPONSE_SYSTEM.md, Decisions 002, 007, 008, 035, 036, 037, 043 (Continue Journey routing)

---

# Decision 040

Title:
Workout Tracking Philosophy

Category:
Fitness System

Status:
Accepted

Decision:

- Workout completion is the primary tracked event.
- Start Workout + Finish Workout are the only required user actions.
- No mandatory exercise logging.
- No mandatory set logging.
- No mandatory rep logging.
- No mandatory rest tracking.
- Working weight is optional.
- Weight logging never affects XP.
- Weight logging never affects Levels.
- Weight logging never affects Streak.
- Weight logging never affects Achievements.
- Weight logging exists only for personal strength analytics.
- Users are never penalized for not logging weight.

Workout duration is measured automatically from the start and finish timestamps and is intentionally accepted as imperfect: it never affects XP, levels, streak, achievements, or rewards (BFG trusts the user). Strength Progress appears only after a user has logged working weight for an exercise at least once; there is no empty-state pressure to log (consistent with the no-shame rule, Decision 031).

Reason:

BFG prioritizes beginner friendliness and low-friction training flow over detailed workout journaling.

Implementation Status:
Not Implemented

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, docs/fitness/BFG_EXERCISE_METADATA.md, WORKOUT_CONTENT_GUIDE.md §12, BFG_GAME_SYSTEMS.md §2.2, BFG_MVP_SCOPE.md §3.1, Decisions 015, 020, 031

---

# Decision 041

Title:
Centralized Exercise Library

Category:
Fitness System

Status:
Accepted

Decision:

- BFG uses a centralized Exercise Library.
- Exercises exist once and are reused across workout templates.
- Workout templates reference exercises rather than duplicating them.
- Exercise identity is defined by an immutable Exercise ID.
- Exercise IDs are never changed.
- Exercise IDs are never reused.
- Exercises are retired (deactivated) rather than deleted.
- Weight History is attached to Exercise ID.
- The Exercise Library is infrastructure for content consistency, tracking, and analytics.
- The Exercise Library does not exist for user customization.

The Exercise Library separates identity (what an exercise is) from prescription (how it is used in a given workout). Intrinsic metadata — title, description, video, exercise type, load type — lives on the canonical exercise; prescription — order, duration, sets/reps display, superset grouping — lives on the workout template's reference to it. Load Type and Exercise Type are identity-sensitive once weight history exists: changing them would silently alter the meaning of past weight entries, so such a change requires retiring the exercise and creating a new one, never an in-place edit. This decision resolves the "stable exercise identity" open item in `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` and the "inconsistent weight semantics" risk in `docs/fitness/BFG_EXERCISE_METADATA.md`.

Reason:

Duplicated exercise definitions inside workout content fragment weight history and make renames and video swaps break analytics. A single canonical library with immutable identity keeps history interpretable across years of content churn, while staying within the coach-authored, no-user-customization philosophy (Decision 040).

Implementation Status:
Not Implemented

Related Documents:
docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md, docs/fitness/BFG_EXERCISE_METADATA.md, docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, WORKOUT_CONTENT_GUIDE.md, BFG_MVP_SCOPE.md §2, Decisions 015, 020, 040

---

# Decision 042

Title:
Activity Information Hierarchy

Category:
UX

Status:
Accepted

Decision:
The Activity screen presents Assigned Workouts above Daily Quests. Assigned Workouts are always the primary content; Daily Quests are always secondary and must never be given the visual weight of a workout. This applies the training-primacy principle (Decision 020) to the Activity surface layout: training remains the primary progression source, and the screen hierarchy must reflect that ordering. Daily Quests live inside the Workouts/Activity area (Decision 004) as a supportive layer beneath the assigned workouts, never as a peer of training.

Reason:
The Activity surface must reflect the product's core economy ordering. If quests could rival workouts visually, the screen would contradict Decision 020 (training is the dominant progression source) and the supportive, capped role of quests (Decisions 016, 017).

Implementation Status:
Not Implemented — quests are a standalone `/quests` route today; no unified Activity surface with this hierarchy exists.

Related Documents:
BFG_UI_RULES.md §16, Decisions 004, 016, 017, 020, 043, 045, 046

---

# Decision 043

Title:
Continue Journey Routing

Category:
UX

Status:
Accepted

Decision:
"Continue Journey" (the primary Home CTA, Decision 039) opens the next assigned workout directly. It does NOT open the Activity screen. After a workout is completed, Continue Journey routes to the next assigned workout (Workout 1 complete → Continue Journey → Workout 2). This makes Home the primary resume surface and Activity a browsing surface: Home answers "continue now," Activity answers "what is my training." Activity therefore carries no competing global resume CTA.

Reason:
A single, frictionless resume path keeps the daily loop centered on Home and the Presence (Decisions 002, 039). Routing the user through an intermediate browsing screen to resume training would add friction to the primary action.

Implementation Status:
Not Implemented — the "Continue Journey" CTA itself is not yet built (Decision 039 Not Implemented), and no journey/sequence routing exists.

Related Documents:
BFG_UI_RULES.md §15 / §16, Decisions 002, 003, 004, 039, 042, 046 (journey model)

---

# Decision 044

Title:
Weight Logging Placement

Category:
Fitness System

Status:
Accepted

Decision:
Optional weight logging appears directly on the exercise screen. It does not appear before the workout, after the workout, or on any separate tracking screen, and it never appears on the Activity surface or on workout cards. Users may enter or ignore weight at any time while the exercise is on screen. Weight tracking remains optional and analytics-only — it never affects XP, levels, streak, or achievements (Decision 040) — and weight history is keyed to the immutable Exercise ID (Decision 041).

Reason:
Weight is captured at the only moment it is meaningful — while performing the exercise — keeping it frictionless and contextual, and keeping the Activity surface and workout cards free of analytics (Decisions 042, 045). This refines the placement left open by Decision 040.

Implementation Status:
Not Implemented — workout tracking and the exercise-screen weight field are not built (Decision 040 Not Implemented).

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md §4–§6, docs/fitness/BFG_EXERCISE_METADATA.md, Decisions 040, 041, 045

---

# Decision 045

Title:
Workout Card Composition

Category:
UX

Status:
Accepted

Decision:
Workout cards display only the Workout Title and the Exercise Count. Workout cards must NOT display previous results, analytics, categories, weight history, or progress metrics. Workout cards remain intentionally minimal. Detailed metrics belong on the Progress screen (Decision 008); per-exercise weight lives on the exercise screen (Decision 044).

Reason:
A calm, minimal card keeps the Activity surface a browsing list rather than a stat wall, consistent with the hero → actions → content hierarchy and the no-"wall of cards" rule (BFG_UI_RULES.md §2) and the product's emotion-over-statistics principle.

Implementation Status:
Not Implemented — no workout cards of this composition exist; the current model embeds exercises per workout.

Related Documents:
BFG_UI_RULES.md §16, Decisions 008, 040, 042, 044

---

# Decision 046

Title:
Workout Journey Architecture (MVP)

Category:
Fitness System

Status:
Accepted

Decision:
A user is assigned a workout **program** containing a finite but **non-fixed** number of workouts (2, 3, 4, 5, or any future amount). The architecture must not depend on a specific workout count. Workouts have a defined **sequence** (Workout 1 → 2 → 3 → …); after the final workout the cycle **repeats** from the first (e.g. 1 → 2 → 3 → 1 → 2 → 3; for a four-workout program: 1 → 2 → 3 → 4 → 1 → 2 → 3 → 4). The sequence/cycle model is generic and count-agnostic.

"Continue Journey" (Decision 043) resolves the next step in this journey in order:

1. If an unfinished workout exists → open the unfinished workout.
2. Otherwise → open the next workout in the current cycle.

Continue Journey must not depend on the number of workouts in the program; its purpose is "continue the next logical step in the current training journey." This decision supplies the journey/sequence model that Decision 043 routing depends on and that Decision 042 (Activity Information Hierarchy) presents as the ordered list of assigned workouts.

Reason:
Decision 043 specified that Continue Journey opens "the next assigned workout," but no document defined what "next" means. A generic, count-agnostic cycle keeps the resume logic and the Activity surface independent of program length, so coach-authored programs of any size work without architectural change.

Implementation Status:
Not Implemented — no program / sequence / cycle model or Continue Journey routing exists today (Decisions 042–043 are also Not Implemented).

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, Decisions 040, 042, 043, 045

---

# Registry Notes

## Duplicates detected (4)

Each duplicate in the input list was normalized — either registered as a single decision, or deliberately split into two cross-referenced decisions at different granularity (principle vs application, scope vs mechanics):

1. "Presence is the central emotional element" appeared in both the Unified Presence set and the Home Screen set → registered as Decision 002 (principle) and Decision 007 (screen application).
2. Legends appeared in both the Endgame content set and the standalone Legends set → Decision 026 lists scope; Decision 027 holds the mechanics.
3. Loyalty Rewards appeared in both the Endgame content set and the standalone Loyalty set → Decision 026 lists scope; Decision 028 holds the mechanics.
4. "Streak may grant Energy" appeared in both the Streaks set and the Energy set → registered once as Decision 022, with the Energy definition in Decision 024.

## Contradictions detected (0 unresolved)

No unresolved contradictions remain between accepted decisions and existing scope documents.

Decision 039 (approved Home composition) intentionally **refines** Decision 007: it adds an approved simplified progress layer (two rings + Stage Block) to the Presence-first Home. This is an explicit supersession of any "no progress indicators on Home" reading of D007, not an unresolved contradiction — D007 stays Presence-first and detailed metrics remain on Progress (Decision 008). The Weekly Progress indicator's presentation must honor the no-shame rule (Decision 031).

Decisions 042–045 (Activity Screen Architecture, accepted 2026-06-19) introduce no contradictions — they are explicit refinements of Decisions 004, 020, 039, and 040 (see the acceptance note under Implementation summary).

Decision 046 (Workout Journey Architecture, accepted 2026-06-19) introduces no contradictions — it supplies the count-agnostic journey/cycle model that Decisions 043 and 042 depend on (see the acceptance note under Implementation summary).

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

Resolved 2026-06-12: the economy rebalance (Decisions 010–020, 033) was implemented (P0A/P0B + data reset) and `BFG_GAME_SYSTEMS.md`, `BFG_MVP_SCOPE.md`, `BFG_SECURITY.md`, `CURRENT_STATE.md`, and `MVP_STATUS.md` were synced to it. Remaining drift is tracked in `BFG_PRODUCT_GAPS.md` (currently: the `CURRENT_PRIORITIES.md` Phase 3 deliverable pointer).

## Implementation summary

| Status | Count | Decisions |
|---|---|---|
| Implemented | 17 | 001, 010, 011, 012, 013, 015, 017, 018, 019, 020, 021, 023, 029, 030, 031, 032, 033 |
| Partially Implemented | 9 | 002, 007, 009, 016, 022, 035, 036, 037, 038 |
| Not Implemented | 20 | 003–006, 008, 014, 024–028, 034, 039–046 |

Total decisions: 46.
Contradictions: 0 (two first-draft items reclassified; one Currency ambiguity resolved by Decision 034 — see above).
Future Product Surface Notes: 2 (Nutrition, Multimedia).

Decisions 036–038 (Presence Response System) were accepted 2026-06-16 and registered together with the new `BFG_PRESENCE_RESPONSE_SYSTEM.md` specification; their Implementation Status reflects the codebase as of that date.

Decision 040 (Workout Tracking Philosophy) was accepted 2026-06-19 and registered together with the new `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` and `docs/fitness/BFG_EXERCISE_METADATA.md` specifications. It is the first decision in the new **Fitness System** category. It does not contradict `BFG_MVP_SCOPE.md §3.2` (the `workout_completions` log remains a post-MVP / soft-launch item): the decision records the tracking *philosophy* and its forward architecture, not an MVP build instruction.

Decision 041 (Centralized Exercise Library) was accepted 2026-06-19 and registered together with the new `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` specification. It supersedes the current embedded-exercise content model documented in `WORKOUT_CONTENT_GUIDE.md` (exercises defined per workout in `workout_exercises`): once implemented, exercises are authored once in the library and referenced by templates. The guide rewrite is deferred to implementation time and tracked in `BFG_PRODUCT_GAPS.md`. No MVP-scope contradiction: the library is maintainability/analytics infrastructure, not a user-facing customization feature (Decision 040 philosophy preserved).

Decisions 042–045 (Activity Screen Architecture) were accepted 2026-06-19 and registered together. They specify the Activity surface and refine prior decisions without contradiction: **D042** applies training primacy (Decision 020) and the quests-in-Workouts placement (Decision 004) to the Activity layout (Workouts primary, Quests secondary); **D043** specifies the routing of the "Continue Journey" CTA approved in Decision 039 (Home is the resume surface, Activity is a browsing surface that does not own resume); **D044** fixes the placement of the optional weight field left open by Decision 040 (exercise screen only, never on Activity or workout cards, analytics-only); **D045** fixes the minimal workout-card composition (Title + Exercise Count only). Activity-specific UI architecture is recorded in `BFG_UI_RULES.md §16`. All four are Not Implemented (current app has a standalone `/quests` route, no Activity surface, no "Continue Journey" CTA, and no workout-session/exercise screen). The journey/sequence model that D043 routing depends on is specified by Decision 046 (Workout Journey Architecture).

Decision 046 (Workout Journey Architecture) was accepted 2026-06-19 and resolves the journey/sequence follow-up left open by the D042–D045 sync. It defines a coach-assigned **program** of a finite but **non-fixed** number of workouts, a **generic, count-agnostic sequence** that **repeats as a cycle** after the final workout, and the **Continue Journey resume order** (unfinished workout first; otherwise the next workout in the cycle). It refines Decisions 042 and 043 without contradiction and is Not Implemented (no program/cycle model or routing exists today). It adds no new UI-composition rule, so `BFG_UI_RULES.md` was reviewed but not changed — the Continue Journey CTA stays on Home (§15) and the Activity surface rules (§16) are unaffected.
