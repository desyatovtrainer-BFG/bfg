---
description: "Map relevant files and data flow for a feature before implementation. Read-only."
allowed-tools: Read, Grep, Glob
---

# Code Discovery

**Research mode only.** No edits. No planning. No implementation.

## Input

`$ARGUMENTS` must be a feature or domain name (e.g. `companion`, `progression`, `workouts`, `quests`).

If empty, ask: "Which feature or domain should I map?"

## Research Path (AGENTS.md — read in this order, stop when sufficient)

1. `docs/BFG_<FEATURE>.md` — domain contract, states, forbidden patterns.
2. `lib/<feature>/index.ts` + `lib/<feature>/types.ts` — public surface and data shapes.
3. `lib/<feature>/actions.ts` + `lib/<feature>/queries.ts` — writes and fetches.
4. `app/components/<feature>/` — list components, identify Server vs Client.
5. `app/(app)/<feature>/` routes — which pages consume this feature.
6. **DB only if the task will touch the DB**: tail of `supabase/migrations/` + relevant section of `docs/BFG_DATABASE.md`.

Do not read files speculatively. Do not open `docs/` broadly. Stop after step 5 unless DB work is confirmed in the task.

## Output

```
Code Discovery: <feature>

DOMAIN CONTRACT (docs/BFG_<FEATURE>.md — 5 lines max):
- <key invariants, states, forbidden patterns>

DATA SHAPES (lib/<feature>/types.ts):
- <type name>: <role>

PUBLIC SURFACE (lib/<feature>/index.ts exports):
- <exported symbol>: <what it is>

SERVER ACTIONS (lib/<feature>/actions.ts):
- <action>: <what it does and trust boundary>

QUERIES (lib/<feature>/queries.ts):
- <query key>: <what it fetches>

UI COMPONENTS (app/components/<feature>/):
- <component> [Server|Client]: <role>

ROUTES:
- <path>: <components it composes>

DATA FLOW:
<one paragraph: where data enters (DB/RLS), how it moves (RSC fetch / Server Action),
where it renders (component tree), what writes back>

DB TABLES TOUCHED (if applicable):
- <table>: read | write — <RLS note>

GAPS / AMBIGUITIES:
- <anything unclear that must be resolved before implementation begins>
```

No edits. No suggestions. No implementation plan. Output the map, stop.
