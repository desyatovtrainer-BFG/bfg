# PROJECT_INDEX

A map of every document in `docs/` — what it is, what it is not, and when to read it.
Optimized for agents starting cold: read this file first, then go to the one document that covers your task.

---

## Recommended reading order (by task type)

| Task | Read first | Read second |
|------|-----------|-------------|
| Understand BFG as a product | `BFG_MVP_SCOPE.md` | `BFG_GAME_SYSTEMS.md` |
| Resolve a product-decision conflict (what was decided) | `BFG_PRODUCT_DECISIONS.md` | `BFG_PRODUCT_GAPS.md` |
| Plan or audit architecture | `BFG_ARCHITECTURE.md` | `BFG_ENGINEERING_RULES.md` |
| Touch any DB table or migration | `BFG_DATABASE.md` | `BFG_SECURITY.md` |
| Work on companion phrases or tone | `BFG_AI_COMPANION.md` | `BFG_GAME_SYSTEMS.md §10` |
| Work on XP / level / streak / avatar | `BFG_GAME_SYSTEMS.md` | `BFG_DATABASE.md §3` |
| Assess what to work on next | `CURRENT_PRIORITIES.md` | `MVP_STATUS.md` |
| Understand the actual codebase state | `CURRENT_STATE.md` | — |
| Roadmap / milestones / promotion | `BFG_ROADMAP.md` | `BFG_Master_Roadmap_MVP_v3.md` |
| Security review | `BFG_SECURITY.md` | `BFG_ENGINEERING_RULES.md §2` |
| UI / animation / layout | `BFG_UI_RULES.md` | `BFG_ENGINEERING_RULES.md §9` |
| First-time player experience | `BFG_BEGINNER_JOURNEY.md` | `BFG_MVP_SCOPE.md §1` |
| Add workout content | `WORKOUT_AUTHORING.md` | `BFG_GAME_SYSTEMS.md §7` |
| Local dev setup | `LOCAL_SETUP.md` | — |
| Deploy | `DEPLOYMENT.md` | — |

---

## Document map

### Source-of-truth and agent orientation

| File | Purpose |
|------|---------|
| `BFG_PRODUCT_DECISIONS.md` | **Source of truth** — registry of accepted product decisions (what was decided). |
| `BFG_PRODUCT_GAPS.md` | Decided vs. implemented vs. missing vs. conflicting; gap priorities. |
| `PROJECT_INDEX.md` ← **this file** | Map of all docs. Read first when starting cold. |
| `SOURCE_OF_TRUTH.md` | Which document wins when two docs conflict. Authoritative chain. |
| `CURRENT_STATE.md` | What is actually implemented today. Implemented vs. partial vs. planned. |
| `CURRENT_PRIORITIES.md` | What to work on now. P0/P1/P2 breakdown. What to skip. |
| `MVP_STATUS.md` | MVP completion percentage by system. Release readiness tracker. |

### Scope and product

| File | Purpose |
|------|---------|
| `BFG_MVP_SCOPE.md` | Definitive in-scope / out-of-scope boundary. If unsure whether to build something, read this first. Reject out-of-scope at PR time. |
| `BFG_ROADMAP.md` | Milestone definitions (M0–M6). Acceptance criteria per milestone. Current milestone is M1 (active). |
| `BFG_Master_Roadmap_MVP_v3.md` | Tactical phase plan for the current M1 push. Phases 0–8. The active work tracker. |
| `BFG_BEGINNER_JOURNEY.md` | Emotional design of the new-user experience. Not a code spec. Informs companion tone and onboarding. |

### Engineering

| File | Purpose |
|------|---------|
| `BFG_ARCHITECTURE.md` | Stack, folder structure, trust boundaries, rendering model, feature recipe. Authoritative for "where does this code live?" |
| `BFG_ENGINEERING_RULES.md` | Hard rules (§2), TypeScript rules, React/Next.js rules, naming, agent workflow rules. §2 overrides everything. |
| `BFG_SECURITY.md` | Security rules, RLS contract, anti-cheat, service-role constraints, release checklist. |
| `BFG_DATABASE.md` | Schema reference (all tables, columns, RLS), migration discipline, identifier conventions. |
| `BFG_UI_RULES.md` | Animation budget, motion rules, layout constraints, tone of visual design. |
| `ui/BFG_ENTRY_AUTH_START_BRIEF.md` | Implementation brief for the D074 Entry / Auth Start screen, applying D075 responsive canvas rules. |

### Systems

| File | Purpose |
|------|---------|
| `BFG_GAME_SYSTEMS.md` | Engineering spec for XP, levels, streaks, avatar evolution, daily quests, workouts, cosmetics, subscription. The "how it works" reference. |
| `BFG_AI_COMPANION.md` | Companion engineering contract: deterministic MVP path, future LLM path, tone rules, Russia constraint, security. |
| `companion/BFG_Companion_Doctrine.md` | North-star philosophy for the companion voice. Not a code spec. |

### Operational

| File | Purpose |
|------|---------|
| `LOCAL_SETUP.md` | How to run the project locally. |
| `DEPLOYMENT.md` | How to deploy to Vercel + apply migrations. |
| `WORKOUT_AUTHORING.md` | How to add workout content via Supabase Table Editor. Non-engineering guide. |

---

## What each document is NOT

- `BFG_ARCHITECTURE.md` is not a changelog — it describes the target structure, not every file that currently exists.
- `BFG_ROADMAP.md` is not the day-to-day work tracker — use `BFG_Master_Roadmap_MVP_v3.md` for that.
- `BFG_GAME_SYSTEMS.md` is not the emotional/product vision — that lives in `BFG_BEGINNER_JOURNEY.md`.
- `BFG_DATABASE.md §10` lists tables "we intentionally do NOT have yet" — some of those have since been added; check `supabase/migrations/` for reality.
- `CURRENT_STATE.md` is not a spec — it reflects what exists today. It will go stale; verify against code.

---

## Documents that do NOT exist yet (planned)

These are called for in `BFG_Master_Roadmap_MVP_v3.md` and will be created in later phases:

- `BFG_PROGRESSION_ECONOMY.md` — superseded; the progression economy is decided in `BFG_PRODUCT_DECISIONS.md` (D012–D020) and already implemented. Not a planned doc.
- `BFG_COMPANION_COMMUNICATION.md` — Companion phrase library and state mapping (Phase 4).
- `BFG_COMPANION_WRITING_GUIDE.md` — Voice and tone guide for writing companion text (Phase 4).
