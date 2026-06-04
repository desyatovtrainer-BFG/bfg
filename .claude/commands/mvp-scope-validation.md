---
description: "Validate whether a proposed task is inside BFG MVP scope before any work begins."
allowed-tools: Read
---

# MVP Scope Validation

Determine whether a proposed task or feature is inside BFG MVP scope. Return a verdict before any code is written.

**Read-only. No edits. No implementation.**

## Input

`$ARGUMENTS` must describe the proposed task: the user-facing behavior, the system change, and any new files or tables involved.

If empty, ask: "Describe the proposed task or feature in one paragraph."

## Reference

Read `docs/BFG_MVP_SCOPE.md` in full. Key sections:
- §1 — MVP definition (the 7-step loop)
- §2 — In-scope: product, systems, engineering
- §3 — Out-of-scope list: §3.1 product, §3.2 systems, §3.3 engineering
- §4 — Quantitative constraints
- §7 — Anti-scope-creep rules

## Evaluation

### Step 1 — Loop Test
Does this feature directly serve a step of the MVP loop?
> Sign up → Dashboard → Daily quest → Workout → XP/level/avatar update → Return tomorrow → Trial state

State which step(s), or "none."

### Step 2 — In-Scope Check (§2)
Is this feature explicitly listed or clearly implied by §2.1, §2.2, or §2.3?

### Step 3 — Out-of-Scope Check (§3)
Is this feature explicitly listed in §3.1, §3.2, or §3.3?

### Step 4 — Anti-Scope-Creep Test (§7)
Apply each test:

- **"While we're at it"** — is this being added only because something related is being touched?
- **"It's just 30 lines"** — is the justification only that it's small?
- **"We'll need it later"** — is the justification future need with no current concrete use case?
- **"Tooling while I'm here"** — test framework, linter, formatter, design system additions?
- **"Cool Feature"** — is the primary justification that the feature is interesting, fun, modern, AI-powered, technically impressive, or something competitors have? Does it exist mainly because it feels exciting rather than because it strengthens the MVP loop?

If any test fires: OUT OF SCOPE until promoted in `docs/BFG_ROADMAP.md`.

### Step 5 — Engineering Constraints (§4, §5.2)
If in scope, flag any concern:
- Does this risk pushing a route over the 150KB gzipped JS budget?
- Does it introduce a progression write that bypasses `awardXp`?
- Does it touch `public.*` tables without a stated RLS policy?
- Does it require a third-party domain not verified for RU accessibility?

## Output Format

```
MVP Scope Validation

Proposed task: <one-sentence restatement>

LOOP STEP(S) SERVED: <step name(s) | none>

VERDICT: IN SCOPE | OUT OF SCOPE | BORDERLINE

Reason:
- §<section>: <supporting text>

ANTI-SCOPE-CREEP FLAGS:
- <flag name>: <description>

ENGINEERING CONCERNS (if in scope):
- <concern>

RECOMMENDATION:
<one sentence — proceed | do not proceed | promote in BFG_ROADMAP.md first>
```

Do not begin implementation. Do not suggest adjacent features. Return the verdict and stop.
