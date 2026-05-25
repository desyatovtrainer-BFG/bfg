# Workout Authoring Guide

Operational reference for content authors and engineers adding or editing workouts via Supabase Table Editor. Covers data fields, prescription types, superset rules, Kinescope video setup, and the constraints the session UI enforces.

Does not cover: game systems (XP, streak), UI component internals, or DB migrations.

---

## 1. Workout Record (`workouts` table)

| Field | Type | Notes |
|---|---|---|
| `title` | text | Short, descriptive. Used as the heading on the catalog card. |
| `description` | text | One or two sentences. Shown on the catalog card and the empty-state screen. |
| `difficulty` | enum | `easy`, `medium`, or `hard`. Enforced by DB `CHECK`. No other values. |
| `duration_min` | integer | Estimated total workout time in minutes. Should align with the sum of exercise `duration_sec` values. |
| `category` | text | Free-text category tag (`cardio`, `strength`, `mobility`, etc.). |
| `display_order` | integer | Catalog sort order. Lower = shown first. Secondary sort is `created_at` ASC. |
| `is_active` | boolean | `false` = hidden from the catalog and session routes. Draft workouts stay `false`. |
| `video_provider` | enum | `none` or `kinescope`. Legacy field on the workout row — not used by the session UI. |
| `video_id` | text \| null | Legacy. Leave `null` for all new workouts. |
| `thumbnail_url` | text \| null | Supabase Storage public URL. No external CDNs that fail in Russia. |

---

## 2. Exercise Record (`workout_exercises` table)

| Field | Type | Notes |
|---|---|---|
| `workout_id` | uuid | Foreign key to `workouts.id`. |
| `title` | text | The exercise name. Rendered as the slide heading in Unbounded font. Keep short. |
| `description` | text | Instruction copy. Displayed with `line-clamp-3` on mobile — front-load the key cue. |
| `order_index` | integer | Determines slide order (ASC). Must be unique within a workout. No gaps required, but gaps are harmless. |
| `duration_sec` | integer | See §4. Required for all exercises. |
| `video_provider` | enum | `none` or `kinescope`. |
| `video_id` | text \| null | Kinescope video ID only — not the full URL. See §8. |
| `superset_group_id` | uuid \| null | See §5. `null` for all non-superset exercises. |
| `is_active` | boolean | `false` hides the exercise from the session. Avoid leaving inactive exercises mid-sequence — this creates invisible ordering gaps. |

---

## 3. Session Flow Contract

- **One slide = one exercise = one focus.** The session UI renders each active exercise as a full-screen horizontal slide.
- Slides are ordered by `order_index` ASC. Order is fixed at publish time; to reorder, update `order_index` values.
- A **Finish slide** is always appended automatically as the last slide. Do not create an exercise row for it.
- No mid-session branching, conditional slides, or adaptive flows in MVP.
- Inactive exercises (`is_active = false`) are excluded from the session entirely. An inactive exercise in the middle of a sequence produces a visible ordering skip.

---

## 4. Prescription Types

### 4a. Timed exercise

`duration_sec` is the authoritative display value shown to the user as the slide duration label.

```
duration_sec: 45        → shows "45 сек"
duration_sec: 90        → shows "1 мин 30 сек"
duration_sec: 120       → shows "2 мин"
```

Use for: planks, holds, cardio intervals, stretches — anything where "do this for N seconds" is the complete instruction.

### 4b. Reps-range exercise

Express the repetition target in the `description` field as a range: `"10–12"`, `"15–20"`, `"8–10 на каждую сторону"`. Set `duration_sec` to the estimated time a user at this difficulty level would take to complete the prescribed reps — this value feeds session pacing and the workout catalog's duration display, but there is no active countdown timer in MVP.

```
description: "10–12 повторений с акцентом на опускание"
duration_sec: 50        (estimated ~50 s for a medium-difficulty set)
```

### 4c. No AMRAP

"Do as many reps as possible in N minutes" requires active rep counting and score tracking — both out of MVP scope. Use a reps range or a fixed timed interval instead.

---

## 5. Superset Rules

A superset is **exactly 2 consecutive exercises** sharing the same non-null `superset_group_id`.

**How to create a superset pair:**

1. Generate one UUID (e.g., via `gen_random_uuid()` in Supabase SQL editor, or any UUID generator).
2. Set `superset_group_id` to that UUID on both exercises.
3. Ensure their `order_index` values are consecutive (e.g., `3` and `4`).

**What the session does:**

- Valid pair (consecutive, same UUID): both slides show a "суперсет" label in the meta block. The progress bar in the top bar renders the pair as a single unit.
- Invalid pair: exercises are treated as normal slides. The server emits a `console.warn` at query time for each violation.

**Violations that break a superset:**

| Violation | Effect |
|---|---|
| Only 1 exercise with a given `superset_group_id` | Treated as normal slide |
| 3+ exercises with the same `superset_group_id` | All treated as normal slides |
| 2 exercises with the same `superset_group_id` but non-adjacent `order_index` | Both treated as normal slides |

---

## 6. Circuits

"Circuit" describes the intent and ordering of a workout, not a timer mode. To author a circuit:

- Order exercises in the intended rotation using `order_index`.
- Set `duration_sec` on each exercise to reflect the time for that station.
- Optionally use supersets (§5) to pair back-to-back exercises that should flow without rest.

There is no dedicated "circuit mode" toggle in MVP.

---

## 7. Pacing and `duration_sec` Guidelines

`workout.duration_min` should roughly match the sum of all active exercise `duration_sec` values, plus realistic rest time between exercises.

**Rough guidelines by exercise type:**

| Exercise type | Typical `duration_sec` range |
|---|---|
| Short cardio burst | 20–45 |
| Standard strength set | 40–75 |
| Extended timed hold | 60–120 |
| Mobility / stretch | 30–90 |
| Compound movement set | 50–90 |

**Duration should match the training goal and audience level.** BFG supports real home and gym sessions — a longer progression-oriented workout is entirely valid. Avoid unnecessarily bloated workouts in MVP, but don't impose an artificial cap on workout duration.

There is no active countdown timer in the session UI in MVP. `duration_sec` is informational — it drives the slide label and the catalog duration estimate.

---

## 8. Kinescope Video Integration

Kinescope (`kinescope.io`) is the only supported video provider in MVP. It is accessible in Russia without VPN; YouTube and Vimeo are not permitted.

**How to add a video to an exercise:**

1. Upload the video to the BFG Kinescope account and copy the video ID (the short alphanumeric code in the video URL, e.g., `AaBbCcDdEeF`).
2. In the exercise row: set `video_provider = 'kinescope'`, `video_id = '<the ID>'`.
3. Do **not** store the full embed URL — the embed URL is composed in code from `video_provider + video_id`.

**When there is no video:**

Set `video_provider = 'none'`, `video_id = null`. The session renders a calm `VideoBackdrop` placeholder. This is a valid, intentional state — not all exercises require video.

**Exercises adjacent to the active slide** have their iframes lazy-loaded (`isNearActive` window = ±1 slide). Videos further away are not in the DOM until the user swipes close.

---

## 9. Beginner-Friendly Rules

- Set `difficulty = 'easy'` for workouts intended as entry points for new users.
- Keep `duration_sec` on the higher end of the range for easy exercises — give beginners time to complete the movement without rushing.
- Prefer timed prescriptions over reps ranges for beginners: "hold for 30 seconds" is less ambiguous than "10–12 reps" for someone learning the movement.
- Order exercises: lower-intensity or familiar movements first, higher-intensity last.
- Descriptions should be instructional, not motivational. One concrete cue is better than encouragement.

---

## 10. Mobile-First Readability

- **Title:** Keep under ~40 characters. Rendered in Unbounded bold (`text-xl`), one line preferred. Longer titles wrap and push other meta content down.
- **Description:** Rendered with `line-clamp-3` on mobile. Front-load the most important cue — anything after line 3 is clipped on small screens.
- **Russian copy rules:** Formal but warm "ты". No exclamation marks for motivation. No corporate fitness vocabulary. Units: `сек`, `мин`, `повторений`, `на каждую сторону`.

---

## 11. Things to Avoid

- **AMRAP.** No "max reps in N minutes" prescriptions — no active timer or rep counter exists in MVP.
- **Superset groups with 1 or 3+ members.** The session degrades gracefully, but the "суперсет" label never appears and a server warning fires on every session load.
- **Full embed URLs in the DB.** Only store the Kinescope video ID.
- **Non-Russian video providers.** YouTube and Vimeo are blocked in Russia.
- **Inactive exercises mid-sequence.** They produce invisible ordering gaps and confuse the slide counter.
- **Motivational or corporate copy.** "Раздави свои цели" is not the voice of BFG.
- **Reusing a `superset_group_id` UUID across different workouts.** Harmless to correctness but makes auditing the DB confusing.
- **Unnecessarily bloated workouts.** Duration should match the training goal and the intended audience — not padded to hit a number.

---

## 12. Examples

### Example A — Strength workout with one superset pair

```
workouts row:
  title:        "Нижняя часть тела"
  difficulty:   medium
  duration_min: 28
  category:     strength
  display_order: 2
  is_active:    true

workout_exercises rows (order_index ASC):
  1 | Приседания              | duration_sec: 60  | superset_group_id: null
  2 | Выпады (правая нога)    | duration_sec: 45  | superset_group_id: <UUID-A>
  3 | Выпады (левая нога)     | duration_sec: 45  | superset_group_id: <UUID-A>
  4 | Ягодичный мостик        | duration_sec: 50  | superset_group_id: null
  5 | Планка                  | duration_sec: 40  | superset_group_id: null
```

Exercises 2 and 3 form a valid superset pair (consecutive, same UUID). All other exercises render as normal slides.

---

### Example B — Reps-range exercise with pacing `duration_sec`

```
workout_exercises row:
  title:       "Отжимания"
  description: "10–12 повторений. Держи корпус ровным, не разводи локти."
  duration_sec: 55
  video_provider: kinescope
  video_id:    AaBbCcDdEeF
```

The slide shows "55 сек" as the duration label. The reps target lives in the description.

---

### Example C — Exercise without video

```
workout_exercises row:
  title:        "Растяжка квадрицепса"
  description:  "30 секунд на каждую ногу. Держись за стену если нужно."
  duration_sec: 60
  video_provider: none
  video_id:     null
```

Session renders the `VideoBackdrop` placeholder. No error, no missing-video indicator.
