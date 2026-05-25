<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Acceptance Contract

Before touching any file:
- State the goal in one sentence.
- Name every file you intend to change.
- State what "done" looks like (type check passes / visible in UI / migration applied).

❌ Don't start if any of the three is missing. Ask.

---

## Task Modes

Stay in one mode at a time. Don't mix.

| Mode | Do | Don't |
|------|----|-------|
| **Research** | Read, grep, check docs | Edit |
| **Plan** | List files + approach | Execute |
| **Implement** | Edit, type-check | Re-plan mid-edit |
| **Verify** | Run, observe | Add scope |

---

## Research Path

Read in this order. Stop when you have enough.

1. The one `docs/BFG_*.md` file for the domain.
2. `lib/<feature>/index.ts` + `types.ts`.
3. The specific route or component file.
4. Migrations only if the task touches the DB.

❌ Don't read files speculatively.  
❌ Don't open the whole `docs/` folder.

---

## Implementation Discipline

- Touch only files named in the plan.
- If an unplanned file must change → state why before touching it.
- ❌ No formatting fixes, renames, or comment cleanups unless the task requires it.
- ❌ No scope additions mid-edit.
- Run `tsc --noEmit` before declaring done.

Example of scope creep to avoid: fixing a bug in `award-xp.ts` and also "cleaning up" imports in `queries.ts`.

---

## Decision Rules

**Pause and ask when:**
- The correct file to edit is ambiguous.
- A DB schema change is required.
- Two approaches have meaningfully different trade-offs.
- A hard prohibition in `BFG_ENGINEERING_RULES.md §2` would be violated.

**Proceed without asking when:**
- The path is unambiguous.
- The change is locally reversible.

---

## Completion Report

Output exactly this when done:

```
Done.
Changed: <file1>, <file2>
Verified: <how>
Left out: <what and why, or "nothing">
```

❌ No code summaries. ❌ No unsolicited follow-up suggestions.

---

## .scratch/ Workspace Hygiene

- Use `.scratch/` for throwaway notes during a session.
- ❌ Don't read `.scratch/` in a new session as source of truth.
- ❌ Don't commit `.scratch/` files.
- If a decision is worth keeping → write it to `docs/`, not `.scratch/`.

---

## Supabase Change Awareness

Before writing any migration:
1. Read the tail of `supabase/migrations/` to see current schema.
2. Check `docs/BFG_DATABASE.md` for RLS and constraint expectations.
3. Confirm the migration with the user.

Rules:
- ❌ Never edit an existing `.sql` migration file.
- After writing a migration, state the exact command to apply it. Don't assume it ran.

---

## Cost-Efficient Context Use

- Use `offset`/`limit` when you know the relevant lines. Don't read whole files.
- One `docs/BFG_*.md` per session. If a second becomes necessary, say so.
- ❌ Don't re-read files you already have in context.
- When a session exceeds ~25 turns → start fresh rather than compressing.
