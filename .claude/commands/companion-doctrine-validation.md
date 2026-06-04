---
description: "Validate companion phrases, tone, and UI against BFG_Companion_Doctrine.md and BFG_AI_COMPANION.md"
allowed-tools: Read, Grep, Glob
---

# Companion Doctrine Validation

Validate companion phrases, states, and components against the two governing companion documents. No edits. Report violations only.

## Reference Documents (read both before reviewing)

1. `docs/companion/BFG_Companion_Doctrine.md` — emotional philosophy, grain, timbre, cadence, restraint canon.
2. `docs/BFG_AI_COMPANION.md` — engineering contract: states, tone rules, forbidden patterns, architecture.

## Input

`$ARGUMENTS` may be:
- A file path (e.g. `lib/companion/build-companion-message.ts`)
- A scope: `phrases`, `ui`, or `all`
- Empty → scan all of `lib/companion/` and `app/components/companion/`

## Structural Checks (BFG_AI_COMPANION.md)

For each phrase or state:
- [ ] Russian only
- [ ] ≤ ~12 words
- [ ] No emojis (forbidden everywhere in companion text)
- [ ] No exclamation marks used as motivation
- [ ] Does not mention days missed, time spent, calories, BMI, weight
- [ ] Does not use the negative-list phrases: "ты должен", "не ленись", "давай!", "стань лучшей версией", "ты пропустил X дней"
- [ ] Phrase is seeded (stable per user/state/day), not random on refresh

State coverage:
- [ ] All 5 states exist: `first_step`, `present_today`, `in_streak`, `soft_return`, `warm_return`
- [ ] `warm_return` contains no count of absent days and no shame

Architectural:
- [ ] Companion message computed server-side (Server Component or RSC fetch)
- [ ] No companion logic triggers `awardXp` or any progression write
- [ ] No LLM provider SDK referenced in client code

## Dependency & Attachment Checks

The companion is a witness of effort and a steady presence — not a retention mechanism or an emotional dependency. For each phrase, state, or UI element:

- [ ] Does this phrase create or encourage dependency on the companion?
- [ ] Does this phrase encourage opening the app without a fitness-related reason?
- [ ] Does this phrase pressure the user to maintain a streak?
- [ ] Does this phrase imply that the companion is disappointed, waiting, lonely, abandoned, or emotionally affected by user absence?
- [ ] Does this phrase reward emotional attachment over fitness behaviour?

Flag any violations in the output.

## Doctrine Checks (BFG_Companion_Doctrine.md §XIV Restraint Principles)

For each phrase, evaluate:

1. **Silence-first (§V)** — Does this phrase earn a break in the quiet, or does it speak when silence would serve better?
2. **Acknowledgment, not address (§IV)** — Does it speak *about what it noticed* (witnessing) rather than *to* the user with an agenda or a label?
3. **No motivation (§III)** — Does the phrase want something from the user? Does it push, congratulate with pressure, or imply a goal the user did not bring?
4. **No ledger (§X)** — Does it imply a score, a debt, a streak at risk, or days that need making up?
5. **Temperature calibration (§IX)** — On high-achievement events, is the tone appropriately restrained? On quiet return, is it warmer than on an active-today day?
6. **Specificity over affect (§IV rule 2)** — Is warmth expressed through accuracy (this user's observable state) rather than generic affect ("great job", "amazing")?
7. **No attributed feelings (§IV rule 1)** — Does the phrase tell the user how to feel about their own effort?
8. **Grain legibility (§VII)** — Does this feel like *someone* noticing something, or a system firing a response?

## Output Format

```
Companion Doctrine Validation

Files reviewed: <list>

STRUCTURAL VIOLATIONS (BFG_AI_COMPANION.md):
- <file:line | state | phrase>: <rule violated>

DEPENDENCY & ATTACHMENT VIOLATIONS:
- "<phrase | element>": <check violated> — <description>

DOCTRINE VIOLATIONS (BFG_Companion_Doctrine.md):
- "<phrase>": §<section> — <description>

BORDERLINE:
- "<phrase>": borderline on §<section> — <reason>

CLEAN:
- <what passed and why>

Overall: PASS | FAIL | REVIEW NEEDED
```

No edits. No rewrites. Flag and describe; do not fix.
