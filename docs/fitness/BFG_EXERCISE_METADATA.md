# BFG — Exercise Metadata Architecture v1

Status: **Accepted** (first approved Exercise Metadata Architecture; registered alongside Decision 040, 2026-06-19)
Category: Fitness System

This document specifies the metadata each exercise carries and the **weight-entry semantics** derived from it. It defines product behavior, not database schema or code. Companion documents: `docs/fitness/BFG_WORKOUT_TRACKING_ARCHITECTURE.md`, `WORKOUT_CONTENT_GUIDE.md` (content authoring), `docs/BFG_PRODUCT_DECISIONS.md` Decision 040.

All user-facing copy is Russian (UI rules). The Russian placeholder strings below are canonical; surrounding English is documentation only.

---

## 1. Purpose

Exercise metadata determines, per exercise:

- how the exercise behaves in a session (strength / timed / mobility / cardio);
- whether a working-weight field is shown at all;
- if shown, **what the entered number means**, so that optional weight history is consistent enough to power Strength Progress.

Weight remains fully optional in every case (Decision 040). Metadata governs **presentation and meaning** of the optional field; it never makes the field mandatory.

---

## 2. Exercise Type

Classifies how the exercise is performed.

| Type | Meaning |
|---|---|
| **Strength** | Resistance-based effort; may carry a working-weight field depending on Load Type. |
| **Timed** | Held or duration-based effort (e.g. plank). No weight field. |
| **Mobility** | Range-of-motion / flexibility work. No weight field. |
| **Cardio** | Continuous cardiovascular effort. No weight field. |

---

## 3. Load Type

Classifies the resistance source. Load Type — together with Exercise Type — determines whether weight tracking is enabled and which semantic applies.

| Load Type | Resistance source |
|---|---|
| **Dumbbell** | One or more dumbbells. |
| **Barbell** | Barbell plus plates. |
| **Machine** | A resistance machine. |
| **Bodyweight** | The user's own body. No external load. |
| **None** | No external resistance (typical for Timed / Mobility / Cardio). |

---

## 4. Weight Tracking Enabled

A boolean derived from the combination above.

- **True** — for resistance exercises with an external, quantifiable load: Load Type ∈ { Dumbbell, Barbell, Machine }.
- **False** — for Bodyweight and None, and for all Timed exercises.

When `Weight Tracking Enabled = False`, **no weight field is shown.** When `True`, an **optional** weight field is shown with the semantic and placeholder defined in §5.

---

## 5. Weight Semantics

Approved rules. The semantic fixes **what the single optional number represents** for each load type, so that Strength Progress plots a consistent quantity over time.

### Dumbbell
- The user enters the weight of **one** dumbbell.
- Placeholder: `Вес гантелей по ___ кг`

### Barbell
- The user enters the **total** barbell weight, including plates (and the bar).
- Placeholder: `Общий вес штанги ___ кг`

### Machine
- The user enters the machine resistance weight (the selected stack / setting).
- Placeholder: `Вес на тренажёре ___ кг`

### Bodyweight
- **No weight field.**

### Timed
- **No weight field.**

> Unit is kilograms (`кг`) throughout. RU-only MVP; no unit selection.

---

## 6. Semantic Consistency Rules

- The weight semantic is a property of the exercise's **load type**, not of the individual entry. The same exercise must present the same semantic every session, so its history is comparable.
- The entered number is a single working-weight value per exercise per session. It is **not** volume, tonnage, or intensity — reps and sets are not logged (Decision 040), so the number alone cannot express rep-driven progress. Strength Progress is therefore a **working-weight history**, not a complete strength model.
- For Strength Progress to aggregate an exercise across different coach-authored plans, the exercise needs a **stable identity** independent of the plan it appears in. This is provided by the centralized Exercise Library's immutable Exercise ID (Decision 041; see §7 below and `BFG_EXERCISE_LIBRARY_ARCHITECTURE.md`).

---

## 7. Exercise Library Integration

This metadata is owned by the centralized Exercise Library (Decision 041, `BFG_EXERCISE_LIBRARY_ARCHITECTURE.md`). It is authored once per canonical exercise and reused by every workout template that references that exercise — never duplicated inside workout content.

- **Metadata belongs to the Exercise Library.** Exercise Type, Load Type, title, description, and video reference are intrinsic properties of the canonical exercise, not of any single workout.
- **Weight semantics are derived from Load Type.** `Weight Tracking Enabled`, the weight semantic, and its RU placeholder are derived from Load Type (and Exercise Type), never authored as independent editable fields — this keeps them from drifting out of sync with Load Type.
- **Exercise ID is the canonical identity.** Weight history attaches to the immutable Exercise ID, so the weight semantic for a given exercise is fixed for the life of that ID.
- **Load Type becomes identity-sensitive once weight history exists.** Changing Load Type would silently alter the meaning of every past weight entry (e.g. Dumbbell = one dumbbell vs Barbell = total bar). Therefore Load Type and Exercise Type must not be edited in place on an exercise that has weight history; such a change requires retiring the exercise and creating a new canonical one (retire vs delete — `BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` §5).

### Approved Weight Semantics (canonical)

| Load Type | Weight field | Entered value | RU placeholder |
|---|---|---|---|
| Dumbbell | shown (optional) | weight of **one** dumbbell | `Вес гантелей по ___ кг` |
| Barbell | shown (optional) | **total** barbell weight incl. plates | `Общий вес штанги ___ кг` |
| Machine | shown (optional) | machine resistance weight | `Вес на тренажёре ___ кг` |
| Bodyweight | none | — | — |
| None | none | — | — |
| (any Timed exercise) | none | — | — |

Unit is kilograms (`кг`); RU-only MVP, no unit selection.

## 8. Non-Goals

- No reps, sets, RPE, or rest captured alongside weight.
- No per-set weight (one optional value per exercise, per the semantics above).
- No mandatory weight entry under any type or load combination.
- No unit selection (kg only on MVP).
