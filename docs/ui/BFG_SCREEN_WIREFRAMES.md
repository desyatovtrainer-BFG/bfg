# BFG Screen Wireframes

First official **Wireframe Layer** for BFG. This document specifies screen *composition, hierarchy, state, and transitions* — not visual design. It is built strictly from accepted product decisions; it invents nothing.

> Source of truth: [`BFG_PRODUCT_DECISIONS.md`](../BFG_PRODUCT_DECISIONS.md) (decisions win on any conflict) and [`BFG_UI_RULES.md`](../BFG_UI_RULES.md) §15–§19. Where this document and a decision disagree, the decision wins and this document must be corrected.

Status: first slice. This pass covers **Activity, Workout Start Screen, Single Exercise Step, Superset Step, Workout Finish Screen, Reward Modal, Evolution Flow**. Home, Progress, and per-variant detail are deferred to a later wireframe pass.

Last updated: 2026-06-23 (Reward Modal final D067, Evolution Flow final D069, Deferred Progress Visualization D070).

For every screen this document records, in order:

1. **Goal** of the screen
2. **Composition** top → bottom
3. **Primary visual accent**
4. **Secondary element**
5. **User action**
6. **Destination after the action**

---

## Conventions

- Mobile-first frame, 360–430px, dark/calm (BFG_UI_RULES §1).
- Workout card content = **Workout Number · Workout Title · Exercise Count** only (D045, D055, D068).
- Card outline by state (D054): **Default** = blue · **Upcoming** = orange + marker · **In Progress** = green + marker. One state marker per card (D048); In Progress has list-wide priority over Upcoming (D057).
- "Continue Journey" (the global resume action) lives on **Home**, never on Activity (D043). Home is out of scope for this slice.
- Session navigation is **swipe-only**, no Next/Previous buttons (D063).

---

# 1. Activity

Functional browsing surface; the emotional center is Home (D055, D039). Fixed frame across all states:

```
┌─────────────────────────────┐
│  Activity                   │  Header: "Activity" only (D055)
├─────────────────────────────┤
│  WORKOUTS                   │  Section 1 — always above (D042)
│  ┌───────────────────────┐  │  vertical list, program order,
│  │ [workout card]        │  │  no reorder, no horizontal scroll (D055)
│  │ [workout card]        │  │  equal-size cards (D054)
│  │ [workout card]        │  │
│  └───────────────────────┘  │
│  DAILY QUESTS               │  Section 2 — always below (D042)
│  ○ / ● quest row            │  binary state only (D055)
│  ○ / ● quest row            │
│  ○ / ● quest row            │
├─────────────────────────────┤
│  BottomNav                  │  (D003)
└─────────────────────────────┘
```

**1. Goal:** let the user browse the assigned workout program (primary) and the day's 3 supportive quests (secondary), and open any of them.

**2. Composition top → bottom:** Header "Activity" → **Workouts** section (vertical list of equal-size cards in program order) → **Daily Quests** section (3 binary rows) → BottomNav.

**3. Primary visual accent:** the single special-state workout card — **In Progress (green)** if one exists, otherwise **Upcoming (orange)**. Emphasis is by state/color/position, never size (D054).

**4. Secondary element:** Default (blue) workout cards, then the Daily Quests section (quests never carry workout-card weight, D042).

**5. User action:** tap a workout to open it; tap a quest row to mark it Completed.

**6. Destination after the action:**
- Tap a workout → its **Workout Start Screen** (§2).
- Tap a quest → row becomes **● Completed**; user **remains on Activity** (D069). If the quest caused a Stage Evolution → **Evolution Flow** (§7).

### Activity states (D054, D056–D059, D069)

| State | Workout list appearance | Notes |
|---|---|---|
| **First entry (new user)** | Workout 1 = Upcoming (orange + marker); all others Default (blue) | Pointer initialized to Workout 1 (D059) |
| **Upcoming exists (normal cycle)** | exactly one Upcoming (orange); rest Default | Which card is Upcoming is set by the pointer (D046/D051) |
| **Workout In Progress** | exactly one In Progress (green); **no orange/Upcoming anywhere** | In Progress has absolute priority (D057); other cards open with "Return To Workout" (D058) |
| **After completion** | finished card returns to **Default** (no marker); next cycle workout becomes Upcoming | No Completed/Finished card state; history lives on Progress (D056, D008) |

| Quest section state | Appearance |
|---|---|
| None done | three ○ Not Completed rows |
| Some done | mixed ● / ○; row order never changes; no "1/3" counter (D055) |
| All done | three ● rows; no celebration, no new CTA, no "3/3" (D055, D031) |

> No weight entry, analytics, dates, or progress metrics anywhere on Activity (D044, D045, D055). Empty/completed states are never framed as failure (D031).

---

# 2. Workout Start Screen

Pre-start screen (D062). The Start Workout press is the start boundary (D049).

```
┌─────────────────────────────┐
│  Push Day                   │  Workout Title (D062)
│                             │
│  Steps                      │
│  1. Жим лёжа                │  ordered Workout Step list —
│  2. Тяга + Скручивания      │  counts STEPS, not exercises (D068)
│  3. Разводка гантелей       │  (a superset = one Step, two exercises)
│  4. Французский жим          │
│                             │
│  [ Start Workout ]          │  primary (D062); or [ Return To Workout ]
└─────────────────────────────┘  if another workout is In Progress (D058)
```

**1. Goal:** show the shape of the session (its Steps) and provide the single start boundary.

**2. Composition top → bottom:** Workout Title → ordered Workout Step list → primary button (**Start Workout**, or **Return To Workout** when another workout is already In Progress).

**3. Primary visual accent:** the **Start Workout** button (the start boundary, D049).

**4. Secondary element:** the ordered Step list (shows session shape).

**5. User action:** press Start Workout to begin (weight fields appear, the "not started" reminder disappears — D053, D052); or swipe forward to preview Steps before starting (D052/D063).

**6. Destination after the action:** → **Workout Step 1** in the started state (§3). If Return To Workout → the currently active session.

> Forbidden here (D062): duration, difficulty, categories, analytics, companion content.

---

# 3. Single Exercise Step

One exercise = one Step screen (D060, D064). Two visualization states, before vs after Start Workout.

**State A — pre-start / preview (D052, D053):**
```
┌─────────────────────────────┐
│  ⓘ Тренировка не начата      │  persistent "not started" reminder (D052)
│  ┌───────────────────────┐  │
│  │       [ VIDEO ]       │  │  Exercise Video — primary position (D064)
│  └───────────────────────┘  │
│  Жим лёжа                   │  Exercise Title
│  3 подхода · 10 повторов    │  Prescription (Sets/Reps or Duration)
│  (weight field hidden)      │  weight hidden before Start (D053)
└─────────────────────────────┘
```

**State B — started (D053):**
```
┌─────────────────────────────┐
│  (no reminder)              │  reminder removed once started (D052)
│  ┌───────────────────────┐  │
│  │       [ VIDEO ]       │  │  Exercise Video — primary (D064)
│  └───────────────────────┘  │
│  Жим лёжа                   │  Title
│  3 подхода · 10 повторов    │  Prescription
│  Рабочий вес [ ___ ] кг     │  optional Weight Field, visible after Start (D053)
└─────────────────────────────┘
```

**1. Goal:** guide one exercise via video; after Start, allow optional weight logging.

**2. Composition top → bottom:** ("not started" reminder, pre-start only) → **Exercise Video → Exercise Title → Prescription → optional Weight Field** (weight only in State B). Strict vertical hierarchy (D064).

**3. Primary visual accent:** the **Exercise Video** (D064).

**4. Secondary element:** Title + Prescription; then the optional Weight Field last (D064). Pre-start, the calm non-blocking "not started" reminder (D052).

**5. User action:** watch the video / perform the exercise; optionally enter weight (State B); swipe between Steps (D063). Weight is optional, analytics-only, keyed to Exercise ID; it never affects XP/levels/streak (D040, D044).

**6. Destination after the action:** swipe forward → next Step; swipe forward past the final Step → **Workout Finish Screen** (§5/D063).

---

# 4. Superset Step

A superset is **one Step** with two exercises shown simultaneously (D060, D065). No Superset entity, no "1/2"/"2/2" notation, no "2 exercises" label (D065).

```
┌─────────────────────────────┐
│  (started: weight visible)  │
│  ┌──────────┐ ┌──────────┐  │  horizontal two-card structure (D065)
│  │ [VIDEO]  │ │ [VIDEO]  │  │  vertical (portrait) videos (D065)
│  │ portrait │ │ portrait │  │
│  │ Тяга     │ │Скручив-я │  │  each card: own Title
│  │ 3×12     │ │ 3×15     │  │  own Prescription
│  │ [__] кг  │ │ [__] кг  │  │  two INDEPENDENT weight fields (D065)
│  └──────────┘ └──────────┘  │
└─────────────────────────────┘
```

**1. Goal:** present a superset as a single Step while keeping each exercise individually identifiable.

**2. Composition top → bottom:** ("not started" reminder pre-start) → two side-by-side exercise cards, each with **Video → Title → Prescription → independent Weight Field** (weight only after Start, D053).

**3. Primary visual accent:** the two portrait Exercise Videos shown together (two co-equal cards).

**4. Secondary element:** the two Titles, two Prescriptions, and two independent Weight Fields (per-Exercise-ID history, D041/D044).

**5. User action:** perform both exercises; optionally enter weight in each field; swipe to navigate (D063). The two exercises must read as one Step yet stay visually distinct (D065).

**6. Destination after the action:** swipe forward → next Step or **Workout Finish Screen** (§5).

> Reconciliation follow-up (recorded in the registry, not a contradiction): the horizontal two-card + portrait-video layout must be validated against §1 (mobile 360–430px) and §13 (no carousels) — both cards are shown simultaneously, not as a carousel.

---

# 5. Workout Finish Screen

Separate screen after the final Step (D063, D066). Finish Workout is the completion boundary (D050).

```
┌─────────────────────────────┐
│                             │
│      Workout Complete       │  (D066)
│                             │
│     [ Finish Workout ]      │  completion boundary (D050)
│                             │
└─────────────────────────────┘
```

**1. Goal:** provide the explicit completion boundary.

**2. Composition top → bottom:** "Workout Complete" → **Finish Workout** button.

**3. Primary visual accent:** the **Finish Workout** button.

**4. Secondary element:** the "Workout Complete" line.

**5. User action:** press Finish Workout — records completion, grants workout XP (D015), advances the journey pointer from the workout actually completed (D050/D051).

**6. Destination after the action:** → **Reward Modal** (§6, D067).

> Forbidden here (D066): companion content, any additional metrics.

---

# 6. Reward Modal (D067, final version)

Presented as a **modal window over a dimmed background** — not a separate screen, not a bottom banner, not a toast (D067). Shows **only the values that changed**, largest first: **Stage → Level → XP**.

**State A — no Stage growth (button):**
```
        ╱ dimmed background ╲
   ┌─────────────────────────┐
   │      Уровень 7          │   shown only if Level changed
   │        + 10 XP          │   XP (always, if changed)
   │                         │
   │   [ Return To Activity ]│   single button (D067)
   └─────────────────────────┘
```
- Only-XP case shows just `+ 10 XP`. Level line appears only if the level changed (D067).

**State B — Stage growth (no button, auto-advance):**
```
        ╱ dimmed background ╲
   ┌─────────────────────────┐
   │   SEEKER / STAGE 4      │   Stage (largest, first — D067)
   │      Уровень 9          │   Level
   │        + 10 XP          │   XP
   │                         │
   │  (no button)            │   auto-advance to Home in 5–7s (D067)
   │  tap to speed up →      │   tap accelerates; never skips (D069)
   └─────────────────────────┘
```

**1. Goal:** show, honestly and calmly, only what changed from the completion.

**2. Composition top → bottom:** changed values in priority order **Stage → Level → XP** (each line shown only if it changed) → then either a **Return To Activity** button (no Stage growth) or nothing (Stage growth, auto-advance).

**3. Primary visual accent:** the **largest reward that changed** — Stage if present, else Level, else XP (D067).

**4. Secondary element:** the smaller changed values below the primary one; companion reaction only rarely, for meaningful milestones (D036/D037).

**5. User action:**
- **No Stage growth:** press **Return To Activity**.
- **Stage growth:** wait for the 5–7s auto-advance, or **tap the modal to speed up** the transition (tap cannot skip the Evolution Animation — D069).

**6. Destination after the action:**
- **No Stage growth →** **Activity** (§1, D069).
- **Stage growth →** **Home → Evolution Animation** (§7, D069).

> Deferred Progress Visualization (D070): the Reward Modal shows the in-the-moment change here. When the user later opens Home or Progress and an indicator was not on screen at completion time, that surface separately animates last-seen → current (§7 note; BFG_UI_RULES §19).

---

# 7. Evolution Flow (D069, final version)

A **Stage Evolution overrides the post-reward destination** and routes to **Home**, where the Evolution Animation plays — regardless of trigger (D069). The transformation is **unskippable**.

```
Workout: Finish Workout → Reward Modal (Stage shown) ─┐
Quest:   Quest Complete → Reward Display (Stage shown)─┤
                                                       ▼
                                                ┌────────────┐
                                                │    HOME     │
                                                │  ◉ Living   │  Evolution Animation
                                                │  Presence   │  plays here (D069, §15)
                                                │  Stage Block│  updated Title/Number
                                                │ [Continue   │
                                                │  Journey]   │
                                                └────────────┘
```

**1. Goal:** stage the most significant progression moment (Stage Evolution, D035) on Home — the emotional center (D002, D007, D039).

**2. Composition top → bottom:** route to Home → **Living Presence** (center) playing the **Evolution Animation** → updated **Stage Block** (Title + Number) → Home's standard composition resumes (§15). This is a transient milestone moment, not a new Home fixture (§15).

**3. Primary visual accent:** the **Living Presence + Evolution Animation** (the avatar transformation).

**4. Secondary element:** the updated Stage Block; Home's two progress rings (§15).

**5. User action:** watch the transformation (it **cannot be skipped**; a tap earlier only sped the transition to Home, D067/D069); then continue via "Continue Journey" (D043).

**6. Destination after the action:** animation completes → standard **Home**; "Continue Journey" → the next assigned workout (D043, D046).

> Priority rule (D069): Stage Evolution has **absolute priority** over the current screen; the reason for the evolution does not matter; Home is the stage for the transformation. Non-evolution completions do **not** reach this flow — normal workout completion returns to Activity, normal quest completion stays on Activity (D069).
> Deferred Progress Visualization (D070): on arriving at Home, Home also animates its own progress indicators (Level Progress + Activity Progress ring) from their last-seen state to current, then clears Home's memory — independently of the Progress screen's memory (BFG_UI_RULES §19).

---

## Decisions referenced

D031 (no-shame), D035 (evolution as milestone), D039 (Home composition), D040/D041/D044 (tracking philosophy, library, weight placement), D042–D068 (Activity + workout-session architecture), **D067 (Reward Modal, final)**, **D069 (Evolution Flow, final)**, **D070 (Deferred Progress Visualization)**. UI rules: BFG_UI_RULES §15, §16, §17, §18, §19.

## Out of scope for this slice (later wireframe passes)

Home, Progress, the per-state Activity screen mockups, the Reward Modal value variants in detail, and any new screens. No new product decisions are created by this document.
