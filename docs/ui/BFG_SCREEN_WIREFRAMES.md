# BFG Screen Wireframes

First official **Wireframe Layer** for BFG. This document specifies screen *composition, hierarchy, state, and transitions* — not visual design. It is built strictly from accepted product decisions; it invents nothing.

> Source of truth: [`BFG_PRODUCT_DECISIONS.md`](../BFG_PRODUCT_DECISIONS.md) (decisions win on any conflict) and [`BFG_UI_RULES.md`](../BFG_UI_RULES.md) §15–§20. Where this document and a decision disagree, the decision wins and this document must be corrected.

Status: first slice. This pass covers **Entry / Auth Start, Activity, Workout Start Screen, Single Exercise Step, Superset Step, Workout Finish Screen, Reward Modal, Evolution Flow, Home, Progress**. Per-variant detail, the onboarding flow, and the Avatar Customization surface (D073) are deferred to a later wireframe pass.

Last updated: 2026-06-26 (Entry / Auth Start Screen D074 — Entry wireframe added; Final Progress Product Structure D072 + Avatar Customization Entry D073 — Progress wireframe added, Home tap annotation added).

For every screen this document records, in order:

1. **Goal** of the screen
2. **Composition** top → bottom
3. **Primary visual accent**
4. **Secondary element**
5. **User action**
6. **Destination after the action**

---

## Conventions

- Mobile-first frame, 360–430px, dark/calm (BFG_UI_RULES §1). These wireframes are **mobile-first** and describe the 360–430px source-of-truth structure; on tablet the **cinematic canvas may expand** (atmosphere/glow/rings/side fields scale up) while readable/interactive content stays capped and centered — the app never becomes a desktop dashboard (Adaptive Cinematic Canvas, **Decision 075** / BFG_UI_RULES §2).
- Workout card content = **Workout Number · Workout Title · Exercise Count** only (D045, D055, D068).
- Card outline by state (D054): **Default** = blue · **Upcoming** = orange + marker · **In Progress** = green + marker. One state marker per card (D048); In Progress has list-wide priority over Upcoming (D057).
- "Continue Journey" (the global resume action) lives on **Home**, never on Activity (D043). Home is specified in §8.
- Session navigation is **swipe-only**, no Next/Previous buttons (D063).
- The **Entry / Auth Start** screen (§0) is the **unauthenticated** first contact; all other screens here are post-auth (D074).

---

# 0. Entry / Auth Start Screen

The **unauthenticated** first-contact screen (D074). Calm, dark, cinematic — not a raw login form, not a marketing landing page. Leads into Sign Up (email/password, MVP) → onboarding, with a quiet Log In path for returning users. **No scroll** — the whole screen fits the initial mobile viewport (BFG_UI_RULES §1, §21).

```
┌─────────────────────────────┐
│  BFG.                        │  Minimal brand mark (small, top)
│                             │
│          ╭───────╮          │  SEED FORM (First Presence Form) — optical center
│          │ ◌ ◌ ◌ │          │   • alive but minimal: breathing + subtle glow (MVP Body floor)
│          │ first │          │   • neutral · unfinished · not gendered · not customized
│          │ form  │          │   • NOT a default/final avatar · NEVER Stage 10 (D010)
│          ╰───────╯          │   • Voice-silent (first Voice moment = first session, PRS §4)
│                             │   • tap-reactive DECORATIVELY · NOT a navigation affordance
│   [headline — placeholder]  │  calm, sentence case (no all-caps, no «победы») — copy not final
│   [subtitle — placeholder]  │  optional one-line subtitle — copy not final
│                             │
│   ┌─────────────────────┐   │
│   │   [Primary CTA]      │   │  the ONLY primary action → Sign Up (copy not final)
│   └─────────────────────┘   │
│         [Log in]            │  quiet secondary link → Log In (copy not final)
│                             │
└─────────────────────────────┘
   Mobile-first 360–430px · dark/calm · NO SCROLL · fits initial viewport
```

**1. Goal:** make calm, premium first contact and offer the single way in (Sign Up), with a quiet Log In path — without showing the final avatar, without marketing, without a dry form.

**2. Composition top → bottom (D074):** Minimal brand mark → **Seed Form** (center) → calm headline (+ optional one-line subtitle) → **single primary CTA** (→ Sign Up) → quiet secondary **Log In** link.

**3. Primary visual accent:** the **Seed Form** — alive but minimal, neutral, non-final (never Stage 10 / never a default avatar, D010).

**4. Secondary element:** the headline/subtitle and the quiet Log In link. The **primary CTA** is the only primary action (the Seed Form is not a competing action).

**5. User action:** press the **primary CTA** → Sign Up. Optionally **tap the Seed Form** → a **decorative path hint only** (soft stir/glow toward the CTA, short and calm, within the §5 motion budget, `prefers-reduced-motion` respected) — it does **not** navigate, open auth/onboarding/customization, speak, or open any modal/tooltip/hint (D074). Tap the quiet link → Log In.

**6. Destination after the action:**
- Primary CTA → **Sign Up** (email/password) → **onboarding** (onboarding flow specified separately).
- Seed Form tap → **no destination** (decorative hint only; stays on the Entry screen).
- Log In link → **Log In** (returning users).

> **Scope (D074):** §0 governs the Entry / Auth Start screen only. The **onboarding** Seed Form interaction is **outside D074 scope** and is specified separately by future onboarding decisions (none accepted yet); a later onboarding Seed Form must not become a repeated tap target. **No final copy** is approved — headline / subtitle / CTA text above are placeholders; D074 approves structure, interaction rules, and copy principles only.
> **Forbidden here (D074):** Stage 10 / any evolved or final avatar; a gendered/customized/finished avatar; the Seed Form as a navigation affordance or a second CTA; a second primary CTA; a companion Voice line / chat; trial / subscription / pricing (MVP); feature lists / marketing bullets / testimonials / paragraphs; "победы" / win / competition copy; hype; exclamation marks; all-caps motivational headline; casino-style motion; any scroll; emoji.

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

# 8. Home (Final Home Product Structure, D071)

The **emotional center** of BFG (D002, D007, D039, D071) — not a dashboard, activity feed, statistics screen, or workout list. Home answers: *"Where is my Presence now, and how do I continue the journey?"* Composition is fixed; the Voice Slot is the only conditional element.

```
┌─────────────────────────────┐
│                        (👤) │  Minimal Header — Profile button only (D006)
│                             │  no notification bell in MVP (D071)
│          ╭───────╮          │  Two OPEN rings around the Presence (D071):
│        ╭─┤ ◉ ◉ ◉ ├─╮        │   • Inner Ring  = Level Progress   "12 УР."
│        │ │ Living│ │        │   • Outer Ring  = Weekly Activity  "12/24 АКТ."
│        ╰─┤Presence├─╯        │  open arcs: visible start/end + split,
│          ╰───────╯          │  value label in the split, calm fill (§5/§13)
│                             │
│        SEEKER / STAGE 3     │  Stage Block — Title + Number (D071)
│   "you came back."          │  Voice Slot (event-driven, rare; may be empty) (D036–038, D071)
│                             │
│   ┌─────────────────────┐   │
│   │   Continue Journey   │   │  the ONLY primary CTA (D043) — no competitors
│   └─────────────────────┘   │
├─────────────────────────────┤
│  BottomNav                  │  (D003)
└─────────────────────────────┘
```

**1. Goal:** ground the user in their Presence (where am I now) and offer the single way forward (continue the journey).

**2. Composition top → bottom (D071):** Minimal Header (Profile button) → **Living Presence** (center, dominant) wrapped by **two open rings** (Inner = Level Progress, Outer = Weekly Activity Progress) → **Stage Block** (Title + Number) → **event-driven Voice Slot** (conditional) → **Continue Journey** CTA → BottomNav.

**3. Primary visual accent:** the **Living Presence**. The rings are a supporting layer and must never out-weigh it (§15).

**4. Secondary element:** the two open rings and the Stage Block; the Voice Slot when (rarely) present.

**5. User action:** tap **Continue Journey** (the only primary action); **tap the Living Presence → Avatar Customization / Appearance / Clothing** (the primary, MVP-only customization entry, D073 — an affordance on the Presence, not a second CTA); tap the header Profile button for account/subscription (D006).

> **Living Presence is interactive (D073).** Tap the Presence → Avatar Customization. The tap is a Presence affordance, not a competing button — "Continue Journey" stays the only primary CTA. Customization writes to **one shared avatar visual state**; changes propagate to the **Progress static portrait** (§9). One avatar, two representations (D001, D072, D073).

**6. Destination after the action (Continue Journey, D043):**
- brand-new user → **Workout 1 Start Screen** (§2, D059);
- normal cycle → **next workout** in the current Program cycle (§2, D046);
- a workout is already In Progress → the **active workout session** (D058).

### Ring semantics (D071)

| Ring | Represents | Label | Resets weekly? | Counting |
|---|---|---|---|---|
| **Inner** | Level Progress | "12 УР." | No (long-term) | arc = progress toward next level |
| **Outer** | Weekly Activity Progress | "12/24 АКТ." | **Yes — UTC week** | 1 completed workout = 1 · 1 completed daily quest = 1 · only completed actions count |

> **Outer Ring denominator (weekly activity capacity, D071):** 21 daily-quest activities (3 × 7, D017) + the **active Program cycle length** (2–5 Workout Templates, D061) → 23–26. This is the **Program cycle length, not "workouts per week"** (the Journey/Program model is count-agnostic, D046/D061). **Overflow** caps the display (e.g. "24/24 АКТ."); deeper history lives on Progress, not Home.
> **Does NOT count toward the Outer Ring (D071):** opening the app, viewing a workout/quest, maintaining a streak, entering weight, visiting Home/Progress, profile actions, passive app time.
> **Tone (D031, Companion no-ledger §X):** the Weekly Activity Ring is never framed as debt, failure, quota, or punishment; the Voice never treats it as a target.
> **Deferred Progress Visualization (D070, §19):** on entering Home, both rings animate from their last-seen state to current, then Home clears its own memory — independently of the Progress screen.

**Home must not show (D071):** workout list, quest list, raw XP table, achievement grid, detailed statistics, activity history, strength analytics, weight history, profile/account details, subscription details, multiple primary CTAs, a permanent companion chat panel, a notification bell (MVP), a third ring, a streak ring, a separate XP ring, a quest progress ring, red failure states, shame copy, hype copy, or casino-style reward animation.

> Stage Evolution (§7, D069) temporarily takes over Home for the Evolution Animation; the standard composition above resumes after — it is a transient milestone, not a new fixture (§15).

---

# 9. Progress (Final Progress Product Structure, D072)

The **identity / history / progression surface** (D005, D008, D072). Progress answers: *"Кем я стал? Как я развиваюсь? Что уже накопилось в моей истории?"* Home is the living present; Progress is the retrospective record. **Progress must not become a second Home, and must not become a noisy analytics dashboard.**

```
┌─────────────────────────────┐
│  Прогресс              (👤) │  Minimal Header — title + Profile button (D006)
├─────────────────────────────┤
│         ┌───────────┐       │  PRIMARY — Identity
│         │  ▢ STATIC  │       │  static identity portrait (D072):
│         │  PORTRAIT  │       │   • non-interactive · no tap · no animation
│         └───────────┘       │   • always = current customized avatar (D001)
│      SEEKER · STAGE 3 of 10 │  Stage / Evolution — journey position, not quota
│      Legend: «Путь ещё…»    │  Legend slot / pre-Legend placeholder (D027)
├─────────────────────────────┤
│  Ур. 12 · XP →next          │  SECONDARY — Progression (calm accumulation)
│  Серия 9 · Стадия 3/10      │  Streak = continuity, no pressure (D021/D031)
├─────────────────────────────┤
│  ▸ История                  │  ADDITIONAL — Archive (entry points, not walls)
│  ▸ Статистика               │  Statistics opt-in; strength only after 1st weight (D040)
│  ▸ Достижения               │  Achievements: MVP earned shelf → Post-MVP grid (D026)
├─────────────────────────────┤
│  BottomNav                  │  (D003)
└─────────────────────────────┘
```

**1. Goal:** show **who the user has become** (identity), **how they have grown** (progression), and **what has accumulated** (archive) — calmly, without duplicating Home's living center.

**2. Composition top → bottom (D072):** Minimal Header (title + Profile button) → **Primary Identity Block** (static portrait + Stage/Evolution + Legend slot) → **Secondary Progression Block** (Level · XP · Streak · Stage position) → **Additional Archive Block** (History · Statistics · Achievements, as entry points) → BottomNav.

**3. Primary visual accent:** the **static identity portrait** — but it is an identity *marker*, not Home's dominant living hero. The differentiator vs Home is **still + inert (Progress) vs living + interactive (Home)**, not size.

**4. Portrait rules (D072, D001):**
- **Static · non-interactive** — does not move, animate, breathe, or respond to taps; **never opens customization** (customization is entered only from Home, D073, §8).
- **Always reflects the current customized avatar state** (appearance, clothing, cosmetics, current stage form) — never stale — but it updates **statically and silently** (no movement, no tap transition, no animated reveal). This is **not** a D070 catch-up animation.
- One avatar, two representations: Home and Progress render the **same** avatar from the **same** shared visual state.

**5. D070 Progress memory (independent from Home, §19):** on entering Progress, **XP / Level / Stage** animate last-seen → current (calm, < 600ms, `prefers-reduced-motion`), then Progress clears its own memory. Streak, History, Achievements, Statistics, and the static portrait do **not** participate. Viewing Home never clears Progress memory and vice versa.

**6. Achievements (D072):** MVP = lightweight **earned shelf** / preview; Post-MVP = full **Achievement Constellations / grid** (D026). No completion-%, no rarity comparison; locked = quiet potential; never outranks the Primary block.

**Progress must not show (D072):** leaderboards; PvP; social comparison; leagues; followers/kudos; user-selected classes; gear/loadout stats; closed rings / perfect-week framing; red failure states; shame copy; streak-loss pressure; numeric Energy / readiness / daily-verdict scores; performance-gated rewards; completion-% / rarity pressure; rank/level overlaid on the avatar; an avatar built for social identification; empty-state pressure to log weight; dense analytics walls; duplicating Home's two rings; duplicating Home's "Continue Journey" CTA; duplicating Home's living/interactive Presence role; an interactive/tappable avatar; avatar movement / idle animation / tap transition; customization entry from the portrait; casino-style animation.

---

## Decisions referenced

**D074 (Entry / Auth Start Screen)**, **D075 (Adaptive Cinematic Canvas Responsive Model)**, D031 (no-shame), D035 (evolution as milestone), D039 (Home composition), D040/D041/D044 (tracking philosophy, library, weight placement), D042–D068 (Activity + workout-session architecture), **D067 (Reward Modal, final)**, **D069 (Evolution Flow, final)**, **D070 (Deferred Progress Visualization)**, **D071 (Final Home Product Structure)**, **D072 (Final Progress Product Structure)**, **D073 (Avatar Customization Entry & Interaction)**. UI rules: BFG_UI_RULES §15, §16, §17, §18, §19, §20, §21.

## Out of scope for this slice (later wireframe passes)

The per-state Activity screen mockups, the Reward Modal value variants in detail, the Avatar Customization surface itself (D073 catalog depth), and any new screens. No new product decisions are created by this document.
