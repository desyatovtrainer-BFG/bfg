# BFG — Exercise Library Architecture v1

Status: **Accepted** (registry Decision 041, accepted 2026-06-19)
Category: Fitness System

This document specifies the accepted Exercise Library architecture. It records **what the model is and why**, not database schema or code. When this document disagrees with `docs/BFG_PRODUCT_DECISIONS.md`, the registry wins and this document must be updated.

Companion documents:
- `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` — what is tracked (Decision 040).
- `docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md` — workout session structure and supersets (Decision 060).
- `docs/fitness/BFG_PROGRAM_ARCHITECTURE.md` — program assignment and the top of the content hierarchy (Decision 061).
- `docs/fitness/BFG_EXERCISE_METADATA.md` — exercise types, load types, weight semantics.
- `docs/fitness/BFG_WORKOUT_MIGRATION_STATUS.md` — current implementation vs approved target architecture (this entity is Approved / Not Implemented).
- `WORKOUT_CONTENT_GUIDE.md` — content authoring (will be rewritten at implementation time).
- `docs/BFG_PRODUCT_DECISIONS.md` — Decisions 015, 020, 040, 041, 060, 061.

---

## 1. Purpose

The Exercise Library is the **single canonical source of every exercise definition**. Workout content references exercises by identity; it never embeds or duplicates their definitions. This reverses the current model, in which each exercise is defined per workout inside `workout_exercises` (title, description, video per step).

The Library exists for **content consistency, maintainability, tracking, and analytics**. It does **not** exist for user customization. Users never browse, choose, or configure exercises — training is coach-authored (Decision 040). The Library is infrastructure; to the user it surfaces only as the exercise that appears in an assigned workout and as the label on a Strength Progress line.

---

## 2. Identity vs Prescription

The load-bearing principle of this architecture:

> **Identity and intrinsic properties live in the Library. Prescription lives in the Workout Template.**

- **Library (what an exercise *is*):** exercise id, title, description, video reference, exercise type, load type, and the derived weight semantics.
- **Template (how it is *used this time*):** order, prescribed duration, sets/reps display, superset grouping.

The same exercise may be prescribed for 60 seconds in one workout and 90 in another, grouped into a superset in one plan and standalone in another. None of that changes what the exercise *is*, so none of it belongs in the Library.

---

## 3. Exercise Library Principles

- Each real movement exists **once** as a canonical Library exercise.
- Workout templates **reference** exercises by id; they never copy definitions.
- Identity is the **immutable Exercise ID** — a stable, human-readable slug (e.g. `barbell-back-squat`).
- Intrinsic metadata is owned by the Library exercise (see `BFG_EXERCISE_METADATA.md`).
- Weight semantics are **derived** from Load Type, never authored as an independent field.
- The Library is owned and curated by the coach. It is not a user-facing catalog.

---

## 4. Stable Exercise Identity

Identity is the **Exercise ID**, not the title, video, or description. Two tiers govern change:

**Mutable — same exercise, ID unchanged:**
- Replacing the video → same exercise. Video is content, not identity.
- Editing the description / coaching cues → same exercise.
- Correcting or rewording the title *for the same movement* → same exercise.
- Updating the thumbnail → same exercise.

**Identity-sensitive — must NOT be mutated once weight history exists → retire + create new:**
- **Load Type** and **Exercise Type.** These define weight semantics; changing them silently rewrites the meaning of every past weight entry (e.g. Dumbbell = one dumbbell vs Barbell = total bar). A genuine change here is a **new exercise**, not an edit.
- A title change that represents a **genuinely different movement** → new id; retire the old.

Bright-line rules:
- **Exercise IDs are never changed.**
- **Exercise IDs are never reused or repurposed.**
- When unsure whether something is an edit or a new exercise: if the meaning of weight history would change, it is a new exercise.

## 5. Retire vs Delete

- Exercises are **retired, never deleted.** Retirement deactivates an exercise (`is_active = false`) so it stops appearing in new templates while all existing references and weight history remain valid.
- Hard deletion is prohibited: it would orphan template references and break weight history keyed on the Exercise ID.
- Retirement is also the correct path when an exercise's Load Type / Exercise Type must change (§4): retire the old, create a new canonical exercise.

## 6. Relationship with Workout Templates

- Templates are coach-authored plans that **reference Library exercises by Exercise ID** and add prescription (order, prescribed duration, sets/reps display, superset grouping).
- Many templates may reference one exercise (many-to-one).
- Templates **never** duplicate exercise definitions — this is the explicitly rejected pattern.
- The coach controls exercise selection, plan structure, progression, and superset composition (Decision 040 philosophy).

## 7. Relationship with Workout Tracking

- A workout completion references the assigned template and a **snapshot** of the assigned plan at completion time, so later plan edits never corrupt past completions (Tracking Architecture §7).
- **Workout Tracking must never rely on workout-local exercise copies.** Any per-exercise reference used in tracking resolves to the canonical Exercise ID, not to a duplicated definition embedded in a workout.
- Snapshots protect *template* history; the immutable Exercise ID protects *strength* history. The two mechanisms are complementary.

## 8. Relationship with Weight History

- Weight History is attached to the **Exercise ID** (conceptually keyed by user + Exercise ID).
- Because the Exercise ID is immutable and Load-Type-bound, weight history carries one consistent semantic across its entire lifetime — across plan edits, template changes, video swaps, and title rewording.
- Future Strength Progress aggregates weight history by Exercise ID across every template the exercise ever appeared in; the Library supplies the title and Load-Type semantic for display. Strength Progress appears only after ≥1 weight is logged, with no empty state (Decision 040).

## 9. Risks

| Risk | Prevention |
|---|---|
| Duplicated exercise definitions | Single canonical Library; reference-by-id; embedding definitions in templates is rejected. |
| Accidental near-duplicates (two ids for one movement → fragmented history) | Coach owns/curates the Library; naming convention + trainer metadata to disambiguate; periodic dedupe review. Residual risk addressed by process, not structure. |
| Renamed exercise breaks history | Identity = id, not title. |
| Load Type change corrupts weight history | Load Type / Exercise Type are identity-sensitive once history exists → retire + recreate. |
| Inconsistent weight semantics | Semantics derived from Load Type (single source); never authored separately. |
| Orphaned references on delete | Never hard-delete; retire via `is_active`. |
| Video swap misread as a new exercise | Video is explicitly not identity. |

## 10. Final Architecture

Hub-and-spoke with a hard identity/prescription split:

1. **One canonical Library exercise per real movement**, coach-owned, identified by an immutable Exercise ID, carrying intrinsic metadata and deriving all weight semantics from Load Type.
2. **Templates reference, never copy.** All prescription lives on the template's reference to the exercise.
3. **History keys on Exercise ID.** Weight history and strength analytics join on the stable id; combined with plan snapshots at completion, this gives durable, interpretable history through content churn.
4. **Two-tier mutability is the load-bearing rule.** Content (video, description, title wording) is freely editable; semantic identity (id, load type, exercise type once history exists) is immutable — change means retire + recreate.

The one risk this cannot solve structurally — authors creating near-duplicate exercises — is a curation discipline assigned to the coach.

## 11. Library Stores Exercises Only — Workout Structure Lives in Workout Steps

Clarification accepted with Decision 060 (`BFG_WORKOUT_STEP_ARCHITECTURE.md`):

- **The Exercise Library stores exercises only.** It holds canonical movements and their intrinsic metadata (Exercise ID, title, description, video, Exercise Type, Load Type, derived weight semantics) — nothing else.
- **Workout structure belongs to Workout Steps.** The grouping of exercises into session screens, their order, and their prescription are not Library concerns; they live on the Workout Template's Steps (Decision 060 §3).
- **Superset composition belongs to Workout Steps.** A superset is represented by a Workout Step that contains two exercises (Decision 060 §5). There is **no Superset entity** in the Library — or anywhere.
- **The Exercise Library never stores workout structure.** No Steps, no screen grouping, no supersets, no ordering, no prescription. The Library is a flat catalog of movements referenced by id; structure is composed above it by the Workout Template and its Steps.

This keeps the identity/prescription split (§2) intact at the structural level too: identity lives in the Library, structure lives in Workout Steps, and the two never merge.

The full content hierarchy that sits above the Library is **Program → Workout Template → Workout Step → Exercise** (Decisions 061, 060). The **Program** (Decision 061, `BFG_PROGRAM_ARCHITECTURE.md`) is the top layer — a coach-authored, assigned, ordered set of Workout Templates — and, like every layer above the Library, it references downward and never stores exercise identity. Weight history therefore remains keyed to the immutable Exercise ID across Program updates and Program replacement (`BFG_PROGRAM_ARCHITECTURE.md` §6–§7).
