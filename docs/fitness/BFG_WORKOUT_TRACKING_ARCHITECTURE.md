# BFG — Workout Tracking Architecture v1

Status: **Accepted** (registry Decision 040, accepted 2026-06-19)
Category: Fitness System

This document specifies the accepted Workout Tracking model for BFG. It records **what is tracked and why**, not how the database or UI are built. When this document disagrees with `BFG_PRODUCT_DECISIONS.md`, the registry wins and this document must be updated.

Companion documents:
- `docs/fitness/BFG_EXERCISE_METADATA.md` — exercise types, load types, and weight semantics.
- `WORKOUT_CONTENT_GUIDE.md` §12 — operational summary for content authors.
- `docs/BFG_PRODUCT_DECISIONS.md` — Decisions 015, 020, 021, 031, 040.

---

## 1. Goals

- Make a workout trivially easy to start and finish — the only two actions a user must take.
- Keep the training flow free of journaling friction, optimized for the beginner target user.
- Let progression (XP, levels, streak, stages) run entirely off **workout completion**, the primary tracked event.
- Allow committed users to keep an **optional** personal record of working weight, without ever making it a requirement or a source of pressure.
- Collect, automatically and frictionlessly, only the data the product can honestly use.

Non-goal of the model: a complete, auditable training log. BFG is not a workout journal. Emotion over statistics (`BFG_ENGINEERING_RULES.md`).

---

## 2. MVP Tracking Model

The only required user actions are:

1. **Start Workout**
2. **Finish Workout**

Completing a workout grants **10 XP** (Decision 015) and is the single event that drives progression (Decision 020). There are no checkboxes, no per-exercise confirmation, no set/rep/rest logging. Swipe between exercises is **navigation only** — it carries no completion meaning.

Training plans are authored and assigned by the coach. Users do not build programs or select exercises, sets, or reps. The structured content of every workout is therefore known to the system before the user starts it.

**Accepted rule: BFG trusts the user.** The system does not police whether the assigned work was actually performed. Workout completion is accepted as sufficient for XP.

---

## 3. Automatically Collected Data

Captured without any user action:

- **Workout start timestamp.**
- **Workout finish timestamp.**
- **Workout duration** — derived from start and finish.
- **Workout completion** — the primary tracked event; the XP trigger.

**Accepted rule: duration is intentionally imperfect.** If a user starts a workout, leaves, and presses Finish hours later, the recorded duration is wrong. This is accepted because duration **never** affects XP, levels, streak, achievements, or rewards. Duration exists for personal/atmospheric reporting only, never for progression.

Consequence to honor downstream: any Progress feature that surfaces duration inherits this imperfection. Duration may power soft, aggregate, or atmospheric statistics; it must not power precise or superlative claims presented as fact (see §6 and the open item in §7).

---

## 4. Optional Data

- **Working weight** — a single optional value the user may enter on exercises that use external resistance. Whether a weight field is shown, and what the entered number means, is governed entirely by exercise metadata (`BFG_EXERCISE_METADATA.md`).

Optional input rules:
- Never blocks workout flow.
- Never produces a warning, validation prompt, or nudge.
- May be entered, edited, or ignored before the workout is finished.

---

## 5. Weight Tracking Philosophy

Working weight exists for **personal strength analytics only**. It is fully decoupled from the game economy:

- Weight logging never affects **XP**.
- Weight logging never affects **Levels**.
- Weight logging never affects **Streak**.
- Weight logging never affects **Achievements**.
- Users are **never penalized** for not logging weight.

Because weight is decoupled from progression, a user who never logs weight has an identical game experience to one who logs every session. The two populations differ only in whether the Strength Progress surface exists for them (§6).

---

## 6. Progress Dependencies

What the Progress surfaces depend on, and what they can honestly show:

- **Workout history (completion events)** → workout count, training frequency / consistency, training calendar, streak (existing), and — because plans are coach-authored and carry category/muscle-group metadata — a **category-coverage breakdown derived from the assigned plan with no user logging**.
- **Workout duration** → soft, aggregate time statistics only, subject to the imperfection rule (§3).
- **Optional working-weight history** → **Strength Progress**: per-exercise working-weight history and a progression graph. Weight history is attached to the **Exercise ID** from the centralized Exercise Library (Decision 041), never to a workout-local exercise copy — so history stays coherent across plan edits, template changes, and content (title/video) updates.

**Accepted rule: Strength Progress appears only after weight has been logged at least once.** An exercise enters Strength Progress only once the user has logged weight for it. If the user never logs weight, Strength Progress simply does not appear.

**Accepted rule: no empty-state pressure.** There are no "missing data" blocks, no empty states, and no copy encouraging the user to log weight. This is the no-shame rule (Decision 031) applied to the Progress surface: a feature the user does not feed is absent, never presented as a failure.

---

## 7. Future Extensions

Recorded as direction, not as committed scope. None of these reintroduce mandatory logging or exercise-completion tracking.

- **Plan-derived analytics** — richer use of coach-plan metadata already attached to completions (movement-pattern balance, category coverage over time). Zero new user input.
- **Passive media telemetry** — e.g. video-playback signal from the existing Kinescope integration, as a frictionless engagement signal. A deliberate yes/no decision, not assumed; it is media telemetry, not exercise-completion tracking.
- **Coach-facing feedback signal** — the model currently gives the coach (the only adaptation channel) very little input. Any future widening of this is an extension to design consciously.
- **Richer strength semantics** — if working-weight history proves too thin to represent strength progress (rep-driven gains at fixed weight are invisible to a weight-only line), any enrichment must remain optional and must not become a required journal.

Open architectural items (see also the consuming review and §8):

1. **Plan snapshot at completion.** *(Still open.)* Coaches edit and reassign plans. A completion must reference a snapshot of what was assigned at that moment, or template history becomes uninterpretable when plans change. (The Exercise ID protects *strength* history; a plan snapshot is still required to protect *template* history — the two mechanisms are complementary, not interchangeable.)
2. **Stable exercise identity.** *(Resolved by Decision 041.)* Strength Progress aggregates the same exercise across different plans/days via the centralized Exercise Library's immutable Exercise ID. Workout Tracking must never rely on workout-local exercise copies — all per-exercise tracking resolves to the canonical Exercise ID (`BFG_EXERCISE_LIBRARY_ARCHITECTURE.md` §7–§8).
3. **Working-weight semantic.** *(Resolved by Decisions 040–041.)* The meaning of the single optional number is fixed per load type and owned by the Exercise Library metadata (`BFG_EXERCISE_METADATA.md` §5, §7). Because Load Type is identity-sensitive once history exists, the semantic stays fixed for the life of an Exercise ID.
4. **Duration honesty boundary.** *(Still open.)* Decide explicitly which Progress statistics may lean on (imperfect) duration.

---

## 8. Explicit Non-Goals

BFG does **not** track, in MVP:

- set completion
- rep completion
- exercise completion
- RPE (rate of perceived exertion)
- rest periods
- exercise notes
- favorite / most-used / preferred-exercise analytics (users do not select exercises — coach-authored plans make this low-value)

BFG does **not**, as a matter of principle:

- gate XP or progression on per-exercise data;
- present any empty state or nudge around optional weight logging;
- treat workout duration as a trustworthy or reward-bearing metric;
- penalize a user for logging nothing beyond Start and Finish.

> **Principle: Zero mandatory workout logging.**
