# BFG — Engineering Documentation

This folder is the **engineering source of truth** for BFG (Big Fitness Game). It is written for:

- humans contributing code,
- Cursor / LLM agents generating code,
- reviewers approving PRs.

If reality and the documents disagree, **the documents win** — open a PR to update them, then change the code.

> Emotional / product specs live at the repo root: `BFG_CONTEXT.md`, `BFG_RULES.md`, `AVATAR_SYSTEM.md`, `COMPANION_SYSTEM.md`, `PROGRESSION_SYSTEM.md`, `QUEST_SYSTEM.md`, `WORKOUT_CONTENT_GUIDE.md`. They are the *why*. This folder is the *how*.

---

## Index

| Document | Purpose |
| --- | --- |
| [`BFG_PRODUCT_DECISIONS.md`](./BFG_PRODUCT_DECISIONS.md) | **Source of truth** — registry of accepted product decisions (what was decided). |
| [`BFG_PRODUCT_GAPS.md`](./BFG_PRODUCT_GAPS.md) | Decided vs. implemented vs. missing vs. conflicting; gap priorities. |
| [`PROJECT_INDEX.md`](./PROJECT_INDEX.md) | Map of all docs by task type. Read first when starting cold. |
| [`SOURCE_OF_TRUTH.md`](./SOURCE_OF_TRUTH.md) | Which document wins when two docs conflict. |
| [`CURRENT_STATE.md`](./CURRENT_STATE.md) | What is actually implemented today. |
| [`CURRENT_PRIORITIES.md`](./CURRENT_PRIORITIES.md) | What to work on now. P0/P1/P2 breakdown. |
| [`MVP_STATUS.md`](./MVP_STATUS.md) | MVP completion percentage by system. Release-readiness tracker. |
| [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) | Coding contract: prohibitions, naming, file size, AI-readability rules. Read first. |
| [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) | Stack, folder layout, rendering model, trust boundaries, Server Actions, Edge Functions. |
| [`BFG_DATABASE.md`](./BFG_DATABASE.md) | Tables, columns, RLS strategy, migration discipline, destructive change protocol. |
| [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) | XP, levels, streaks, avatar evolution, quests, workouts, cosmetics, subscription gating. |
| [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md) | Companion behaviour, states, deterministic MVP, LLM rules for the future. |
| [`BFG_UI_RULES.md`](./BFG_UI_RULES.md) | Mobile-first dark UI, typography, motion, forbidden patterns, accessibility. |
| [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) | Stage map M0 → M6, milestone acceptance criteria, scope guardrails. |
| [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) | In/out of MVP, quality bar, anti-scope-creep rules. |
| [`BFG_SECURITY.md`](./BFG_SECURITY.md) | Auth, RLS, env vars, progression protection, AI security, release checklist. |
| [`BFG_BEGINNER_JOURNEY.md`](./BFG_BEGINNER_JOURNEY.md) | Emotional design of the Day 0–14 new-user experience. Not a code spec. |
| [`BFG_Master_Roadmap_MVP_v3.md`](./BFG_Master_Roadmap_MVP_v3.md) | Tactical phase plan for the current push. |
| [`companion/BFG_Companion_Doctrine.md`](./companion/BFG_Companion_Doctrine.md) | North-star philosophy for the companion voice. |
| [`WORKOUT_AUTHORING.md`](./WORKOUT_AUTHORING.md) | How to add workout content via Supabase Table Editor. |
| [`LOCAL_SETUP.md`](./LOCAL_SETUP.md) | How to run the project locally. |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | How to deploy to Vercel + apply migrations. |

---

## Reading order for new contributors

1. [`BFG_PRODUCT_DECISIONS.md`](./BFG_PRODUCT_DECISIONS.md) — the source of truth: what has been decided.
2. [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) — what we are and aren't building right now.
3. [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) — the rules of the road.
4. [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) — how the parts fit.
5. [`BFG_SECURITY.md`](./BFG_SECURITY.md) — what you must not break.
6. The system docs relevant to your feature: [`BFG_DATABASE.md`](./BFG_DATABASE.md), [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md), [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md), [`BFG_UI_RULES.md`](./BFG_UI_RULES.md).
7. [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) — where this is going.

---

## Reading order for Cursor / LLM agents

When starting a coding task in this repo, load context in this order:

1. `AGENTS.md` at repo root (Next.js 16 notice).
2. `docs/BFG_PRODUCT_DECISIONS.md` (the source of truth — what was decided).
3. `docs/BFG_ENGINEERING_RULES.md` (hard prohibitions).
4. `docs/BFG_ARCHITECTURE.md` (where things live).
5. The system doc relevant to the touched feature.
6. `docs/BFG_SECURITY.md` (what must remain server-side).
7. The actual code files for the touched feature.

Do not skip step 3 and 6. They contain prohibitions that override common defaults.

---

## How to evolve these docs

- A PR that changes architecture, security, scope, or data model **must** update the relevant doc in the same PR.
- Keep documents **dense and practical**. No fluff. No generic explanations. Examples are welcome.
- Prefer rules over prose. Bullet lists beat paragraphs for AI ingestion.
- Cross-link aggressively. Every system doc references the others.
- If a rule no longer holds, delete it. Stale rules are worse than missing rules.

---

## Conventions used in these docs

- ❌ marks a hard prohibition. Treat as a compile error.
- ✅ marks a required practice.
- Code references use `lib/<feature>/<file>.ts` paths from the repo root.
- "Server-only" means runs in a Next.js Server Component, a Server Action, or an Edge Function — never in the browser.
- "MVP" means the scope defined in [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md), not "minimum effort".
