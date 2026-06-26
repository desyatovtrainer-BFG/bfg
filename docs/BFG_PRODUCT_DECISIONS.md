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
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, docs/fitness/BFG_EXERCISE_METADATA.md, WORKOUT_CONTENT_GUIDE.md §12, BFG_GAME_SYSTEMS.md §2.2, BFG_MVP_SCOPE.md §3.1, Decisions 015, 020, 031, 049, 050, 053

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
BFG_UI_RULES.md §16, Decisions 004, 016, 017, 020, 043, 045, 046, 055

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
BFG_UI_RULES.md §15 / §16, Decisions 002, 003, 004, 039, 042, 046 (journey model), 059 (initial state)

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
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md §4–§6, docs/fitness/BFG_EXERCISE_METADATA.md, Decisions 040, 041, 045, 053

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
BFG_UI_RULES.md §16, Decisions 008, 040, 042, 044, 054, 055 (adds Workout Number)

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
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, docs/fitness/BFG_PROGRAM_ARCHITECTURE.md, Decisions 040, 042, 043, 045, 047, 050, 051, 058, 059, 061 (Program model)

---

# Decision 047

Title:
Workout Accessibility Model

Category:
Fitness System

Status:
Accepted

Decision:
All workouts remain visible and manually accessible at all times. There are no locked workouts and no hidden workouts. Within the repeating journey cycle (Decision 046), workouts later in the sequence are browsable, never gated: the cycle defines a recommended order and the "next" workout for Continue Journey (Decision 043), but it never restricts access. Consistent with the never-gated core loop (Decision 030).

Reason:
Locking workouts would contradict the calm, pressure-free philosophy and the never-gated core loop; the journey cycle is guidance, not a gate.

Implementation Status:
Not Implemented — no program/cycle surface exists yet (Decisions 042, 046 Not Implemented).

Related Documents:
BFG_UI_RULES.md §16, Decisions 030, 042, 043, 046, 048

---

# Decision 048

Title:
Workout State Model

Category:
UX

Status:
Accepted

Decision:
A workout card may display at most one state marker: **Upcoming Workout** or **Workout In Progress**. The two markers can never appear simultaneously. A card with no applicable state shows no marker.

Reason:
A single, mutually exclusive marker keeps the Activity list legible and avoids contradictory signals on one card.

Implementation Status:
Not Implemented — no Activity workout cards exist yet (Decision 045 Not Implemented).

Related Documents:
BFG_UI_RULES.md §16, Decisions 045, 046, 049, 050, 054, 055, 056, 057

---

# Decision 049

Title:
Workout Start Boundary

Category:
Fitness System

Status:
Accepted

Decision:
A workout starts only after the user presses **Start Workout**. Viewing a workout — its exercises, videos, or content — is never considered starting the workout. Start Workout is the single boundary that begins a workout (Decision 040).

Reason:
A precise, user-initiated start boundary keeps the start timestamp meaningful and separates browsing from training (Decisions 040, 052).

Implementation Status:
Not Implemented — the workout session start/finish flow is not built (Decision 040 Not Implemented).

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md §2–§3, BFG_UI_RULES.md §17, Decisions 040, 050, 052, 053, 058

---

# Decision 050

Title:
Workout Completion Boundary

Category:
Fitness System

Status:
Accepted

Decision:
A workout is completed only after Start Workout → Finish Workout. Only completed workouts advance the journey cycle (Decision 046). No workout data is recorded before Start Workout (Decision 053).

Reason:
Completion is the primary tracked event and the XP trigger (Decisions 015, 040); only a completed workout should move the cycle pointer.

Implementation Status:
Not Implemented — the start/finish flow and the journey cycle are not built (Decisions 040, 046 Not Implemented).

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md §2–§3, Decisions 015, 040, 046, 049, 051, 058

---

# Decision 051

Title:
Journey Pointer Logic

Category:
Fitness System

Status:
Accepted

Decision:
Journey progression follows the workout the user actually completes. If the user breaks the recommended cycle order, the cycle pointer advances from the workout that was completed, not from the previously expected "next" workout. The cycle order (Decision 046) is a recommendation; the pointer tracks actual completion (Decision 050).

Reason:
The journey should reflect what the user did, not what was expected; this keeps Continue Journey honest after out-of-order training and resolves the out-of-order pointer behavior left open by the Activity design.

Implementation Status:
Not Implemented — the journey cycle and pointer are not built (Decision 046 Not Implemented).

Related Documents:
Decisions 043, 046, 050

---

# Decision 052

Title:
Workout Start Awareness Model

Category:
UX

Status:
Accepted

Decision:
Before Start Workout, users may view exercises, view videos, and inspect workout content; content access is never blocked. While in this pre-start state, the system displays a persistent visual reminder that the workout has not been started. The reminder remains visible throughout the workout interface, including while viewing exercise videos. The reminder is presentation only — it never blocks content (Decisions 049, 030).

Reason:
Users should be able to preview a workout freely while always knowing it has not yet started, so the Start Workout boundary (Decision 049) stays clear without gating content.

Implementation Status:
Not Implemented — the workout interface is not built.

Related Documents:
BFG_UI_RULES.md §17, Decisions 030, 049, 053

---

# Decision 053

Title:
Weight Logging Availability

Category:
Fitness System

Status:
Accepted

Decision:
Weight input fields are hidden before Start Workout and become available only after Start Workout. No workout data may be recorded before the workout starts (Decision 050). Weight remains optional and analytics-only wherever it appears, on the exercise screen only (Decision 044).

Reason:
Weight is a record of work performed; it has no meaning before the workout begins, so the field appears only once the start boundary (Decision 049) is crossed.

Implementation Status:
Not Implemented — the workout session and the exercise-screen weight field are not built (Decisions 040, 044 Not Implemented).

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md §4–§5, BFG_UI_RULES.md §17, Decisions 040, 044, 049, 050

---

# Decision 054

Title:
Activity Visual Hierarchy

Category:
UX

Status:
Accepted

Decision:
All workout cards use the same visual size; the current workout is **never enlarged**. Visual emphasis is achieved through **state indicators and color only**, never through card-size differences. Card outline colors: **Default** workout — neutral / blue outline; **Upcoming** workout — orange outline + Upcoming marker; **Workout In Progress** — green outline + In Progress marker. The Decision 048 state model is unchanged — a card may display only one state (Upcoming Workout *or* Workout In Progress), never both. Activity visual hierarchy is achieved through **state, color, and position** (Decision 042), not card size. Activity is not a dashboard and not Home.

Reason:
Equal-size cards keep Activity a calm browsing surface rather than a dashboard or a Home-style focal composition; emphasizing the current workout by enlargement would import Home's hero treatment (Decision 039) into a surface whose job is orientation, not focus.

Implementation Status:
Not Implemented — no Activity workout cards exist yet (Decisions 045, 048 Not Implemented).

Related Documents:
BFG_UI_RULES.md §16 / §4, Decisions 039, 042, 045, 046, 048, 055, 056, 057

---

# Decision 055

Title:
Activity Screen Composition

Category:
UX

Status:
Accepted

Decision:
Activity is a functional navigation surface; Home remains the emotional center (Decisions 002, 039). Activity focuses on workouts and daily quests only.

- **Header:** displays "Activity" only — no date, no Today section, no motivational subtitle, no journey subtitle.
- **Section hierarchy:** (1) Workouts, (2) Daily Quests, each with a visible section header; Workouts always appear above Daily Quests (Decision 042).
- **Workout section:** workout cards render as a **vertical list** — no horizontal scrolling — always in **program order** (Workout 1, 2, 3, …); cards never reorder themselves. Current cycle position is communicated through **state markers only** (Decisions 048, 054), not by reordering.
- **Workout card content:** Workout Number, Workout Title, and Exercise Count — and nothing else (no categories, analytics, duration, previous results, or weight). This **extends Decision 045** by adding the Workout Number (program-order index) to the title and exercise count. Card states follow Decisions 048 and 054.
- **Daily Quests section:** a visible "Daily Quests" header, always below the workouts.
- **Quest state model:** a daily quest is **Completed or Not Completed only** — no partial progress, percentages, progress bars, or counters (e.g. "3/5 л", "8000/10000 шагов"), and no intermediate completion states. Done or Not Done.

Reason:
A plain, functional Activity surface keeps the emotional weight on Home (Decision 039) and the calm, no-metric philosophy intact: a fixed vertical list in program order is legible and count-agnostic (Decision 046), and a binary quest state avoids the progress-bar / loss-aversion framing the no-shame rule forbids (Decision 031).

Implementation Status:
Not Implemented — no Activity surface exists; quests are a standalone `/quests` route and workouts a flat `/workouts` catalog.

Related Documents:
BFG_UI_RULES.md §16, Decisions 017, 031, 042, 045, 046, 048, 054

---

# Decision 056

Title:
Completed Workout Card State

Category:
UX

Status:
Accepted

Decision:
After successful workout completion (Start Workout → Finish Workout), the workout card returns to the **Default state**: the default blue outline, no special marker. A completed workout does **not** receive a Completed state, a Finished state, or a dedicated color. Workout completion history belongs to the Progress screen (Decision 008), not Activity. This resolves the previously undefined "completed this cycle" card appearance — there is no completed card state; the card is simply Default until it becomes Upcoming again as the cycle advances (Decisions 046, 051).

Reason:
Activity is a calm, functional navigation surface (Decision 055), not a history/achievement surface; a dedicated completed state would add a fourth card state and import progress/history into Activity, which belongs on Progress (Decision 008).

Implementation Status:
Not Implemented — no Activity workout cards exist yet (Decisions 045, 048, 054 Not Implemented).

Related Documents:
BFG_UI_RULES.md §16, Decisions 008, 046, 048, 051, 054

---

# Decision 057

Title:
Marker Priority Model

Category:
UX

Status:
Accepted

Decision:
Only one special workout state may exist in the Activity workout list at a time. **Workout In Progress has absolute priority over Upcoming Workout.** If any workout is In Progress: no Upcoming marker is shown anywhere, and no orange card is shown anywhere. When the active workout is completed, the In Progress state disappears and the next workout in the cycle (Decision 046) becomes Upcoming. This preserves the one-state-per-card rule (Decision 048) at the list level — at most one special marker exists across the whole list.

Reason:
A single source of "where to act" keeps Activity legible and prevents two competing call-outs (an in-progress workout and a separate upcoming one) from appearing at once.

Implementation Status:
Not Implemented — no Activity workout list exists yet (Decisions 045, 048, 054 Not Implemented).

Related Documents:
BFG_UI_RULES.md §16, Decisions 046, 048, 051, 054, 058, 059

---

# Decision 058

Title:
Active Workout Exclusivity Model

Category:
Fitness System

Status:
Accepted

Decision:
The system may contain only one workout in the **Workout In Progress** state at a time. While an active workout exists, users may leave it, navigate anywhere in the app, open any other workout, watch videos, and inspect exercises (consistent with Decisions 047, 052) — but they may **not** start another workout. If a workout is already In Progress, other workouts do not show **Start Workout**; they show **Return To Workout** (or equivalent wording), and pressing it returns the user directly to the currently active workout. This decision does not introduce a workout cancellation system.

Reason:
A single active workout keeps the start/finish boundaries (Decisions 049, 050) and the journey pointer (Decision 051) unambiguous; routing other workouts' primary action to "Return To Workout" prevents a second concurrent session without ever blocking content access (Decision 047).

Implementation Status:
Not Implemented — the workout session start/finish flow is not built (Decisions 040, 049, 050 Not Implemented).

Related Documents:
docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md §2–§3, BFG_UI_RULES.md §17, Decisions 046, 047, 049, 050, 052, 057

---

# Decision 059

Title:
Initial Journey State

Category:
Fitness System

Status:
Accepted

Decision:
This decision defines the initial state of the workout journey for a brand-new user, resolving the journey-pointer initialization left open by Decision 046. When **no workout has ever been completed** and **no workout is currently In Progress**, the system initializes the journey pointer to **Workout 1**.

Activity behavior: Workout 1 receives the **Upcoming** state — the Upcoming marker and the orange outline (Decisions 054, 057). No other workout carries a marker (Decision 057 — one special state at a time).

Home behavior: "Continue Journey" (Decision 043) resolves to **Workout 1** for a brand-new user.

After the first completed workout (Start Workout → Finish Workout, Decisions 049, 050), the Workout Journey Architecture (Decision 046) becomes authoritative and all future navigation follows the normal repeating cycle (e.g. 1 → 2 → 3 → 1, or 1 → 2 → 3 → 4 → 5 → 1, depending on program size), with the pointer advancing from the workout actually completed (Decision 051).

This decision defines the initial journey state only. It does not introduce workout expiration, workout cancellation, workout reset, or automatic session recovery; started workouts continue to follow Decision 058 (Active Workout Exclusivity Model).

Reason:
Decision 046 defined the repeating cycle and the Continue Journey resume order but specified the "next workout" transition only after a completion (Decision 057), leaving the zero-completion initial state undefined. A new user with no history and nothing In Progress had no defined pointer value, Upcoming marker, or Continue Journey target. Initializing the pointer to Workout 1 makes the first render deterministic and keeps Activity and Home consistent from the first session, without adding any new state or session mechanic.

Implementation Status:
Not Implemented — no program/cycle model, journey pointer, or Continue Journey routing exists today (Decisions 043, 046 Not Implemented).

Related Documents:
BFG_UI_RULES.md §16, Decisions 043, 046, 051, 054, 057, 058

---

# Decision 060

Title:
Workout Step Architecture

Category:
Fitness System

Status:
Accepted

Decision:

- A workout consists of **Workout Steps**.
- The Workout Step is the **structural unit** of a workout.
- A Workout Step corresponds to a **single Workout Session screen**.
- A Workout Step may contain **one or two exercises**.
- A Workout Step does **not** represent an exercise.
- A Workout Step does **not** represent a superset.
- Supersets are represented by a Workout Step that contains **two exercises** — no Superset entity is introduced anywhere.
- The Workout Step is **fully controlled by the coach**.
- Step **count** may change between workout versions.
- Step **composition** may change between workout versions.
- Workout Tracking is **not** attached to the Workout Step.
- Weight History is **not** attached to the Workout Step.
- Progress analytics are **not** attached to the Workout Step.

The Workout Step is a **session-structure** concept only. It groups the canonical exercises of the Exercise Library (Decision 041) into the screens the user steps through during a session, and it carries no identity that user history depends on. Tracking and analytics continue to resolve to Workout Completion (Decision 050) and the immutable Exercise ID (Decision 041), never to a Step. This is what lets a coach freely re-author Step count and composition between workout versions without ever corrupting strength history. A two-exercise Step is the sole representation of a superset; the Exercise Library never stores supersets or any other workout structure.

Reason:

Workout Step provides a stable architecture for the workout session flow while keeping the Exercise Library independent from workout structure. It resolves superset representation, workout session structure, and workout preview structure in one entity, without introducing Superset entities into the Exercise Library and without coupling user history to mutable workout structure.

Implementation Status:
Not Implemented

Related Documents:
docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md, docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md, docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, WORKOUT_CONTENT_GUIDE.md §13, Decisions 040, 041, 046, 049, 050, 055

---

# Decision 061

Title:
Program Architecture

Category:
Fitness System

Status:
Accepted

Decision:

**Definition & assignment**

- A Program is a coach-authored, named, **ordered set of Workout Templates**.
- A Program is assigned to a user by **Sex × Fitness Level × Training Format (Home / Gym)**.
- The assignment mapping is deterministic: one (Sex, Level, Format) triple resolves to one active Program.
- A Program contains **2–5 Workout Templates**; the model is **count-agnostic** (Decision 046).
- The Program's template order **is** the Journey cycle order (Decision 046).
- A Program **references** Workout Templates by identity; it never embeds or duplicates them (reference-not-copy discipline of Decisions 041, 060).
- Users never build, choose, or edit Programs, workouts, exercises, sets, or reps (Decision 040). The user supplies only the three logistical inputs.
- A Program **does not end**; its workouts cycle continuously (Decision 046). All workouts stay visible and accessible (Decision 047).
- Program assignment grants nothing — no XP, Level, Stage, or Streak.

**Program Updates (same Program, new content)**

- Program Updates (coach refreshes content ~monthly) affect **future workout content only**.
- A Program Update must **not** affect XP, Level, Stage, Streak, Workout History, or Weight History.
- The Journey pointer is **position-based** and survives updates without reset (Decisions 046, 051); a slot-count change resolves the pointer to a valid workout and emits no progression event.
- Past completions reference a **content snapshot** taken at completion time, so updates never corrupt history (this resolves the Tracking Architecture §7 plan-snapshot open item).
- Weight History remains keyed to the immutable **Exercise ID** (Decision 041) and is therefore program-independent.

**Program Replacement (a different Program becomes active)**

- Program Replacement must **not** grant XP or modify Level, Stage, or Streak.
- **Edge case #1 — pointer on replacement:** the Journey pointer **resets to Workout 1 of the newly assigned Program** (Decision 059 logic). Cycle position is meaningful only inside the current Program; workout counts and ordering may differ between Programs.
- **Edge case #2 — replacement during an active workout:** Program Replacement does **not** cancel an In-Progress workout (Decision 058). The active workout completes against the **snapshot that existed when it started**; the newly assigned Program becomes active only after no workout is In Progress, at which point the pointer initializes to Workout 1 of the new Program.
- Workout History and Weight History are **retained** across replacement, never deleted or rewritten.
- At most, the **Avatar/Companion may neutrally comment** on a Program change (Decisions 031, 038).

**Program Version (internal architecture concept)**

- **Program Version** is an internal architecture concept; users do not interact with versions directly. Its purpose is safe content updates, monthly refreshes, historical consistency, and active-workout protection (via completion snapshots).

**Boundaries**

- A Program stores **no user data** (no pointer, history, or progress) and **no workout structure** (structure lives in Workout Steps/Templates, Decision 060; exercise identity in the Library, Decision 041).
- A Program is **not** a course, challenge, progression system, source of XP, or source of rewards. It exists only to determine which workouts are assigned to a user.

Reason:

The fitness stack defined the Exercise Library (D041), Workout Step and Workout Template (D060), and the Journey cycle/pointer (D046/D051/D059), but never formally defined the entity that selects which workouts a user receives — D046 used the word "program" without defining it. Program Architecture supplies that layer while structurally guaranteeing the accepted isolation rule: because progression derives only from workout completion (D040) and weight history is keyed to the immutable Exercise ID (D041), a Program that sits above templates and never touches the completion event or the Exercise ID cannot affect XP, levels, stage, streak, or history. Monthly content updates and program replacement therefore change future workout content only.

Implementation Status:
Not Implemented

Related Documents:
docs/fitness/BFG_PROGRAM_ARCHITECTURE.md, docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md, docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md, docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md, BFG_BEGINNER_JOURNEY.md, Decisions 040, 041, 046, 047, 051, 058, 059, 060

---

# Decision 062

Title:
Workout Start Screen

Category:
UX

Status:
Accepted

Decision:
The Workout Start Screen displays only the **Workout Title** and an **ordered Workout Step list** (e.g. "1. Squat / 2. Leg Press + Crunch / 3. Lunges"). Its primary button is **Start Workout**, or **Return To Workout** if another workout is already In Progress (Decision 058). The screen must NOT display duration, difficulty, categories, analytics, or companion content.

Reason:
A minimal pre-start screen keeps the surface calm and metric-free (consistent with Decisions 045, 055), shows the session shape through its Steps (Decision 060), and honors the Start Workout boundary (Decision 049) and the single-active-workout routing (Decision 058).

Implementation Status:
Not Implemented — no workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §18, Decisions 045, 049, 052, 055, 058, 060, 063, 068

---

# Decision 063

Title:
Workout Navigation

Category:
UX

Status:
Accepted

Decision:
Navigation through a workout is **swipe-only** — swipe forward and swipe backward between screens — with **no visible Next or Previous buttons**. The session flow is Workout Start Screen → Workout Step → … → Workout Finish Screen. Swiping forward past the final Workout Step opens the Workout Finish Screen (Decision 066).

Reason:
Swipe-only navigation keeps the session immersive and calm (BFG_UI_RULES.md §5, §13). Moving between Steps is navigation only and carries no completion meaning (Decision 060; Tracking Architecture §2).

Implementation Status:
Not Implemented — no workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §18, Decisions 060, 062, 066

---

# Decision 064

Title:
Single Exercise Step Layout

Category:
UX

Status:
Accepted

Decision:
A single-exercise Workout Step displays, in this vertical hierarchy: **Exercise Video → Exercise Title → Prescription (Sets, Reps or Duration) → optional Weight Field**. The video occupies the **primary visual position**. The weight field is **hidden before Start Workout and visible only after** (Decision 053).

Reason:
A video-first hierarchy matches the guided-session model and keeps the optional weight field last and gated to the started state (Decisions 044, 053). Detailed progress is not shown on the Step; it lives on the Progress screen (Decision 008).

Implementation Status:
Not Implemented — no workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §18, Decisions 008, 044, 053, 060

---

# Decision 065

Title:
Superset Step Layout

Category:
UX

Status:
Accepted

Decision:
A superset remains **one Workout Step** (Decision 060) and displays **both exercises simultaneously** in a **horizontal card structure** — Exercise 1 + Exercise 2. Each exercise card contains its own **Exercise Video**, **Exercise Title**, **Prescription**, and **independent Weight Field**. Videos use **vertical (portrait) orientation**. Rules: no separate Superset entity; **no "1/2" or "2/2" notation**; **no "2 exercises" label**; two independent weight fields; the two exercises remain visually distinct; and the user must immediately understand that the two exercises belong to one Step.

Reason:
A two-exercise Step is the sole representation of a superset (Decision 060). Showing both exercises simultaneously in distinct cards, each with an independent weight field, keeps each exercise identifiable for per-Exercise-ID weight history (Decisions 041, 044) while the screen still reads as a single Step.

Implementation Status:
Not Implemented — no workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §18, Decisions 041, 044, 053, 060, 064

---

# Decision 066

Title:
Workout Finish Screen

Category:
UX

Status:
Accepted

Decision:
The Workout Finish Screen is a **separate screen** reached after the final Workout Step (Decision 063). It displays **"Workout Complete"** and a **Finish Workout** button (the completion boundary, Decision 050). It shows **no companion content and no additional metrics**.

Reason:
A clean, dedicated completion screen keeps the Finish Workout boundary explicit (Decision 050) and the surface free of metrics and companion content (Decisions 040, 045).

Implementation Status:
Not Implemented — no workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §18, Decisions 050, 063, 067

---

# Decision 067

Title:
Workout Reward Modal

Category:
UX

Status:
Accepted

Decision:
After Finish Workout, the reward is presented as a **modal window over a dimmed background** — **not** a separate screen, **not** a bottom banner, **not** a toast. The modal shows **only the values that changed**, in priority order **Stage → Level → XP** (largest reward first; smaller rewards below).

Modal behavior depends on whether a Stage Evolution occurred:

- **No Stage growth:** the modal carries a single button — **Return To Activity** — which returns the user to the Activity screen.
- **Stage growth:** the modal has **no button**. After **5–7 seconds** it automatically transitions to **Home**, where the Evolution Animation plays (Decision 069). The user may **tap the modal to speed up** the transition to Home; the tap only accelerates the transition and can **never skip the Evolution Animation** (Decision 069).

Companion reactions remain **rare** and appear only for meaningful milestones (Decisions 036, 037).

Update note (2026-06-23, final version): this finalizes Decision 067, superseding the interim "Result Banner" presentation. The only-what-changed rule and the Stage → Level → XP ordering are unchanged; the surface is now a **modal over a dimmed background** with the auto-advance (Stage growth) / Return To Activity (no Stage growth) behavior above. Where any document still says "Result Banner," it means this Reward Modal.

Reason:
Showing only changes, largest-first, keeps reward feedback honest and calm (BFG_UI_RULES.md §5, §13). A modal over a dimmed background focuses the reward moment without a screen change, while never blocking via a toast or competing as a standing surface. Auto-advancing on Stage growth carries the user into the evolution moment on Home (Decisions 069, 002, 007); the tap-to-speed-up (never tap-to-skip) rule keeps the most significant progression moment unskippable (Decision 035). A rare companion reaction respects the event-driven Voice and its frequency governor (Decisions 035, 036, 037).

Implementation Status:
Not Implemented — no workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §18, Decisions 035, 036, 037, 066, 069, 070

---

# Decision 068

Title:
Workout Card Count Semantics

Category:
UX

Status:
Accepted

Decision:
The Activity **Workout Card displays Exercise Count**; the **Workout Start Screen displays Workout Steps**. **Exercise Count and Step Count are different concepts** — a two-exercise superset Step counts as two exercises but one Step. This clarifies the "Exercise Count" on the workout card (Decisions 045, 055) against the Workout Step model (Decision 060).

Reason:
Resolves the count ambiguity introduced when the Workout Step entity (Decision 060) was added after the card composition was fixed (Decisions 045, 055): the card counts exercises (movements), while the Workout Start Screen lists Steps (session screens).

Implementation Status:
Not Implemented — no Activity surface or workout session interface exists today.

Related Documents:
BFG_UI_RULES.md §16 / §18, Decisions 045, 055, 060, 062

---

# Decision 069

Title:
Evolution Reveal Flow

Category:
UX

Status:
Accepted

Decision:
A **Stage Evolution overrides the post-reward destination** and routes to **Home**, where the Evolution Animation plays — regardless of whether a workout or a quest triggered it.

- **Normal workout completion:** Finish Workout → Reward Modal → **Return To Activity** (Decision 067 — no Stage growth, modal button).
- **Normal quest completion:** Quest Complete → Reward Display → **remain on Activity**.
- **Workout causing Stage Evolution:** Finish Workout → Reward Modal → **Home → Evolution Animation**.
- **Quest causing Stage Evolution:** Quest Complete → Reward Display → **Home → Evolution Animation**.

Rules (final version, 2026-06-23):

- **Stage Evolution has absolute priority** over the current screen; the reason for the evolution does not matter.
- The **transformation cannot be skipped**.
- On Stage growth, the Reward Modal has no button and auto-advances to Home after 5–7 seconds (Decision 067). A **tap may speed up the transition to Home**, but a **tap can never skip the Evolution Animation**.
- **Home is the emotional stage for the avatar transformation.**

Update note (2026-06-23, final version): this finalizes Decision 069. The destination logic is unchanged; the post-reward surface is the **Reward Modal** (Decision 067, finalized) rather than a "Result Banner," and the unskippable-transformation / tap-to-speed-up-not-skip rules are made explicit.

Reason:
The Stage Evolution is the most significant progression moment (Decision 035) and the living Presence on Home is the emotional center of the product (Decisions 002, 007, 039). Staging every evolution on Home, regardless of trigger, keeps the transformation where the Presence lives. Making the transformation unskippable (tap accelerates, never skips) protects the milestone weight of the evolution moment. Non-evolution completions return to the surface the user came from (Activity), so only the milestone moment redirects.

Implementation Status:
Not Implemented — no workout session interface, reward flow, or evolution reveal routing exists today.

Related Documents:
BFG_UI_RULES.md §15 / §18, Decisions 002, 007, 035, 039, 066, 067, 070

---

# Decision 070

Title:
Deferred Progress Visualization

Category:
UX

Status:
Accepted

Decision:
After any progression change, the system must persist **the last visually-shown state of each progress surface separately** — not a notion of "unviewed XP." The user must always be able to **see the progress indicators move**, even when the underlying change happened significantly earlier (e.g. between sessions, after the app was closed, or while the user stayed on a screen that does not show that indicator).

**Per-screen visualization memory.** Each screen owns an **independent** record of the last state it visually presented. When a screen is opened and its current value differs from its last-shown value, the screen **animates from the last-shown state to the current state**; after the animation completes, that screen's memory is updated to the current state ("cleared"). Memory is per-screen and never shared:

- **Home memory.** Home has its own visualization memory covering at least its **Level Progress Bar** (progress between the current and next stage) and its **Activity Progress Ring** (e.g. 12/24). If the user has not yet seen an update, Home animates from the last-seen state to the current state; after the animation, Home's memory is cleared.
- **Progress memory.** The Progress screen has its own independent visualization memory covering its progression elements (e.g. **XP Progress, Level Progress, Stage Progress, and any other progression elements present**). Its animations play independently of Home.
- **Independence rule.** Viewing Home does **not** clear Progress memory; viewing Progress does **not** clear Home memory. Each surface is satisfied only when that surface itself has shown its animation.

**Scenarios that must resolve correctly** (non-exhaustive): completed a workout; completed a quest; closed the app; stayed only on Activity for a long time; visited Home but not Progress; visited Progress but not Home.

Reason:
Progress movement is the felt reward, not the number itself. If a bar simply appears already-full because the change happened off-screen, the user never experiences the progression. Persisting the last-shown state per screen (rather than a single global "unviewed" flag) guarantees that every progress surface plays its movement exactly once, on the first visit after a change, regardless of which screen the change happened on or how much time passed — without double-counting across screens. This keeps the reward honest and calm (BFG_UI_RULES.md §5, §13) and consistent with the no-shame rule (Decision 031): the animation is acknowledgment of movement, never pressure about what was missed.

Implementation Status:
Not Implemented — no Home rings/bars, Progress screen hierarchy (Decision 008), or visualization-memory persistence exist today (Decisions 008, 039 Not Implemented).

Related Documents:
BFG_UI_RULES.md §15 / §19, Decisions 008, 031, 035, 039, 067, 069

---

# Decision 071

Title:
Final Home Product Structure

Category:
UX

Status:
Accepted

Decision:
The MVP Home screen adopts the final Home structure. This decision **finalizes** the Home composition begun in Decision 039: it confirms the accepted elements, **closes the open Presence-Voice placement question** left by Decision 039 (#9), standardizes the ring vocabulary across Decisions 039 and 070, and defines the Outer Ring's activity model.

Home is the emotional center of BFG. It is not a dashboard, not an activity feed, not a statistics screen, and not a workout list. Home answers one question: **"Where is my Presence now, and how do I continue the journey?"**

**MVP Home composition (top → bottom):**

1. Minimal Header
2. Living Presence Zone
3. Two Open Progress Rings (around the Living Presence)
4. Stage Block
5. Event-driven Voice Slot
6. Primary CTA: Continue Journey
7. Bottom Navigation

**Minimal Header.** Home carries a minimal header whose only standing function is **Profile access via a small header button** (Decision 006 — Profile is administrative, reached by a small header button, not a bottom-nav tab). **No notification bell in MVP** (notification surfaces were out of scope at Decision 039 and are deferred here to post-MVP).

**Two Open Progress Rings.** Home contains **exactly two** progress rings around the Living Presence: an **Inner Ring — Level Progress** and an **Outer Ring — Weekly Activity Progress**. No additional rings, meters, bars, XP gauges, streak rings, quest rings, or raw progress indicators are allowed on Home. Both are **open rings / open arcs**, never fully closed circles. Each ring must have: a visible start; a visible end; a deliberate split / open segment; a value label placed inside or near the split zone; and a calm fill animation when its value changes (calm motion budget — BFG_UI_RULES.md §5, §13; no casino-style sweeps).

**Inner Ring — Level Progress.** Represents Level Progress; shows the current level value (e.g. "12 УР."); arc fill represents progress toward the next level; does not reset weekly; belongs to long-term vertical progression; participates in Home visualization memory (Decision 070). The Inner Ring is an **open ring** — this standardizes the "Level Progress bar/ring" wording of Decision 070 / §19 in favor of a ring.

**Outer Ring — Weekly Activity Progress.** Represents Weekly Activity Progress; shows the weekly activity count (e.g. "12/24 АКТ."); arc fill represents weekly activity completed against weekly activity capacity. One completed workout = one activity; one completed daily quest = one activity; **only completed actions count**. Opening the app, viewing a workout, viewing a quest, maintaining a streak, entering weight, visiting Home/Progress, profile actions, and passive app time **do not count**. The Outer Ring resets at the start of each new UTC week (MVP); previous weekly activity belongs to Progress / History, not Home. It must never be framed as debt, failure, quota pressure, or punishment (no-shame rule, Decision 031; no-ledger principle, BFG_Companion_Doctrine.md §X). The Voice must never reference the ring as a quota or target.

**Weekly Activity denominator.** Weekly activity capacity = **21 daily-quest activities** (3 quests × 7 days, Decision 017) **+ the active Program's cycle length** (its number of Workout Templates, 2–5 per Decision 061). The workout term is the **active Program cycle length**, **not** "workouts per week" — this stays compatible with the count-agnostic Journey/Program model (Decisions 046, 061), which defines no weekly workout cadence. Mapping: cycle length 2 → 23 · 3 → 24 · 4 → 25 · 5 → 26. Therefore "12/24 АКТ." means 12 activities completed during a week whose active Program has a 3-workout cycle. **Week boundary:** the UTC week (consistent with the UTC-day model in BFG_GAME_SYSTEMS.md). **Overflow:** if completed activity exceeds the denominator (the cycle can repeat within a week), Home shows a **capped** value (e.g. "24/24 АКТ."); any deeper history or overflow belongs to Progress / History, not Home.

**Stage Block.** Sits directly under the Living Presence; contains a Stage Title + Stage Number (example structure: SEEKER / STAGE 3; final stage names and Russian copy may change later — the structure is fixed, the words are not). During a Stage Evolution, Home becomes the stage for the transformation (Decision 069); after evolution completes, the Stage Block shows the updated stage.

**Voice Slot.** Home may contain a Voice Slot under the Stage Block. **This closes the open Voice-placement question from Decision 039 (#9) and BFG_UI_RULES.md §15.** It is **not** a permanent companion text panel: Voice is event-driven and rare; idle Home may show no voice line. Voice follows the Companion Doctrine and the Presence Response System (Decisions 036–038): calm, restrained, specific, no hype, no guilt, no pressure. This placement decision does not promote the Voice to a standing fixture or change its cadence.

**Continue Journey.** Home has one primary CTA: Continue Journey. It opens the next assigned workout directly and does not open Activity (Decision 043). Routing: brand-new user → Workout 1 Start Screen (Decision 059); normal cycle → next workout in the current Program cycle (Decision 046); active workout exists → the active workout session (Decision 058). No competing primary CTA is allowed on Home.

**Home must not show:** workout list; quest list; raw XP table; achievement grid; detailed statistics; activity history; strength analytics; weight history; profile/account details; subscription details; multiple primary CTAs; permanent companion chat panel; notification bell (MVP); a third progress ring; a streak ring; a separate XP ring; a quest progress ring; red failure states; shame copy; motivational hype copy; casino-style reward animation.

**MVP scope of this decision:** Living Presence as central Home focus; exactly two open progress rings; Inner Ring = Level Progress; Outer Ring = Weekly Activity Progress; weekly (UTC) reset for the Outer Ring; one workout = one activity; one quest = one activity; Stage Block; event-driven Voice Slot; Continue Journey CTA; Profile as small header access; accepted bottom navigation (Decision 003).

**Post-MVP (deferred):** notification bell; notification center; richer idle interactions; advanced Home personalization; cosmetics showcase on Home; deep weekly recap; manual Home customization; multiple Home layouts; complex companion conversation on Home.

Reason:
Decision 039 approved the Home composition (Presence, two rings, Stage Block, Continue Journey) but left the Voice placement open and never defined the Outer Ring's activity model or denominator. D071 finalizes the structure so Home can be built without further ambiguity: it keeps the Presence as the emotional center, fixes the two rings as calm open arcs, and defines the Weekly Activity Ring in a way that is honest (only completed actions count), calm (no debt/quota framing, capped overflow), and architecturally compatible with the count-agnostic Program/Journey model (the denominator reads the active Program's cycle length, never a non-existent weekly workout quota).

Implementation Status:
Not Implemented — no Home rings/bars, Stage Block, Voice Slot, Continue Journey CTA, or weekly-activity counting exist today (Decisions 008, 039 Not Implemented).

Related Documents:
BFG_UI_RULES.md §15 / §19, docs/ui/BFG_SCREEN_WIREFRAMES.md, BFG_Companion_Doctrine.md, Decisions 002, 003, 006, 007, 008, 017, 031, 036, 037, 038, 039, 043, 046, 059, 061, 069, 070

---

# Decision 072

Title:
Final Progress Screen Product Structure

Category:
UX

Status:
Accepted

Decision:
The Progress screen is the identity / history / progression surface. It answers
"Кем я стал? Как я развиваюсь? Что уже накопилось в моей истории?" — identity,
trajectory, and accumulated archive. It is retrospective; Home (Decision 071) is
the living present. This decision finalizes and **refines Decision 008** (block
hierarchy) and Decision 005 (Avatar + Progress + Profile merge).

1. Composition, top → bottom: Minimal Header (title + small Profile button) →
   Primary Identity Block → Secondary Progression Block → Additional Archive
   Block → Bottom Navigation.

2. Primary Identity Block — identity ("кем я стал"):
   - Static identity portrait. Progress shows the avatar's current evolved and
     customized form as a STILL image. It does not move, animate, breathe, or
     respond to taps, and it is NOT a customization entry point.
   - One avatar, two representations (Decision 001). The Home Living Presence and
     the Progress portrait are not separate avatars — they are two renderings of
     the same single avatar identity and the same visual state. Home renders the
     live, interactive, customizable form; Progress renders a static,
     non-interactive portrait of that same form.
   - Read-side synchronization. The Progress portrait always reflects the current
     customized avatar state (appearance, clothing, cosmetics, current evolved
     stage form). Any change made in Avatar Customization (entered from Home,
     Decision 073) is reflected in the Progress portrait. The portrait is never
     stale, yet it updates statically and silently — no movement, no tap
     transition, no animated reveal, no celebration.
   - Stage / Evolution identity, shown as journey position ("Stage 3 of 10" /
     "3 из 10") — never quota, deficit, or completion framing.
   - Legend slot (system-assigned only, Decision 027; never user-selected, no
     classes), with a pre-Legend placeholder ("Path is still forming"; final
     Russian copy later) framed as emerging identity, never empty or missing.
   - The portrait must not claim Home's dominant, living, emotional-center role.
     The differentiator is living + interactive (Home) vs still + inert
     (Progress), not size. Progress must not become a second Home.

3. Secondary Progression Block — trajectory ("как я развиваюсь"): Level, XP
   (progress toward next), Streak, Stage position. Calm accumulation framing.
   Streak is continuity, never currency (Decision 021) and never pressure
   (Decisions 031, 038).

4. Additional Archive Block — archive ("что накопилось"): History, Statistics,
   Achievements — all as entry points / progressive disclosure, never dense
   inline dashboard walls.
   - History: a private chronicle of completed workouts and evolution milestones
     (receives completion history, Decision 056).
   - Statistics: opt-in, support not hero; strength stats appear only after the
     first weight is logged (Decision 040), with no empty-state pressure.
   - Achievements: live inside the Additional block; MVP = lightweight earned
     shelf / preview; Post-MVP = full Achievement Constellations / collection
     grid (Decision 026). Achievements must not outrank the Primary Identity
     block; no completion-%, no rarity comparison, locked = quiet potential.

5. Profile access: one shared account/profile surface reached via the small
   header button (Decision 006), present on both Home and Progress.
   Administrative; not a bottom-nav tab; not an inline Progress block. Profile is
   not the primary emotional entry into avatar customization (Decision 073).

6. D070 Progress visualization memory (independent from Home, Decision 070,
   BFG_UI_RULES §19): participants are XP Progress, Level Progress, Stage
   Progress. Non-participants: Streak, History, Achievements, Statistics, and the
   static portrait (a state display, not an animated progression indicator).
   Viewing Home never clears Progress memory; viewing Progress never clears Home
   memory. Portrait synchronization is not a D070 catch-up animation — it is a
   silent static update, outside the §19 path.

Forbidden on Progress:
leaderboards; PvP; social comparison; leagues; followers/kudos feed;
user-selected classes; gear/loadout stats; closed rings / perfect-week framing;
red failure states; shame copy; streak-loss pressure; numeric Energy / readiness
/ daily-verdict scores; performance-gated rewards (e.g. a crown for hitting a
score); completion-% or rarity pressure; rank/level overlaid on the avatar;
avatar built for social identification; empty-state pressure to log weight;
dense analytics walls; duplicating Home's two rings; duplicating Home's
"Continue Journey" CTA; duplicating Home's living/interactive Presence role; an
interactive or tappable avatar on Progress; any avatar movement, idle animation,
or tap transition on Progress; customization entry from the Progress portrait;
casino-style animation.

Reason:
Home (Decision 071) deliberately excludes detail, so Progress must absorb
identity, progression, history, statistics, and achievements while staying calm
and never becoming a second Home. A web-verified benchmark (Duolingo, Strava,
Apple Fitness, Fitbit, Garmin, Whoop, Oura, Habitica, Steam, Fitbod/Freeletics/
NTC) confirmed the structure: identity-screen apps keep the avatar small and
non-dominant; the apps with no identity figure (Apple Activity, Whoop, Oura) are
exactly the verdict/dashboard surfaces BFG must avoid; the only dominant-avatar
model (Habitica) is bound to chosen class + gear, which BFG forbids
(Decision 027). A static, non-interactive, always-synchronized portrait gives
identity its anchor while keeping the living, interactive, customizable Presence
unique to Home.

Implementation Status:
Not Implemented — current /progress shows an XP bar, streak panel, and evolution
block in legacy order; the three-block hierarchy, static portrait, Legend slot,
History/Statistics/Achievements blocks, and D070 Progress memory do not exist.

Related Documents:
BFG_UI_RULES.md §20 (Progress), §19 (D070 memory); ui/BFG_SCREEN_WIREFRAMES.md
(Progress section); Decisions 001, 005, 006, 008, 026, 027, 040, 056, 070, 071,
073.

---

# Decision 073

Title:
Avatar Customization Entry & Interaction

Category:
UX

Status:
Accepted

Decision:
This decision defines how avatar customization is entered and how the single
avatar visual state is owned. It **refines Decision 071** (which specified the
Home Living Presence and the single "Continue Journey" CTA but did not define
what tapping the Presence does). It deliberately separates the ENTRY MODEL
(decided now) from CUSTOMIZATION CATALOG DEPTH (scoped later).

1. Entry model (decided now):
   - Tapping the Home Living Presence opens Avatar Customization / Appearance /
     Clothing. The Home Living Presence is the primary — and in MVP the only —
     emotional entry into avatar customization.
   - The tap is an affordance on the Presence itself, not a competing button; it
     does not violate the single-primary-CTA rule (Decision 071, "Continue
     Journey" remains the only primary CTA).
   - The tap may use a short, calm transition (BFG_UI_RULES §5, §13). Its purpose
     is navigation to customization with a clear product result — not a
     decorative or standalone tap-reaction.
   - Progress never opens customization (Decision 072). The Profile header button
     (Decision 006) may hold account/subscription/settings and may expose a
     secondary/administrative customization path post-MVP, but Profile is not the
     primary emotional entry into customization.

2. Write-side single source of truth (MVP correctness):
   - Avatar Customization writes to one shared avatar visual state (appearance,
     clothing, cosmetics, current evolved stage form).
   - Every avatar surface reads from that single state — the Home live Presence
     and the Progress static portrait included. No surface holds a divergent
     copy (Decision 001 at the rendering layer).
   - Home ↔ Progress visual parity is therefore a correctness property, not a
     polish feature: a change saved in customization is immediately the truth for
     every avatar surface.

3. Customization catalog depth (scoped later, may be MVP or Post-MVP):
   - The interaction model and navigation entry (item 1) and the shared-state /
     visual parity (item 2) are accepted now.
   - The actual customization depth — clothing catalog, cosmetics catalog,
     currency-linked cosmetics (Decision 034), and rich editor depth — is not
     locked to MVP by this decision and will be scoped separately. Cosmetics
     never affect gameplay or progression (Decision 029); currency-bought items
     are personalization only (Decision 034).

Reason:
Tapping the Presence gives the avatar interaction a clear product result
(navigation to customization) instead of a decorative tap-reaction, and makes
Home the single emotional home of avatar identity and change. Separating the
entry model from catalog depth lets the interaction and the one-avatar
correctness invariant be settled now, while content depth follows later scope
without reopening the navigation model.

Implementation Status:
Not Implemented — the current dashboard shows a static stage-colored avatar; the
living Presence, the tap-to-customize entry, the customization surface, and the
shared avatar visual state do not exist.

Related Documents:
BFG_UI_RULES.md §15 (Home); ui/BFG_SCREEN_WIREFRAMES.md (Home annotation);
Decisions 001, 006, 029, 034, 071, 072.

---

# Decision 074

Title:
Entry / Auth Start Screen (unauthenticated first contact)

Category:
UX

Status:
Accepted

Decision:
The first unauthenticated screen is an atmospheric Entry / Auth Start screen —
not a raw email/password form and not a marketing landing page. It makes calm,
premium first contact and leads into Sign Up (email/password, MVP), then
onboarding, with a quiet Log In path for returning users. D074 governs the Entry
/ Auth Start screen only.

1. Seed Form (First Presence Form).
   - A neutral, unfinished pre-presence: not gendered, not customized, never a
     default/final avatar, and never Stage 10 or any evolved form (Decision 010).
   - It is a pre-figuration of the Presence, NOT the user's avatar. The default
     avatar is received only after onboarding.
   - Alive but minimal (breathing + subtle glow — the MVP Body floor) and
     Voice-silent: the first-ever Presence Voice moment belongs to the first
     session after account creation (BFG_PRESENCE_RESPONSE_SYSTEM.md §4) and must
     not be consumed on the Entry screen.

2. Seed Form interaction is context-scoped (no global clickable / non-clickable
   rule). On the Entry / Auth Start screen, Seed Form is tap-reactive decoratively
   but is not a navigation affordance.
   - The tap does not navigate, does not open auth, does not open onboarding, does
     not open customization, does not show Voice / companion text, and does not
     show any modal, tooltip, or text hint. It never becomes a second CTA.
   - Permitted tap response (a decorative path hint only): softly stir / pulse /
     brighten the Seed Form; send a subtle glow / path toward the primary CTA;
     and / or softly highlight the primary CTA. The response is a short, calm
     moment within the existing motion budget (BFG_UI_RULES.md §5 / §13 — up to
     ~600ms, prefers-reduced-motion respected, degrading to a static emphasis). It
     stays calm, premium, non-casino, and non-marketing.
   - Onboarding Seed Form behavior is outside D074 scope and will be specified
     separately by future onboarding decisions. Boundary note only: a later
     onboarding Seed Form should not become a repeated tap target. D074 neither
     defines nor overrides any onboarding Seed Form interaction, and there is no
     accepted onboarding Seed Form decision today.

3. Single primary action.
   - Exactly one primary CTA leads to Sign Up; it is the only path forward. The
     Seed Form's decorative tap-reactivity does not make it a competing action
     (single-primary-CTA discipline, Decisions 071, 073; the Body never reaches,
     companion/BFG_Companion_Doctrine.md §X). A low-emphasis secondary Log In link
     serves returning users.

4. Copy & tone (principles only — no final copy approved).
   - Calm, sentence-case headline + optional one-line subtitle; no all-caps
     motivational headline, no exclamation marks, no win / achievement /
     competition framing ("победы" and equivalents are forbidden — Decision 032,
     BFG_UI_RULES.md §11), no corporate fitness vocabulary, warm "ты", no emoji.
     The screen does not over-explain and is not aggressive marketing.
   - D074 approves structure, interaction rules, and copy principles only. No
     final headline / subtitle / CTA copy is approved by this decision; all
     current text variants are placeholders and remain editable later.

5. No trial / subscription on entry.
   - No 30-day trial, pricing, or subscription state on the Entry screen (these are
     account / profile details, Decision 006, and never gate the core loop,
     Decision 030). A quiet trial-reassurance line is Post-MVP only, never hype.

6. Layout.
   - Mobile-first 360–430px is the source of truth, dark / calm; the entire screen
     fits the initial viewport with NO SCROLL (BFG_UI_RULES.md §1, BFG_MVP_SCOPE.md
     §5.1).

Reason:
First contact sets the emotional contract. A Seed Form that is alive but
identity-less keeps the promise ("this will become yours") without showing the
final form early (Decision 010), without spending the real first Presence moment,
and without the Body reaching (Doctrine §X). Decorative tap-reactivity rewards
curiosity and gently points at the one way forward while keeping a single
unambiguous primary action; keeping trial and marketing off the screen keeps it
calm and honest rather than a conversion-anxious landing page.

Implementation Status:
Not Implemented — the current start screen has an all-caps motivational headline
("...ТВОИ ПОБЕДЫ"), a descriptive paragraph, a central placeholder form, and
"Старт" / "Есть аккаунт" buttons; the Seed Form treatment, calm copy, the
decorative tap-hint, and the single-CTA + Log-In structure are not built.

Related Documents:
BFG_UI_RULES.md §21 (Entry / Auth Start); ui/BFG_SCREEN_WIREFRAMES.md (Entry /
Auth Start section); companion/BFG_Companion_Doctrine.md §X / §XI;
BFG_PRESENCE_RESPONSE_SYSTEM.md §4; BFG_MVP_SCOPE.md §2.1; Decisions 001, 006,
010, 030, 031, 032, 071, 073. (Onboarding Seed Form role: governed separately by
future onboarding decisions — none accepted yet.)

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

Decisions 047–053 (Activity / Workout-session UX, accepted 2026-06-19) introduce no contradictions — they are explicit refinements: D047/D048 of the Activity surface (D042, D045, D046), D049/D050 of the tracking boundaries (D040), D051 of the journey pointer (D046), and D052/D053 of the pre-start workout interface (D044, D049). See the acceptance note under Implementation summary.

Decision 054 (Activity Visual Hierarchy, accepted 2026-06-19) extends D045 and D048 without contradiction (equal-size cards; emphasis via state/color/position, never size). One **palette item to reconcile, not a contradiction:** D054 introduces **orange** (Upcoming) and **green** (In Progress) card-outline accents, which extend the base palette documented in `BFG_UI_RULES.md §4` (sky/violet/rose/cyan). Recorded as a follow-up for the §4 palette pass; §16 now states the Activity card colors.

Decisions 056–058 (Workout state architecture, accepted 2026-06-19) introduce no contradictions — they are explicit refinements: D056/D057 of the Activity card states (D048, D054), D058 of the workout-session boundaries and journey (D046, D049, D050, D057). D056 confirms there is no fourth ("completed") card state — a finished workout returns to Default, history lives on Progress (D008); D057 preserves the one-state rule (D048) at list level (In Progress has absolute priority over Upcoming); D058 forbids a second concurrent session and routes other workouts' primary action to "Return To Workout" without blocking content (D047). See the acceptance note under Implementation summary.

Decision 055 (Activity Screen Composition, accepted 2026-06-19) extends D042, D045, D048, and D054 and does not modify D039/D046. One **extension to note, not a contradiction:** D055 **adds the Workout Number** to the workout card, so the D045 "Title + Exercise Count only" composition becomes **Workout Number + Title + Exercise Count** (the D045 forbidden list — categories/analytics/duration/previous results/weight — is unchanged). The binary quest state (Completed / Not Completed, no counters or progress bars) is consistent with the no-shame rule (D031) and does not change the quest catalog/selection model (D016, D017, D033).

Decision 059 (Initial Journey State, accepted 2026-06-20) introduces no contradictions — it extends D043, D046, and D057 by defining the zero-completion initial pointer (Workout 1 as Upcoming; Continue Journey resolves to Workout 1) and **does not modify D058**. It adds no expiration, cancellation, reset, or session-recovery mechanic. See the acceptance note under Implementation summary.

Decision 060 (Workout Step Architecture, accepted 2026-06-20) introduces no contradictions — it adds a new session-structure entity (the Workout Step) above the Exercise Library and below the Workout Template, and refines the existing fitness architecture without altering it: tracking still resolves to Workout Completion (D050) and the immutable Exercise ID (D041), never to a Step; the Exercise Library (D041) still stores exercises only and never workout structure or supersets; the no-mandatory-logging philosophy (D040) is untouched. The "superset representation" item left open by the Exercise Library work is resolved here (a superset is a two-exercise Step), and no Superset entity is introduced. See the acceptance note under Implementation summary.

Decision 061 (Program Architecture, accepted 2026-06-22) introduces no contradictions — it formalizes the entity above the Workout Template (the Program) that D046 referenced informally as "program" without defining. It refines D040/D041/D046/D047/D051/D058/D059/D060 without altering them: progression still derives only from workout completion (D040); weight history stays keyed to the immutable Exercise ID (D041); the count-agnostic repeating cycle and pointer are unchanged (D046/D051); all workouts stay accessible (D047); the single-active-workout rule is honored on replacement (D058); the pointer resets to Workout 1 on replacement using the initial-state logic (D059); and the content hierarchy now reads Program → Workout Template → Workout Step → Exercise (D060). Program Updates and Program Replacement affect future workout content only and never XP/Level/Stage/Streak/Workout History/Weight History. D061 also **resolves the Tracking Architecture §7 open item "Plan snapshot at completion"** by requiring completions to reference a content snapshot. See the acceptance note under Implementation summary.

Decisions 062–069 (Workout Session Architecture, accepted 2026-06-22) introduce no contradictions — they are explicit UX refinements of the accepted session model: **D062** (Start Screen) extends the minimal-surface rules (D045, D055) and the start/return routing (D049, D058); **D063** (swipe-only navigation) builds on Step navigation carrying no completion meaning (D060); **D064/D065** fix the single-exercise and superset Step layouts on the Workout Step entity (D060) with weight gated post-start (D053, D044); **D066** (Finish Screen) and **D067** (Result Banner — since finalized as the **Reward Modal**, 2026-06-23, see Decision 067) sit on the completion boundary (D050) and the event-driven Voice (D036, D037); **D068** resolves the card "Exercise Count" vs Step-count ambiguity flagged in the Activity architecture review (D045, D055 vs D060); **D069** stages every Stage Evolution on Home, consistent with Home as the emotional center (D002, D007, D039) and the evolution-as-milestone moment (D035). One **UI item to reconcile, not a contradiction:** D065's **horizontal two-card superset layout with vertical-orientation videos** must be reconciled at mobile width with `BFG_UI_RULES.md §1` (mobile-first 360–430px) and the §13 "no carousels where a list would do" guidance — the two cards are shown simultaneously (not a scrolling carousel) and the portrait video orientation is chosen to fit the two-up layout; recorded as a §1/§13 reconciliation follow-up. See the acceptance note under Implementation summary.

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
| Not Implemented | 48 | 003–006, 008, 014, 024–028, 034, 039–074 |

Total decisions: 74.
Contradictions: 0 (two first-draft items reclassified; one Currency ambiguity resolved by Decision 034 — see above).
Future Product Surface Notes: 2 (Nutrition, Multimedia).

Decisions 036–038 (Presence Response System) were accepted 2026-06-16 and registered together with the new `BFG_PRESENCE_RESPONSE_SYSTEM.md` specification; their Implementation Status reflects the codebase as of that date.

Decision 040 (Workout Tracking Philosophy) was accepted 2026-06-19 and registered together with the new `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` and `docs/fitness/BFG_EXERCISE_METADATA.md` specifications. It is the first decision in the new **Fitness System** category. It does not contradict `BFG_MVP_SCOPE.md §3.2` (the `workout_completions` log remains a post-MVP / soft-launch item): the decision records the tracking *philosophy* and its forward architecture, not an MVP build instruction.

Decision 041 (Centralized Exercise Library) was accepted 2026-06-19 and registered together with the new `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` specification. It supersedes the current embedded-exercise content model documented in `WORKOUT_CONTENT_GUIDE.md` (exercises defined per workout in `workout_exercises`): once implemented, exercises are authored once in the library and referenced by templates. The guide rewrite is deferred to implementation time and tracked in `BFG_PRODUCT_GAPS.md`. No MVP-scope contradiction: the library is maintainability/analytics infrastructure, not a user-facing customization feature (Decision 040 philosophy preserved).

Decisions 042–045 (Activity Screen Architecture) were accepted 2026-06-19 and registered together. They specify the Activity surface and refine prior decisions without contradiction: **D042** applies training primacy (Decision 020) and the quests-in-Workouts placement (Decision 004) to the Activity layout (Workouts primary, Quests secondary); **D043** specifies the routing of the "Continue Journey" CTA approved in Decision 039 (Home is the resume surface, Activity is a browsing surface that does not own resume); **D044** fixes the placement of the optional weight field left open by Decision 040 (exercise screen only, never on Activity or workout cards, analytics-only); **D045** fixes the minimal workout-card composition (Title + Exercise Count only). Activity-specific UI architecture is recorded in `BFG_UI_RULES.md §16`. All four are Not Implemented (current app has a standalone `/quests` route, no Activity surface, no "Continue Journey" CTA, and no workout-session/exercise screen). The journey/sequence model that D043 routing depends on is specified by Decision 046 (Workout Journey Architecture).

Decision 046 (Workout Journey Architecture) was accepted 2026-06-19 and resolves the journey/sequence follow-up left open by the D042–D045 sync. It defines a coach-assigned **program** of a finite but **non-fixed** number of workouts, a **generic, count-agnostic sequence** that **repeats as a cycle** after the final workout, and the **Continue Journey resume order** (unfinished workout first; otherwise the next workout in the cycle). It refines Decisions 042 and 043 without contradiction and is Not Implemented (no program/cycle model or routing exists today). It adds no new UI-composition rule, so `BFG_UI_RULES.md` was reviewed but not changed — the Continue Journey CTA stays on Home (§15) and the Activity surface rules (§16) are unaffected.

Decisions 047–053 (Activity / Workout-session UX) were accepted 2026-06-19 and registered together. **D047** keeps all workouts visible and manually accessible (no locked/hidden workouts) within the D046 cycle; **D048** allows one mutually exclusive card state marker (Upcoming Workout *or* Workout In Progress); **D049** fixes the Start Workout boundary (viewing ≠ starting); **D050** fixes the completion boundary (Start → Finish; only completed workouts advance the cycle); **D051** advances the journey pointer from the workout actually completed, even out of order; **D052** requires a persistent "not started" reminder throughout the pre-start workout interface (including during videos) while never blocking content; **D053** hides weight fields before Start Workout and reveals them after (no data recorded before start). All seven are Not Implemented (no Activity surface and no workout session/exercise screen exist today). Activity card rules are recorded in `BFG_UI_RULES.md §16`; the pre-start workout-interface rules are recorded in the new `BFG_UI_RULES.md §17`. Together they resolve the out-of-order start/pointer and in-progress-marker items left open by the Activity Screen Architecture work.

Decision 054 (Activity Visual Hierarchy) was accepted 2026-06-19. It extends D045 (card composition) and D048 (state model): **all workout cards are the same size — the current workout is never enlarged** — and visual emphasis comes from **state, color, and position** (D042), not size. Card outline colors are Default neutral/blue, **Upcoming orange** (+ Upcoming marker), **In Progress green** (+ In Progress marker), with the D048 one-state rule unchanged. It explicitly does not modify D039 (Home) or D046 (Journey). It settles how the current workout is distinguished without size — superseding the non-persisted "largest current card" suggestion from the earlier Activity design analysis (that analysis was never written to a doc, so no document required correction). The orange/green accents extend the §4 palette and are flagged for the next palette pass (see Contradictions note). Not Implemented (no Activity cards exist). Activity card colors are recorded in `BFG_UI_RULES.md §16`.

Decision 055 (Activity Screen Composition) was accepted 2026-06-19. It defines the concrete Activity layout: a **header reading "Activity" only** (no date / Today / motivational or journey subtitle); **two sections with visible headers — Workouts then Daily Quests** (D042); workout cards as a **vertical list in fixed program order, no horizontal scroll, never reordering**, with cycle position shown via **state markers only** (D048, D054); workout card content of **Workout Number + Title + Exercise Count** (extending D045 by adding the Workout Number); and a **binary quest state — Completed or Not Completed only**, with no partial progress, percentages, progress bars, or counters. It extends D042/D045/D048/D054 and does not modify D039 (Home) or D046 (Journey). Not Implemented (no Activity surface exists). Composition rules are recorded in `BFG_UI_RULES.md §16`.

Decisions 056–058 (Workout state architecture) were accepted 2026-06-19 and resolve the open items flagged in the Activity wireframe work. **D056** — a completed workout card returns to the **Default** state (blue outline, no marker); there is no Completed/Finished card state and no dedicated color; completion history lives on Progress (D008). **D057** — **Workout In Progress has absolute priority over Upcoming**: while any workout is In Progress, no Upcoming marker and no orange card appear anywhere; on completion the next workout becomes Upcoming. **D058** — only **one** workout may be In Progress at a time; users may leave it, navigate freely, and view any other workout, but may not start a second one — other workouts show **Return To Workout** instead of Start Workout, returning the user to the active session; no cancellation system is introduced. All three are Not Implemented (no Activity surface or workout session exists). Card-state and marker-priority rules are recorded in `BFG_UI_RULES.md §16`; the single-active-workout flow is recorded in `BFG_UI_RULES.md §17`.

Decision 059 (Initial Journey State) was accepted 2026-06-20 and resolves the zero-completion initial-state item flagged in the Activity architecture review. It initializes the journey pointer to **Workout 1** when no workout has ever been completed and none is In Progress: Activity shows **Workout 1 as Upcoming** (orange outline + Upcoming marker, D054/D057) and **Continue Journey resolves to Workout 1** (D043). After the first completion (D049/D050), the D046 cycle becomes authoritative and the pointer advances from the workout actually completed (D051). D059 extends D043, D046, and D057 and **does not modify D058** — it introduces no workout expiration, cancellation, reset, or automatic session recovery; started workouts continue to follow D058. Not Implemented (no journey pointer or routing exists). The Activity initial-state rule is recorded in `BFG_UI_RULES.md §16`.

Decision 060 (Workout Step Architecture) was accepted 2026-06-20 and registered together with the new `docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md` specification. It introduces the **Workout Step** — the structural unit of a workout, where one Step = one Workout Session screen and may contain **one or two exercises**. A two-exercise Step is the sole representation of a **superset**, so no Superset entity is added to the Exercise Library (D041), which continues to store exercises only and never workout structure. The Step is coach-controlled and its **count and composition may change between workout versions**; because tracking and analytics resolve only to Workout Completion (D050) and the immutable Exercise ID (D041) — **never to a Step** — user history never depends on Step identity and survives re-authoring. D060 refines D040/D041/D046/D050/D055 without contradiction. It sits in the conceptual model as **Workout Template → Workout Step → Exercise**. Not Implemented (the current content model is a flat `workout_exercises` list with no Step grouping; superset/two-exercise screens do not exist). The Step concept is recorded in the new `docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md`, the Library boundary clarification in `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` §11, the tracking clarification in `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` §9, and the authoring model in `WORKOUT_CONTENT_GUIDE.md` §13.

Decision 061 (Program Architecture) was accepted 2026-06-22 and registered together with the new `docs/fitness/BFG_PROGRAM_ARCHITECTURE.md` specification. It formalizes the **Program** — a coach-authored, named, ordered set of **2–5 Workout Templates**, assigned deterministically by **Sex × Fitness Level × Training Format (Home / Gym)**, cycling forever via the existing Journey logic (D046). It completes the content hierarchy as **Program → Workout Template → Workout Step → Exercise**. The Program is a content selector, **not** a progression system: assignment, monthly **Program Updates**, and **Program Replacement** affect future workout content only and never XP, Level, Stage, Streak, Workout History, or Weight History — guaranteed structurally because progression runs off completion (D040) and weight history keys on the immutable Exercise ID (D041). Two edges are accepted: on replacement the pointer **resets to Workout 1** of the new Program (D059 logic); replacement **does not cancel** an In-Progress workout (D058 — it completes against its start-time snapshot, then the new Program activates). **Program Version** is an internal-only mechanism for safe updates, historical consistency, and active-workout protection (completion snapshots), which **resolves the Tracking Architecture §7 "plan snapshot at completion" open item**. D061 refines D040/D041/D046/D047/D051/D058/D059/D060 without contradiction. Not Implemented (no Program entity, assignment mapping, versioning, or onboarding-by-attributes exists today). The Program concept is recorded in the new `docs/fitness/BFG_PROGRAM_ARCHITECTURE.md`; the hierarchy/companion references are added to `docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md`, `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md`, and `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` (which marks §7 item 1 resolved); the authoring layer is added to `WORKOUT_CONTENT_GUIDE.md` §13.

Decisions 062–069 (Workout Session Architecture) were accepted 2026-06-22 and registered together — the concrete workout-session UX on top of the accepted content/journey model. **D062** Workout Start Screen (Title + ordered Step list; Start Workout / Return To Workout; no duration/difficulty/categories/analytics/companion content). **D063** Workout Navigation (swipe forward/backward only; no Next/Previous buttons; Start Screen → Steps → Finish Screen). **D064** Single Exercise Step layout (Video → Title → Prescription → optional Weight, video primary; weight visible only after Start). **D065** Superset Step layout (one Step; both exercises shown simultaneously in a horizontal card structure; vertical-orientation videos; two independent weight fields; no Superset entity, no "1/2"/"2/2" notation, no "2 exercises" label; exercises visually distinct, read as one Step). **D066** Workout Finish Screen (separate screen; "Workout Complete" + Finish Workout button; no companion content, no extra metrics). **D067** Workout Reward Modal (modal over a dimmed background — not a screen/banner/toast; show only changes; Stage → Level → XP, largest first; on no Stage growth a **Return To Activity** button, on Stage growth no button + 5–7s auto-advance to Home, tap speeds up; rare companion reactions for meaningful milestones only — **finalized 2026-06-23, superseding the interim "Result Banner"**). **D068** Workout Card Count Semantics (workout card shows Exercise Count; Start Screen shows Workout Steps; the two counts are different concepts — resolves the count ambiguity flagged in the Activity architecture review). **D069** Evolution Reveal Flow (a Stage Evolution overrides the destination and routes to Home for the Evolution Animation regardless of trigger; normal workout completion returns to Activity, normal quest completion remains on Activity; Home is the emotional stage for the transformation). All eight are Not Implemented (no workout session interface, reward flow, or evolution reveal exists today). The session-screen and flow rules are recorded in the new `BFG_UI_RULES.md §18`; the card-count clarification is added to `BFG_UI_RULES.md §16`; the Home-as-evolution-stage note is added to `BFG_UI_RULES.md §15`. One UI reconciliation follow-up (D065 horizontal layout at mobile width vs §1/§13) is recorded under the Contradictions note. `WORKOUT_CONTENT_GUIDE.md` was reviewed and not changed — these are session-UX decisions, not content-authoring changes.

Decisions 067 and 069 were **finalized 2026-06-23** (final versions, accepted after additional UX design). **D067** changes the post-completion reward surface from the interim "Result Banner" to a **Reward Modal over a dimmed background** (not a screen, banner, or toast), keeping the only-what-changed rule and the Stage → Level → XP order, and adds the behavior split: **no Stage growth → a Return To Activity button**; **Stage growth → no button, 5–7s auto-advance to Home, tap to speed up**. **D069** keeps its destination logic (Stage Evolution overrides the destination and routes to Home regardless of trigger; normal workout completion → Activity, normal quest completion stays on Activity) and now references the **Reward Modal** instead of a banner, and makes explicit that the **transformation is unskippable** — a tap may accelerate the transition to Home but can never skip the Evolution Animation. Both updates are recorded in place in the D067/D069 entries (with dated update notes) and in `BFG_UI_RULES.md §18` / §15; neither changes any other decision and neither introduces a contradiction.

Decision 070 (Deferred Progress Visualization) was accepted 2026-06-23. After any progression change the system persists **the last visually-shown state per progress surface separately** (not an "unviewed XP" flag), so the user always sees the indicators **move** even when the change happened earlier. Memory is **per-screen and independent**: **Home** owns its memory (Level Progress Bar + Activity Progress Ring) and animates last-seen → current, then clears; the **Progress** screen owns separate memory (XP / Level / Stage / other progression elements) and animates independently; viewing one surface never clears the other's memory. It is consistent with the calm-motion budget (§5, §13) and the no-shame rule (D031), and depends on the Home composition (D039) and Progress hierarchy (D008), both Not Implemented. The rule is recorded in the new `BFG_UI_RULES.md §19` (with a cross-reference from §15). D070 introduces no contradiction — it adds a presentation-persistence rule on top of accepted surfaces and changes no existing decision. Total decisions: **70**.

Decision 071 (Final Home Product Structure) was accepted 2026-06-25 and **finalizes** the Home composition opened by D039. It introduces no contradiction — it confirms the accepted Home elements and resolves three items D039 left open or that drifted between decisions: (1) it **closes the open Presence-Voice placement** (D039 #9) by siting an event-driven, non-permanent Voice Slot under the Stage Block, consistent with the Companion cadence (D036–038) and without promoting the Voice to a standing fixture; (2) it **standardizes the ring vocabulary** — both Home rings are calm **open arcs**, the Inner Ring is the **Level Progress open ring** (reconciling the "Level Progress bar/ring" wording of D070/§19) and the Outer Ring is **Weekly Activity Progress** (refining D039's "Weekly Progress" label and aligning with the D070 "Activity Progress ring (12/24)"); (3) it **defines the Outer Ring activity model** — only completed actions count (1 workout = 1 activity, 1 daily quest = 1 activity), weekly **UTC** reset, and a denominator of **21 daily-quest activities + the active Program cycle length (2–5, D061)** = 23–26, with a **capped** overflow value. The denominator deliberately reads the **active Program cycle length, not a "workouts per week" quota**, keeping it compatible with the count-agnostic Journey/Program model (D046, D061), which defines no weekly workout cadence. The weekly-resetting ring is guarded against debt/quota framing (D031 no-shame; Companion no-ledger §X). D071 is recorded in `BFG_UI_RULES.md §15` (rewrite) and §19 (vocabulary alignment), and the Home wireframe is added to `docs/ui/BFG_SCREEN_WIREFRAMES.md` (previously out of scope). Not Implemented (no Home rings, Stage Block, Voice Slot, Continue Journey CTA, or weekly-activity counting exist today). Total decisions: **71**.

Decisions 072 and 073 (Progress structure + Avatar Customization entry) were accepted 2026-06-26 and registered together; they were prepared via a web-verified benchmark of Progress/Profile/Achievement/Identity surfaces (Duolingo, Strava, Apple Fitness, Fitbit, Garmin, Whoop, Oura, Habitica, Steam, Fitbod/Freeletics/NTC). They introduce no contradiction. **D072** finalizes and **refines D008** (Progress block hierarchy) and completes the D005 Avatar+Progress+Profile merge: it fixes the three-block structure (Primary identity / Secondary progression / Additional archive), standardizes "Presence" on Progress as a **static, non-interactive identity portrait** (not a large render, not Home's living center), places Achievements inside the Additional block (MVP earned shelf → Post-MVP Constellations, D026), and names the D070 Progress-memory participants (XP / Level / Stage). **D073 refines D071** by defining the previously-undefined Home Presence interaction: tapping the Living Presence opens Avatar Customization (the primary, MVP-only customization entry; an affordance on the Presence, not a second CTA), and establishes a **single shared avatar visual state** read by both the Home live Presence and the Progress static portrait (Decision 001 at the rendering layer) — making Home↔Progress visual parity a correctness property. D073 deliberately separates the **entry model** (accepted now) from **customization catalog depth** (scoped later, may be MVP or Post-MVP); cosmetics/currency stay governed by D029/D034. Recorded in `BFG_UI_RULES.md` §15 (Home tap) and the new §20 (Progress), with the Progress wireframe added to `docs/ui/BFG_SCREEN_WIREFRAMES.md`. Both Not Implemented. Total decisions: **73**.

Decision 074 (Entry / Auth Start Screen) was accepted 2026-06-26. It is the first decision covering the **unauthenticated** surface (all prior screen decisions — D039/D042–D069/D071/D072 — are post-auth) and introduces no contradiction: it honors no-Stage-10-early (D010), the single-primary-CTA discipline (D071, D073), no-shame / no-competition framing (D031, D032, "победы" forbidden per BFG_UI_RULES §11), the core-loop-never-gated rule (D030, no trial/pricing on entry), and the Body-never-reaches / under-promise onboarding philosophy (Companion Doctrine §X/§XI). It deliberately keeps the **Seed Form interaction context-scoped** — "On the Entry / Auth Start screen, Seed Form is tap-reactive decoratively but is not a navigation affordance" — and records **no global** clickable / non-clickable rule. D074 is **self-contained**: the first-onboarding Seed Form interaction is governed separately by future onboarding decisions (none accepted today), so D074 forward-references no accepted onboarding decision and invents none; the only onboarding mention is a boundary note (a later onboarding Seed Form must not become a repeated tap target). D074 approves **structure, interaction rules, and copy principles only — not final copy** (current headline/subtitle/CTA variants remain placeholders). One UI follow-up, not a contradiction: the decorative tap-hint must stay within the `BFG_UI_RULES.md §5` motion budget (up to ~600ms, prefers-reduced-motion respected) — recorded for the §5/§13 pass. Recorded in `BFG_UI_RULES.md` §21 (new Entry section) and `docs/ui/BFG_SCREEN_WIREFRAMES.md` (new Entry / Auth Start section), with a one-line precedence note added to `BFG_MVP_SCOPE.md §2.1`. Not Implemented. Total decisions: **74**.
