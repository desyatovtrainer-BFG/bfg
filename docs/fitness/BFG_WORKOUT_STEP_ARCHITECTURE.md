# BFG — Workout Step Architecture v1

Status: **Accepted** (registry Decision 060, accepted 2026-06-20)
Category: Fitness System

This document specifies the accepted Workout Step model. It records **what the entity is and why**, not database schema or code. When this document disagrees with `docs/BFG_PRODUCT_DECISIONS.md`, the registry wins and this document must be updated.

Companion documents:
- `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` — what is tracked (Decision 040).
- `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` — canonical exercise identity (Decision 041).
- `docs/fitness/BFG_EXERCISE_METADATA.md` — exercise types, load types, weight semantics.
- `WORKOUT_CONTENT_GUIDE.md` §13 — authoring model for content authors.
- `docs/BFG_PRODUCT_DECISIONS.md` — Decisions 040, 041, 046, 049, 050, 055, 060.

---

## 1. Purpose

The Workout Step is the **structural unit of a workout** and the seam between two things that must stay independent:

- the **Exercise Library** (Decision 041) — what an exercise *is*, identified by an immutable Exercise ID;
- the **workout session flow** — the sequence of screens the user actually steps through.

Before this decision, "workout structure" had no named entity: supersets had no representation, the session screen had no unit, and the workout preview had no unit. Workout Step supplies all three at once **without** introducing a Superset entity into the Exercise Library and **without** coupling user history to mutable workout structure.

One load-bearing sentence: **Step = one Workout Session screen.** Everything else in this document follows from that.

---

## 2. Workout Step Definition

- A workout consists of **Workout Steps**.
- The Workout Step is the **structural unit** of a workout.
- A Workout Step corresponds to a **single Workout Session screen** — what the user sees as "one step" of the session and one entry in the workout preview.
- A Workout Step may contain **one or two exercises**.
- A Workout Step does **not** represent an exercise (an exercise is a Library entity, Decision 041).
- A Workout Step does **not** represent a superset (a superset is a *shape* of a Step, not its identity — see §5).

A Step is a grouping of canonical exercises onto a screen, plus the prescription that the Workout Template attaches to that screen (§3). It has no meaning to the user beyond "this is the screen I'm on," and no meaning to analytics at all (§6, §7).

---

## 3. Relationship with Workout Template

The conceptual hierarchy is:

```text
Workout Template
  ↓
Workout Step        (one session screen; 1–2 exercises)
  ↓
Exercise            (referenced from the Exercise Library by Exercise ID)
```

- The **Workout Template** (coach-authored, Decision 041 §6) owns the ordered list of Workout Steps.
- Each **Workout Step** orders one or two **exercise references** and carries the per-use prescription (order, prescribed duration, sets/reps display, superset grouping) that Decision 041 §2 assigns to "how an exercise is used this time."
- Prescription lives on the Step's reference to the exercise, never on the Library exercise. The same exercise can appear in a one-exercise Step in one workout and a two-exercise Step in another; none of that changes what the exercise *is*.

The Step sits **between** the Template and the Exercise: the Template is the plan, the Step is a screen of that plan, the Exercise is the canonical movement shown on that screen.

---

## 4. Relationship with Exercise Library

- The Exercise Library stores **exercises only** (Decision 041).
- The Exercise Library **never** stores workout structure, Steps, screen grouping, or supersets.
- A Workout Step **references** Library exercises by their immutable **Exercise ID**; it never copies or embeds a definition (the rejected pattern, Decision 041 §6).
- Intrinsic exercise metadata (title, description, video, Exercise Type, Load Type, derived weight semantics) stays in the Library; the Step adds only prescription and screen grouping.

The Library answers "what is this movement"; the Step answers "which movements share this screen and how are they prescribed here." These two questions are kept in two places on purpose.

---

## 5. Relationship with Supersets

- A **superset is represented by a Workout Step that contains two exercises.** That is the entire representation.
- There is **no Superset entity** — not in the Exercise Library, not in the Template, not anywhere.
- A one-exercise Step is an ordinary single-exercise screen; a two-exercise Step is a superset screen. The Step's exercise count *is* the superset signal.
- Because a superset is just a two-exercise Step, it inherits every Step rule: coach-controlled, version-mutable, and never an anchor for tracking, weight history, or analytics.

This is the decision's central simplification: superset representation is solved by the Step's 1-or-2-exercise capacity, so the Library stays a flat catalog of movements.

---

## 6. Relationship with Workout Tracking

- Workout Tracking is **not** attached to the Workout Step.
- Tracking resolves only to **Workout Completion** (Decision 050) and the immutable **Exercise ID** (Decision 041).
- The Step is **session structure only**; it carries no tracked event and no completion meaning. Moving between Steps is navigation, exactly as "swipe between exercises is navigation only" (`BFG_WORKOUT_TRACKING_ARCHITECTURE.md` §2).
- No per-Step completion, per-Step duration, or per-Step state is recorded. The primary tracked event remains the workout as a whole (Decisions 040, 050).

Consequence: a coach can split, merge, reorder, or recompose Steps between workout versions and **no completion record changes**, because completions never pointed at a Step.

---

## 7. Relationship with Progress

- Progress analytics are **not** attached to the Workout Step.
- **Weight History is not attached to the Workout Step.** Optional working weight is keyed to the **Exercise ID** (Decisions 041, 044), regardless of which Step the exercise appeared on, single or superset.
- Strength Progress aggregates by Exercise ID across every template and every Step the exercise ever appeared in (`BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` §8). Whether an exercise was shown alone or in a two-exercise superset Step has no effect on its history.
- Detailed metrics live on the Progress screen (Decision 008), never on the Step or the Activity surface (Decision 045).

---

## 8. Mutability Rules

The Step is **fully controlled by the coach** and is **version-mutable**:

- Step **count** may change between workout versions (a workout may go from 6 Steps to 5).
- Step **composition** may change between workout versions (a Step may gain or drop its second exercise; two single Steps may become one superset Step, or vice versa).
- A Step may be reordered, split, or merged at the coach's discretion.

What protects history through all of this:

- **User history must not depend on Step identity.** Because tracking keys on Workout Completion (Decision 050) and weight history keys on Exercise ID (Decision 041), re-authoring Steps never corrupts past records.
- A Step needs **no stable identity** of its own for the user-history layer. (Implementation may still need keys for editing, but the *product* model places no history-bearing identity on the Step.)
- This mirrors the two-tier split that protects the Library (`BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` §4): identity-bearing things (Exercise ID, completions) are stable; structure (Steps, prescription) is freely editable.

---

## 9. Risks

| Risk | Prevention |
|---|---|
| Superset modeled as a new entity, leaking structure into the Library | A superset is a two-exercise Step; no Superset entity exists (§5); the Library stores exercises only (§4). |
| Tracking or weight history keyed to a Step, breaking on re-author | Tracking keys on Workout Completion (D050); weight history keys on Exercise ID (D041); never on a Step (§6, §7). |
| Step identity treated as durable, coupling history to structure | User history must not depend on Step identity (§8); Steps are version-mutable by design. |
| Workout structure duplicated into the Exercise Library | Templates/Steps reference exercises by id and never embed definitions (D041 §6; §4). |
| A Step holding three or more exercises | A Step contains **one or two** exercises only (§2); a superset is exactly two. |
| Prescription drifting onto the Library exercise | Prescription lives on the Step's reference, not on the canonical exercise (§3; D041 §2). |

---

## 10. Final Architecture

A three-layer model with a hard identity/structure split:

1. **Workout Template** — the coach-authored plan; owns an ordered list of Steps.
2. **Workout Step** — one Workout Session screen; holds **one or two** exercise references plus prescription. A two-exercise Step **is** a superset. Coach-controlled and version-mutable in both count and composition.
3. **Exercise** — the canonical Library movement, referenced by immutable Exercise ID; the Library stores exercises only and never workout structure.

The invariants that make this stable:

- **Step = session screen** (and = one workout-preview entry).
- **Superset = two-exercise Step**, so no Superset entity is ever introduced.
- **History never depends on Step identity** — tracking resolves to Workout Completion (D050), strength history to Exercise ID (D041).
- **The Library stays independent of workout structure**, which lives entirely in Steps.

This lets the coach evolve workout structure freely over time while user history, strength analytics, and the Exercise Library remain interpretable and untouched.
