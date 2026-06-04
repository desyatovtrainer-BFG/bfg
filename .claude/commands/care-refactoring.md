---
description: "Careful refactoring review — flag only changes that solve a real MVP risk"
allowed-tools: Read, Grep, Glob, Bash(tsc --noEmit:*)
---

# Care-Refactoring Review

## Purpose

Evaluate a proposed or in-progress refactor for necessity, safety, and scope. Only recommend changes that solve a **real, demonstrable MVP risk**. Surface scope creep and hard prohibition violations. Never suggest changes the task did not require.

## Acceptance Contract (AGENTS.md)

Before proceeding, confirm all three are present in `$ARGUMENTS`:
1. Goal of the refactor in one sentence.
2. Every file the refactor intends to change.
3. What "done" looks like.

If any of the three is missing, ask. Do not proceed.

## Mode

Research only until the checklist below is complete. No edits.

Read in order:
1. `docs/BFG_<feature>.md` for the domain.
2. `lib/<feature>/index.ts` and `types.ts`.
3. The specific file(s) being refactored.

## Review Checklist

### Scope Gate
- [ ] Does every changed file serve the MVP loop (workout → XP → avatar → companion → return)?
- [ ] Is every changed file in the stated plan?
- [ ] Are there any "while we're at it" edits (formatting, renames, unrelated cleanup)?
  — If yes: flag them. They must be removed or split into a separate task.

### Hard Prohibitions (BFG_ENGINEERING_RULES.md §2)
Check each changed file for:
- [ ] `any` in TypeScript (use `unknown` + narrowing)
- [ ] `@ts-ignore` / `@ts-expect-error` without a one-line justification
- [ ] `useEffect` with a fetch or Supabase call inside (use Server Components or TanStack Query)
- [ ] `useState` holding server-fetched data (use TanStack Query cache)
- [ ] Client-side XP, level, streak, or evolution calculation (server only)
- [ ] `fetch('/api/...')` from a component where a Server Action fits
- [ ] Global CSS outside `app/globals.css`
- [ ] `console.log` left for debugging
- [ ] Service-role key outside Edge Functions

### Risk Gate — For Each Recommended Change
Answer all three before including a change:
1. What MVP risk does this change mitigate?
2. What is the blast radius if this introduces a regression?
3. Is there a simpler option that avoids the refactor entirely?

If a change cannot answer (1), it must not be recommended.

### TypeScript Quality (RULES §3)
- [ ] Return types on all exported `lib/` functions
- [ ] Discriminated unions for polymorphic results (`{ data, error }` or `{ ok, value } | { ok, error }`)
- [ ] No enums — string literal unions only
- [ ] No default exports except Next.js route files

### File Size (RULES §4, §14)
- [ ] No component over 300 lines
- [ ] No non-component file over ~250 lines

## Output Format

```
Refactor Assessment: <goal in one sentence>

Files reviewed: <list>

SCOPE VIOLATIONS (must fix before continuing):
- <file>: <description>

HARD PROHIBITION VIOLATIONS:
- <file:line>: <rule from §2>

UNJUSTIFIED CHANGES (no demonstrable MVP risk):
- <change>: no risk stated

SAFE TO PROCEED:
- <change>: serves <loop step> because <reason>

Type check: PASS | FAIL | NOT RUN
```

No unsolicited suggestions. No cleanup outside the stated scope.
