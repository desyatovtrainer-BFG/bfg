# CURRENT_PRIORITIES

Active work breakdown as of 2026-06-16. Derived from `BFG_Master_Roadmap_MVP_v3.md` phases.
Read this before starting any new task to verify it is the right thing to work on now.

---

## Current milestone: M1 — MVP Public Release

We are in the M1 sprint. M1 is not done until all acceptance criteria in `BFG_ROADMAP.md §2.2` pass on production.

---

## P0 — Must do now

These block everything downstream. Work on these before P1.

### Phase 1: Development System (in progress — this task)
- [x] `PROJECT_INDEX.md`
- [x] `SOURCE_OF_TRUTH.md`
- [x] `CURRENT_STATE.md`
- [x] `CURRENT_PRIORITIES.md`
- [x] `MVP_STATUS.md`

### Phase 2: Architecture Stabilization
Work defined in `BFG_Master_Roadmap_MVP_v3.md §PHASE 2`.

1. **Atomic completion RPC audit** — the two-step `INSERT guard → awardXp` flow is non-atomic. Evaluate whether to introduce a Postgres RPC or accept the `xp_before` recovery as sufficient for M1. Decision must be documented.
2. **Progression audit** — verify correctness of each system end-to-end:
   - XP: sources, amounts, idempotency, double-claim protection.
   - Levels: `calculateLevel` curve, `getLevelProgress` for UI bar.
   - Evolution: stage thresholds, `hasEvolved` on `awardXp`, avatar write path.
   - Quests: catalog completeness, completion idempotency, streak integration.
   - Streak: `touchStreak` logic, UTC boundary, soft-restart behavior.

---

## P1 — Do after P0 is stable

### Phase 3: XP Economy Rework — resolved
The progression economy is decided in `BFG_PRODUCT_DECISIONS.md` (D012–D020) and implemented (P0A/P0B, 2026-06-12). The earlier `BFG_PROGRESSION_ECONOMY.md` deliverable is superseded by the registry; remaining residual items (per-difficulty quest values, final copy) are tracked in `BFG_PRODUCT_GAPS.md`.

### Phase 4: Companion Systems
Companion text library and tone guide are missing.  Deliverables:
- `BFG_COMPANION_COMMUNICATION.md` — complete phrase map per state + post-event reactions.
- `BFG_COMPANION_WRITING_GUIDE.md` — voice rules, negative checklist, tone anchor phrases.

---

## P2 — Do after P1, before M1 closes

These are M1 must-ship items not yet complete (see `BFG_ROADMAP.md §2.1`):

- **Workout content** — at least 3 workouts with real Kinescope video IDs in the DB.
- **Daily quest catalog** — at least 5 active quests in `lib/quests/daily-quests.ts`.
- **Avatar evolution moment** — subtle animation (< 600ms) when evolution stage changes.
- **Companion on every screen where it adds value** — dashboard, post-workout, quests page (partial today).
- **Operational basics** — staging environment, smoke checklist run, Lighthouse scores verified on 4 primary screens.
- **Security checklist** — `BFG_SECURITY.md` release checklist must pass before public access.

---

## Do NOT work on yet

These are explicitly out of M1 scope. Working on them now is a scope violation (`BFG_MVP_SCOPE.md §3`).

- Payments, subscriptions beyond trial state display.
- LLM-augmented companion (M4).
- Push notifications (M2/M4).
- Social features, leaderboards.
- `xp_events` audit log (M2).
- `workout_completions` as a full analytics log (current table is for idempotency only; the analytics log is M2).
- Guided onboarding flow (M2).
- Streak freeze / break protection (M4).
- Cosmetic inventory table (post-MVP).
- E2E test suite (M5).
- iOS/Android shells (M6).
- Multiple languages.
- Any item in `BFG_MVP_SCOPE.md §3`.

---

## How to decide if something belongs here

1. Check `BFG_MVP_SCOPE.md §3` — if it is listed, stop.
2. Check `BFG_ROADMAP.md §2.1` — if it is in M1 must-ship, it belongs in P2 at latest.
3. Check `BFG_Master_Roadmap_MVP_v3.md` — find which phase it belongs to and whether earlier phases are done.
4. If still uncertain: pause and ask rather than build.
