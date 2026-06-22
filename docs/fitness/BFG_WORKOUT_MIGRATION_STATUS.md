# BFG — Workout Migration Status

Status: **Reference / Living document** (not a registry decision)
Category: Fitness System

This document is a **bridge between the current code/database and the approved target architecture**. It is descriptive, not decision-bearing: it records *where the implementation is today* relative to the accepted decisions. When it disagrees with `docs/BFG_PRODUCT_DECISIONS.md`, the registry wins and this document must be updated.

Companion documents:
- `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` (Decision 041)
- `docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md` (Decision 060)
- `docs/fitness/BFG_PROGRAM_ARCHITECTURE.md` (Decision 061)
- `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` (Decision 040)
- `WORKOUT_CONTENT_GUIDE.md` — operational authoring guide (current DB-shape oriented)

---

## Purpose

The approved workout architecture (Decisions 041, 060, 061) is **Not Implemented**. The code and database still run the original flat model. This creates a real hazard: a future Cursor or Claude session can read the live `workouts` / `workout_exercises` tables, assume that shape is the intended design, and build new systems on top of a structure that is already scheduled to be replaced.

This document exists to make the gap explicit and unmissable, so that:

- nobody mistakes the **current implementation** for the **target architecture**;
- new design work is anchored to the approved decisions, not to today's tables;
- the current implementation is understood as **temporary scaffolding**, not the destination.

It is the single place that answers "what is real in code today vs. what has been decided."

---

## Current Implementation

What actually exists in code and database **today**:

```text
Workout              (public.workouts)
  ↓
Workout Exercise     (public.workout_exercises)
```

- **Currently implemented:** a flat two-level model. Each workout owns a list of "exercise" rows, and **each exercise definition (title, description, video) is embedded per workout** — there is no shared exercise identity across workouts.
- **Currently used by UI:** the `/workouts` catalog and the `/workouts/[id]` session screen, which renders per-exercise slides (Kinescope video embeds) in `order_index` order. A **superset** today is rendered from a `superset_group_id` shared by two consecutive `workout_exercises` rows — **not** from a Workout Step entity.
- **Currently used by Supabase tables:** `public.workouts`, `public.workout_exercises`, and `public.workout_completions` (the completion log that drives XP/streak). Authoring is manual via the Supabase Table Editor (`WORKOUT_CONTENT_GUIDE.md`).

What the current model does **not** have: a centralized Exercise Library, an immutable Exercise ID, a Workout Step entity, a Workout Template entity, a Program entity, program assignment, or content versioning/snapshots.

---

## Approved Target Architecture

The accepted content hierarchy:

```text
Program            (Decision 061) — coach-assigned ordered set of 2–5 Workout Templates,
                                    keyed by Sex × Fitness Level × Training Format
  ↓
Workout Template   (Decision 060) — ordered list of Workout Steps + prescription
  ↓
Workout Step       (Decision 060) — one session screen; 1–2 exercises (superset = 2 exercises)
  ↓
Exercise           (Decision 041) — canonical movement in the centralized Exercise Library,
                                    immutable Exercise ID; referenced, never embedded
```

- **Decision 041 — Exercise Library:** exercises exist once, referenced by immutable Exercise ID; weight history keys on that ID; templates reference, never duplicate.
- **Decision 060 — Workout Step:** the session-screen unit; a superset is a two-exercise Step; no Superset entity exists; tracking/weight/progress never attach to a Step.
- **Decision 061 — Program:** the top selector layer; content selector only, never a progression source; updates and replacement change future content only.

---

## Implementation Status

| Architecture Block | Status | Notes |
|---|---|---|
| Exercise Library (D041) | Approved / Not Implemented | Today exercise definitions are embedded per workout in `workout_exercises`; no centralized library, no immutable Exercise ID, no ID-keyed weight history. |
| Workout Step (D060) | Approved / Not Implemented | No Step entity. A primitive superset precursor exists (`superset_group_id` on two consecutive rows), but it is a different shape, not the approved Step. |
| Program Architecture (D061) | Approved / Not Implemented | No Program entity, no Sex × Level × Format assignment, no Program Version / content snapshots. |
| *Workout Template (D060)* | *Approved / Not Implemented* | *Closest current analogue is the `workouts` row, but it embeds exercises and is not a reference-based template.* |
| *Workout Tracking — completion (D040)* | *Partially Implemented* | *`workout_completions` + XP/streak on completion exist; Start/Finish boundary (D049/D050), journey cycle (D046), and plan snapshots (D061) do not.* |

(The first three rows are the required blocks; the italic rows are included for a complete picture of the same migration.)

---

## Source Of Truth

For all future architecture discussions, the accepted decisions are authoritative:

> **Decisions 041, 060, and 061 (and the `docs/fitness/BFG_*_ARCHITECTURE.md` specs) override `WORKOUT_CONTENT_GUIDE.md` whenever they conflict.**

`WORKOUT_CONTENT_GUIDE.md` documents the **current** manual authoring process against the live `workouts` / `workout_exercises` tables. It is operationally correct for today's data but describes the **temporary** model. Above everything, `docs/BFG_PRODUCT_DECISIONS.md` is the master registry — if any architecture doc disagrees with it, the registry wins.

Precedence, highest first:
1. `docs/BFG_PRODUCT_DECISIONS.md` (registry — D041, D060, D061, …)
2. `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md`, `BFG_WORKOUT_STEP_ARCHITECTURE.md`, `BFG_PROGRAM_ARCHITECTURE.md`
3. This document (current-vs-target bridge)
4. `WORKOUT_CONTENT_GUIDE.md` / `WORKOUT_AUTHORING.md` (current implementation operations)

---

## Rules For Future Agents

- **Do NOT design new systems based solely on the current `workout_exercises` structure.** It is temporary scaffolding scheduled for replacement.
- **Anchor all new design to the approved target architecture** (Program → Workout Template → Workout Step → Exercise) and its decisions (D041, D060, D061).
- **Treat the current implementation as temporary.** When current code and approved architecture differ, the approved architecture is the intent.
- **Never key new tracking, weight, or analytics work to a Workout Step or to a per-workout embedded exercise** — strength history keys on the immutable Exercise ID (D041); progression keys on workout completion (D040).
- **Do not "improve" the flat model in ways that deepen the divergence** (e.g. adding more embedded-exercise fields) without checking it against the target architecture first.
- If a task genuinely requires touching the current tables, state explicitly that you are working on the **temporary** model and why.

---

## Next Planned Migration Steps

High-level only — no implementation details, no schema, no code:

1. **Introduce the centralized Exercise Library (D041)** — canonical exercises with immutable Exercise IDs, as the foundation everything else references.
2. **Introduce Workout Templates that reference Library exercises (D060)** — replacing per-workout embedded exercise definitions with references.
3. **Introduce the Workout Step layer (D060)** — session-screen grouping of 1–2 exercises; migrate the `superset_group_id` precursor into two-exercise Steps.
4. **Introduce the Program layer (D061)** — ordered sets of Templates, assignment by Sex × Level × Format, and the internal Program Version / completion-snapshot mechanism.
5. **Align Workout Tracking** — completions reference content snapshots (D061) and the Start/Finish boundary + journey cycle (D040/D046/D049/D050).
6. **Rewrite the authoring docs** — `WORKOUT_CONTENT_GUIDE.md` and `WORKOUT_AUTHORING.md` to the target model once the above land.

Sequencing is bottom-up (Library first, Program last) because each layer references the one below it. This list is directional, not a committed plan or order of delivery.
