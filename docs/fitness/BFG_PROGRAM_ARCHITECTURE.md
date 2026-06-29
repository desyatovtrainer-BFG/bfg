# BFG — Program Architecture v1

Status: **Accepted** (registry Decision 061, accepted 2026-06-22)
Category: Fitness System

This document specifies the accepted Program model. It records **what the entity is and why**, not database schema or code. When this document disagrees with `docs/BFG_PRODUCT_DECISIONS.md`, the registry wins and this document must be updated.

Companion documents:
- `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md` — what is tracked (Decision 040).
- `docs/fitness/BFG_WORKOUT_STEP_ARCHITECTURE.md` — workout session structure and supersets (Decision 060).
- `docs/fitness/BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` — canonical exercise identity (Decision 041).
- `docs/fitness/BFG_EXERCISE_METADATA.md` — exercise types, load types, weight semantics.
- `BFG_BEGINNER_JOURNEY.md` — Home vs Gym framed as a logistical onboarding question.
- `docs/fitness/BFG_WORKOUT_MIGRATION_STATUS.md` — current implementation vs approved target architecture (this entity is Approved / Not Implemented).
- `WORKOUT_CONTENT_GUIDE.md` §13 — authoring model for content authors.
- `docs/BFG_PRODUCT_DECISIONS.md` — Decisions 040, 041, 046, 047, 051, 058, 059, 060, 061.

---

## 1. Purpose

The fitness stack already defines, bottom-up: the **Exercise Library** (Decision 041), the **Workout Step** and **Workout Template** (Decision 060), and the **Workout Journey** cycle/pointer (Decisions 046/051/059). What was missing is the layer that answers one question: *which set of workouts does this user get?*

Decision 046 leaned on the word "program" — "a user is assigned a workout **program** of a finite but non-fixed number of workouts" — but never defined it as an entity, who assigns it, or what happens when its content changes. Program Architecture supplies that layer and tops the content hierarchy:

```text
Program           (D061)  — ordered set of templates, keyed by Sex × Level × Format
  ↓ contains (ordered references)
Workout Template  (D060)  — ordered list of Steps + prescription
  ↓
Workout Step      (D060)  — one session screen, 1–2 exercises (superset = 2)
  ↓
Exercise          (D041)  — canonical movement, immutable Exercise ID
```

The constraint that shapes the whole design is the **isolation rule**: a Program is a *content selector*, never a progression system. Assignment, updates, and replacement may change **future workout content only** — never XP, Level, Stage, Streak, Workout History, or Weight History. The architecture makes that isolation structural, not merely a policy.

---

## 2. Program Definition

> **A Program is a coach-authored, named, ordered set of Workout Templates, assigned to a user by Sex × Fitness Level × Training Format. It is the entity that determines which workouts a user is given — nothing more.**

A Program is a **selector and sequence container**, not a course. It has no start, no end, no completion percentage, no graduation, and no rewards. It is the named bucket (e.g. "Beginner Gym") whose ordered template list feeds the Journey cycle (Decision 046).

---

## 3. Program Structure

- A Program contains an **ordered list of 2–5 Workout Templates** (A, B, C…). The count is **non-fixed and count-agnostic** (Decision 046); 2–5 is the current content range, not an architectural limit.
- The template order **is** the cycle order consumed by Decision 046 (A → B → C → A …).
- A Program **references** Workout Templates by identity; it never embeds or duplicates them — the reference-not-copy discipline Decision 041 applies to exercises and Decision 060 to Steps. (Whether two Programs may share a template is an authoring choice the model permits, not an architectural requirement.)
- A Program carries **assignment metadata**: its Sex, Fitness Level, and Training Format coordinates — the key by which it is selected (§5).
- A Program carries **no user data**. No pointer, no history, no progress lives on the Program; those live on the user's Journey state and the completion log respectively.

Examples (current content range):

```text
Beginner Home          Intermediate Gym
  • Workout A             • Workout A
  • Workout B             • Workout B
  • Workout C             • Workout C
                         • Workout D
                         • Workout E
```

---

## 4. Assignment Rules

- Assignment is a **deterministic mapping**: `(Sex, Fitness Level, Training Format) → Program`. One coordinate triple resolves to exactly one active Program.
  - Example: `Male + Beginner + Gym → Beginner Gym`; `Female + Intermediate + Home → Intermediate Home`.
- The user **never builds, chooses, or edits** a Program, its workouts, exercises, sets, or reps (Decision 040; Library is "not a user-facing catalog", Decision 041). The user supplies only the three logistical inputs — framed as logistical, not identity, questions (`BFG_BEGINNER_JOURNEY.md`).
- Assignment **grants nothing**: being assigned a Program awards no XP, Level, Stage, or Streak. It only sets which workouts appear.
- On first assignment, the Journey initializes per Decision 059 (pointer → Workout 1; Workout 1 Upcoming; Continue Journey → Workout 1).
- The assignment keys are supplied by onboarding (Decisions 078, 079, 081): **Hero/Heroine (Sex)** on S2; **Experience (Fitness Level)**, **Training Format**, and a **conditional Weekly Frequency** on S3. Assignment runs **silently and deterministically** once those keys exist (leaving S3) — no program-selection screen and no "building your path" screen. **Goal** and **Avatar Name** (also collected at onboarding) do **not** drive assignment.

### 4.1 Weekly Frequency and the Program Family / Program Variant model (Decision 081)

Decision 081 **refines** the §4 mapping by adding a fourth dimension and a family/variant layer. Assignment now reads **`(sex × fitness_level × training_format × weekly_frequency)` + the Home/Gym content model → active Program Family / Program Variant**.

- **Program Family / Program Variant.** A **Program Family** is the trainer-authored content family selected by user attributes; a **Program Variant** exists when different weekly frequencies require a distinct authored structure. Both terms are **internal-only** — the user never sees them (nor "full body" / "split" / "assignment key"). The user sees only level, place, and frequency.
- **Weekly Frequency** (`two_per_week` · `three_per_week` · `four_per_week`) is chosen **conditionally** on S3 — only after Experience and Training Format are selected, and only the allowed options for that combination appear (D079/D081). It is a Program-assignment input.
- **Home content model.** Home may use a **shared, scalable 4-workout home family**; the selected frequency determines how many of the 4 workouts are active in the weekly cycle (Home supports 2/3/4). Home need not be split into separate authored programs per experience if the trainer judges the shared family safe and valid — keeping MVP content workload manageable.
- **Gym content model.** Beginner + Gym: 2 or 3 / week, full-body logic. Intermediate + Gym: 2 or 3 / week, may require frequency-specific authored variants. Advanced + Gym: 3 or 4 / week, where the **3-day and 4-day splits are separate valid authored variants** — a 4-day split must **not** be truncated into a 3-day split where that breaks the program. The trainer controls authored content.
- **Content-workload guard.** Prefer Program Families + scalable Home content over **24 fully independent monthly programs**, but do **not** fake scalability for gym splits where truncation would be unsafe or poor training design.
- **Editing after onboarding (Decision 080).** Changing Sex / Experience / Training Format / Weekly Frequency triggers **Program Replacement / Variant recalculation** (§7) **without resetting** XP, Level, Stage, Streak, Workout History, Weight History, or Avatar Progression. On replacement the pointer resets to Workout 1 of the new Program/Variant (Decision 059); an in-progress workout is not cancelled (Decision 058). Changing **Goal** or **Avatar Name** never changes assignment.

---

## 5. Lifecycle

A Program **does not end** (Decision 046 — workouts cycle continuously). Its lifecycle:

1. **Assigned** at onboarding from (Sex, Fitness Level, Training Format) — §4.
2. **Cycled** indefinitely via the Journey pointer (Decisions 046/051), initial state Workout 1 (Decision 059).
3. **Updated** in place by the coach (~monthly): the content behind the slots changes; assignment and cycle continue — §6.
4. **Replaced** when the user's assignment inputs change: a different Program becomes active — §7.

There is no "finished" terminal state and no progress-toward-completion concept at any point. All workouts in the active Program remain visible and accessible at all times (Decision 047).

---

## 6. Program Updates

The coach refreshes content roughly monthly: `Workout A → Workout A v2`, same Program identity, same assignment, typically the same slot count.

**Accepted isolation rule:** an update affects **future workout content only**. It must not touch XP, Level, Stage, Streak, Workout History, or Weight History.

How the architecture guarantees this:

- **The Journey pointer references the cycle *position* (slot), not a specific content version.** If "next = B", after an update "next = B v2". The pointer survives updates with **no reset** and emits **no XP event** — consistent with Decision 046 (position-based cycle) and Decision 051 (pointer advances from the workout actually completed).
- **Past completions are immutable and snapshot-protected.** A completion references a **snapshot** of the workout content as it was at completion time (see §10, Program Version). Updating the live Program never rewrites a past completion, so Workout History stays interpretable. This **resolves the open item "Plan snapshot at completion"** in `BFG_WORKOUT_TRACKING_ARCHITECTURE.md` §7.
- **Weight History is inherently update-proof.** It is keyed to the immutable Exercise ID (Decision 041), not to the Program, template, slot, or version. If A v2 keeps the same exercises, their weight history flows straight through; if A v2 swaps an exercise, the old exercise's history simply stops gaining entries and the new exercise's begins — Strength Progress stays coherent with no special handling.
- **Count change is the one normalization case.** If an update changes the slot count and the pointer's slot no longer exists, the pointer must **resolve to a valid workout** (recommended: wrap to Workout 1 of the new cycle). The invariant: a count change resolves the pointer to a valid slot and **never** emits a progression event. Exact normalization is an implementation detail, consistent with Decision 046's note that cycle-position storage is implementation-level.

---

## 7. Program Replacement

The user's inputs change → a different Program becomes active (e.g. Beginner Home → Beginner Gym, or Beginner Gym → Intermediate Gym).

**Accepted isolation rule:** replacement must not grant XP, or modify Level, Stage, or Streak. At most, the **Avatar/Companion may neutrally comment** on the change (`BFG_BEGINNER_JOURNEY.md`'s logistical, no-shame framing; Decisions 031, 038).

**Edge case #1 — Journey Pointer on replacement (accepted):**
When the Program changes, the Journey pointer **resets to Workout 1 of the newly assigned Program** (reusing Decision 059's initial-state logic). Reason: Programs are independent content containers; workout counts and ordering may differ; cycle position is meaningful only inside the current Program.

**Edge case #2 — replacement during an active workout (accepted):**
Program Replacement does **not** cancel an In-Progress workout (Decision 058 — one active workout, no cancellation). The active workout **completes against the snapshot that existed when the workout started**. The newly assigned Program becomes active only **after** no workout is In Progress, at which point the Journey pointer initializes to **Workout 1** of the new Program. This keeps the single-active-workout boundary (Decision 058) and the start/finish boundaries (Decisions 049, 050) intact.

**History across replacement:** Workout History and Weight History are **retained, never deleted or rewritten**. Completions are historical facts keyed to completion events (Decision 040) and Exercise IDs (Decision 041). Weight History continues to accumulate per Exercise ID across Programs — if Beginner Gym and Intermediate Gym share `barbell-back-squat`, its strength line is continuous across the switch.

---

## 8. Journey Relationship

- The Program supplies the **ordered workout set** the Journey pointer cycles through (Decision 046).
- The pointer is **position-based**, so Program Updates do not reset it (§6); Program Replacement re-initializes it to Workout 1 via Decision 059 (§7).
- Decision 051 (pointer advances from the workout actually completed) is unchanged.
- Decision 059 (initial pointer → Workout 1) is reused both at first assignment and at replacement.
- Decision 047 (all workouts visible/accessible, no locks) holds within every Program.

---

## 9. Workout Relationship

- The Program is the layer **directly above** the Workout Template (Decision 060). It owns *which* templates and *in what order*; the Template owns its Steps and prescription; the Step owns its 1–2 exercises; the Library owns exercise identity.
- The Program **references** templates and never embeds them, never stores workout structure, and never stores exercise identity. Workout structure lives in Steps/Templates (Decision 060); exercise identity lives in the Library (Decision 041).
- Full content hierarchy: **Program → Workout Template → Workout Step → Exercise.**

---

## 10. Tracking Relationship

- The Program is **invisible to Workout Tracking.** The only tracked event is workout completion (Decision 040); XP/Level/Stage/Streak run off it alone, so a Program can never move them.
- **Completion snapshots** (§6, §10 Program Version) are what make updates and replacement history-safe: a completion records the content as assigned at that moment, so later edits never corrupt past completions. This resolves `BFG_WORKOUT_TRACKING_ARCHITECTURE.md` §7 item 1.
- Weight History keys on the immutable Exercise ID (Decision 041), independent of Program, template, slot, or version.

---

## 11. Program Version Concept

**Program Version is an internal architecture concept. Users never interact with versions directly.** It exists to make content evolution safe:

- **Safe content updates** — the coach can change a Program's templates without touching live or past user state.
- **Monthly program refreshes** — `Workout A → A v2` is a new version of the same Program; the active version feeds future workouts.
- **Historical consistency** — completions reference the snapshot/version under which they were performed, so Workout History stays interpretable through monthly churn.
- **Active-workout protection** — an In-Progress workout completes against the snapshot that existed when it started (§7, edge case #2), even if the Program is updated or replaced meanwhile.

Program Version is a mechanism, not a user-facing feature: there is no version picker, no "upgrade" prompt, and no version shown in the UI.

---

## 12. Risks

| Risk | Prevention |
|---|---|
| Program treated as a progression/course (completion %, graduation, XP) | Non-goals (§13): Program is a selector only; progression runs off completion (Decision 040), never off Program. |
| Monthly update corrupts Workout History | Completions snapshot assigned content at completion time (resolves Tracking §7); live edits never touch past completions (§6, §10). |
| Update/replacement silently breaks Weight History | Weight History keyed to immutable Exercise ID (Decision 041), not Program/template/version — inherently isolated. |
| Pointer breaks when an update changes slot count | Pointer is position-based and normalizes to a valid slot (wrap to Workout 1); never emits a progression event (Decision 046 count-agnostic). |
| Replacement grants XP or resets Stage/Streak | Isolation rule: replacement affects future content only; at most a neutral companion comment (Decisions 031, 038). |
| Replacement mid-session ambiguity | In-Progress workout completes against its start-time snapshot (Decision 058 honored); new Program activates and pointer resets to Workout 1 once nothing is In Progress (§7). |
| Program drifts into storing workout structure or exercise identity | Program references templates only; structure lives in Steps/Templates (Decision 060); identity in the Library (Decision 041). |
| Near-duplicate Programs / assignment-key collisions | Deterministic single mapping per (Sex, Level, Format); curation discipline on the coach, parallel to Decision 041's near-duplicate risk. |

---

## 13. Non-Goals

A Program is **not**, as a matter of principle:

- a course, a challenge, or a progression system;
- a source of XP, Levels, Stages, Streak, or rewards;
- user-built or user-customizable (no choosing exercises, sets, or reps — Decision 040);
- a store of user data (pointer, history, progress live elsewhere);
- a store of workout structure (Steps/Templates, Decision 060) or exercise identity (Library, Decision 041);
- a locking or gating mechanism (all workouts stay accessible — Decision 047);
- a user-facing versioning feature (Program Version is internal — §11).

> **Principle: a Program selects content; it never produces progression.**

---

## 14. Final Architecture

A five-layer content model with a hard selector/structure/identity split:

1. **Program** (Decision 061) — coach-authored, named, ordered set of 2–5 Workout Templates; assigned deterministically by Sex × Fitness Level × Training Format; cycles forever; carries no user data and no structure.
2. **Workout Template** (Decision 060) — ordered list of Steps + prescription.
3. **Workout Step** (Decision 060) — one session screen, 1–2 exercises (a two-exercise Step is a superset).
4. **Exercise** (Decision 041) — canonical movement, immutable Exercise ID.
5. **Journey** (Decisions 046/051/059) — cycles the Program's templates; pointer position-based, initial state Workout 1.

The invariants that make this stable:

- **Program selects content, never progression** — XP/Level/Stage/Streak run off completion (Decision 040); weight history keys on Exercise ID (Decision 041); neither references a Program.
- **Updates change future content only** — position-based pointer + completion snapshots keep history and weight intact.
- **Replacement resets the pointer to Workout 1** (Decision 059) and **never cancels an active workout** (Decision 058).
- **Program Version is internal** — the mechanism for safe updates, historical consistency, and active-workout protection.

This lets the coach evolve and swap Programs freely over time while user progression, history, weight analytics, and the Exercise Library remain interpretable and untouched.
