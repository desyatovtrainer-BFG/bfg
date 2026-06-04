---
description: "Iterative local code review — correctness, scope, regressions, BFG rules. No external posting."
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(tsc --noEmit:*)
---

# Loop Code Review

Local iterative review of changed files. No comments posted externally. No commits amended.

## Input

`$ARGUMENTS` may be: a file path, a feature name, or empty (review all current git changes).

## Pass 1 — Change Inventory

1. Run `git diff HEAD` (or `git diff --staged` if changes are staged).
2. List every changed file: new | modified | deleted.
3. Flag any file changed that was not in the stated plan.

## Pass 2 — Scope & MVP Alignment

For each changed file:
- Does the change serve the MVP loop (workout → XP → avatar → companion → return)?
- Does it introduce anything from `docs/BFG_MVP_SCOPE.md §3` (out-of-scope list)?
- Is there scope creep: formatting, unrelated renames, "while we're at it" changes?

Flag all violations. Do not fix them — report.

## Pass 3 — Hard Prohibitions (BFG_ENGINEERING_RULES.md §2)

Scan each changed file for:
- `: any` or `as any` — forbidden without narrowing
- `@ts-ignore` / `@ts-expect-error` without an inline justification comment
- `useEffect` wrapping a `fetch` or Supabase call
- `useState` holding data that came from the server
- Client-side XP, level, streak, or evolution calculation
- Direct `fetch('/api/...')` from a component where a Server Action fits
- CSS outside `app/globals.css`
- `console.log` (debug leftovers)
- Service-role key references outside Edge Functions

Cite file + line number for each violation.

## Pass 4 — Correctness

- Do Server Actions return `{ data, error }`, never throwing across the network boundary?
- Are all `public.*` table mutations going through Server Actions?
- Does any new component fetch data client-side that should be server-side?
- Do new Supabase queries have an associated RLS expectation noted?

## Pass 5 — Regression Signals

- Does any change to `lib/<feature>/index.ts` break its public surface?
- Does any change to `lib/progression/` bypass `awardXp`?
- Does any companion change alter the `build-companion-message.ts` output contract?
- Does any migration alter an existing column (must be additive only)?

## Pass 6 — Type Check

Run `tsc --noEmit`. Report PASS or FAIL with the first error if failed.

## Output Format

```
Loop Code Review — Pass [N]

UNPLANNED FILES:
- <file>: not in stated plan

SCOPE VIOLATIONS:
- <file>: <description>

HARD PROHIBITION VIOLATIONS:
- <file:line>: <rule>

CORRECTNESS ISSUES:
- <file:line>: <description>

REGRESSION RISKS:
- <file>: <description>

Type check: PASS | FAIL
  <first error if FAIL>

Clean: YES | NO — <summary>
```

If clean: `Clean: YES — no issues found in [N] passes.`
Do not post externally. Do not amend commits.
