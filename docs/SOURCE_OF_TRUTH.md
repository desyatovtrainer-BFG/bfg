# SOURCE_OF_TRUTH

Defines which document wins when two documents disagree, and where each type of decision lives.
An agent that is uncertain about authority should read this file first.

---

## Authority chain (top = wins)

1. **`BFG_ENGINEERING_RULES.md §2` (hard prohibitions)** — overrides all other documents and all user preferences. Non-negotiable. A PR that violates §2 must be rejected.
2. **`BFG_SECURITY.md`** — security constraints are binding. Architecture and convenience yield to security.
3. **`BFG_PRODUCT_DECISIONS.md` (accepted product decisions)** — the authority for *what was decided*. When another product or design document disagrees with an accepted decision, the registry wins and the other doc must be updated. This authority is limited to accepted product decisions: it does **not** override item 1 (§2 hard prohibitions) or item 2 (security), and it does not replace the scope, schema, or domain documents below — those remain authoritative within their own roles (the registry records the decision; they implement it).
4. **`BFG_MVP_SCOPE.md §3` (out-of-scope list)** — if a feature is listed as out of scope, it is out of scope regardless of what another document implies. Must update the roadmap before building it.
5. **`supabase/migrations/*.sql` (actual schema)** — the live migration files are authoritative for what the database contains *right now*. `BFG_DATABASE.md` describes intent and conventions; the SQL files describe reality.
6. **Domain documents** (`BFG_DATABASE.md`, `BFG_ARCHITECTURE.md`, `BFG_GAME_SYSTEMS.md`, `BFG_AI_COMPANION.md`) — authoritative within their domain. See §Domain authorities below.
7. **`CURRENT_STATE.md`** — reflects what is implemented. When a domain doc and `CURRENT_STATE.md` differ, trust the domain doc for the *design intent* and `CURRENT_STATE.md` for *what currently exists*.
8. **`BFG_ROADMAP.md`** — milestone definitions and acceptance criteria.
9. **`BFG_Master_Roadmap_MVP_v3.md`** — tactical phase plan. More granular than the roadmap; describes the current sprint. Can diverge from `BFG_ROADMAP.md` in ordering but not in scope.

---

## Domain authorities

| Topic | Authoritative document | Secondary reference |
|-------|----------------------|-------------------|
| Accepted product decisions (what was decided) | `BFG_PRODUCT_DECISIONS.md` | `BFG_PRODUCT_GAPS.md` |
| Architecture, folder layout, rendering model | `BFG_ARCHITECTURE.md` | `BFG_ENGINEERING_RULES.md §6` |
| Database schema, RLS policies, migration rules | `BFG_DATABASE.md` + `supabase/migrations/` | `BFG_SECURITY.md` |
| MVP scope boundary | `BFG_MVP_SCOPE.md` | `BFG_ROADMAP.md §2` |
| XP, levels, streaks, avatar evolution, quests | `BFG_GAME_SYSTEMS.md` | `lib/progression/` source |
| Companion behavior, tone, states, Russia rule | `BFG_AI_COMPANION.md` | `BFG_GAME_SYSTEMS.md §10` |
| Roadmap milestones and acceptance criteria | `BFG_ROADMAP.md` | — |
| Current phase work and tactical plan | `BFG_Master_Roadmap_MVP_v3.md` | `CURRENT_PRIORITIES.md` |
| Engineering hard rules | `BFG_ENGINEERING_RULES.md §2` | — |
| Security — keys, RLS, anti-cheat, release checklist | `BFG_SECURITY.md` | `BFG_ENGINEERING_RULES.md §2` |
| UI motion, layout, animation budget | `BFG_UI_RULES.md` | `BFG_ENGINEERING_RULES.md §9` |
| New-user emotional design, journey tone | `BFG_BEGINNER_JOURNEY.md` | `BFG_AI_COMPANION.md §3` |
| What is implemented today | `CURRENT_STATE.md` | code + git log |
| Content authoring (workouts) | `WORKOUT_AUTHORING.md` | `BFG_GAME_SYSTEMS.md §7` |

---

## Conflict resolution rules

**Rule 1 — Scope conflicts.**
If a feature looks in-scope in one doc but appears in `BFG_MVP_SCOPE.md §3`, it is out of scope. The roadmap must be updated before work begins.

**Rule 2 — Schema conflicts.**
If `BFG_DATABASE.md` describes a table but `supabase/migrations/` does not have a migration for it, the table does not exist yet. Do not assume it was created manually.
If a migration exists but `BFG_DATABASE.md` §10 still lists the table as "not yet added," the migration takes precedence — the table exists.

**Rule 3 — Architecture conflicts.**
`BFG_ARCHITECTURE.md` describes the intended structure. If code diverges from it, the architecture doc is the target to converge toward, not a document to update to match the drift.

**Rule 4 — Companion identity.**
Any document that refers to "avatar" and "companion" as separate entities is outdated or imprecise. The canonical model is: **one presence, two roles — avatar = body, companion = voice.** `BFG_AI_COMPANION.md §1` and `BFG_GAME_SYSTEMS.md §10` are authoritative on this.

**Rule 5 — Post-MVP confusion.**
Several features appear in docs with ambiguous "future" language. The single authoritative gate is `BFG_MVP_SCOPE.md §3`. If an item is listed there as out of scope, it is out of scope for M1 regardless of partial implementation in code.

---

## What is NOT a source of truth

- `.scratch/` files — throwaway notes, never authoritative.
- Git commit messages — informative but not binding.
- Inline code comments describing plan or intent — the code is what runs, but the design doc is the spec.
- This conversation or any session context — all decisions worth keeping must be written into `docs/`.
