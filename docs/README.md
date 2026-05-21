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
| [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) | Coding contract: prohibitions, naming, file size, AI-readability rules. Read first. |
| [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) | Stack, folder layout, rendering model, trust boundaries, Server Actions, Edge Functions. |
| [`BFG_DATABASE.md`](./BFG_DATABASE.md) | Tables, columns, RLS strategy, migration discipline, destructive change protocol. |
| [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) | XP, levels, streaks, avatar evolution, quests, workouts, cosmetics, subscription gating. |
| [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md) | Companion behaviour, states, deterministic MVP, LLM rules for the future. |
| [`BFG_UI_RULES.md`](./BFG_UI_RULES.md) | Mobile-first dark UI, typography, motion, forbidden patterns, accessibility. |
| [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) | Stage map M0 → M6, milestone acceptance criteria, scope guardrails. |
| [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) | In/out of MVP, quality bar, anti-scope-creep rules. |
| [`BFG_SECURITY.md`](./BFG_SECURITY.md) | Auth, RLS, env vars, progression protection, AI security, release checklist. |

---

## Reading order for new contributors

1. [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) — what we are and aren't building right now.
2. [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) — the rules of the road.
3. [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) — how the parts fit.
4. [`BFG_SECURITY.md`](./BFG_SECURITY.md) — what you must not break.
5. The system docs relevant to your feature: [`BFG_DATABASE.md`](./BFG_DATABASE.md), [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md), [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md), [`BFG_UI_RULES.md`](./BFG_UI_RULES.md).
6. [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) — where this is going.

---

## Reading order for Cursor / LLM agents

When starting a coding task in this repo, load context in this order:

1. `AGENTS.md` at repo root (Next.js 16 notice).
2. `docs/BFG_ENGINEERING_RULES.md` (hard prohibitions).
3. `docs/BFG_ARCHITECTURE.md` (where things live).
4. The system doc relevant to the touched feature.
5. `docs/BFG_SECURITY.md` (what must remain server-side).
6. The actual code files for the touched feature.

Do not skip step 2 and 5. They contain prohibitions that override common defaults.

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
