# BFG Game Systems

The mechanical contract of the BFG progression loop: XP, levels, streaks, avatar evolution, daily quests, workouts, cosmetics, and subscription gating. This document is for engineering — emotional design lives in `BFG_CONTEXT.md` and the legacy `PROGRESSION_SYSTEM.md` / `AVATAR_SYSTEM.md` / `COMPANION_SYSTEM.md`.

> Companion documents:
> [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md) ·
> [`BFG_DATABASE.md`](./BFG_DATABASE.md) ·
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md)

---

## 1. Core loop

```
Open BFG  →  See path (companion + avatar + streak)
        ↓
   Daily quests / Workout
        ↓
   Server awards XP + touches streak
        ↓
   Level up (rare, calm) → Avatar evolves (rare, emotional)
        ↓
   Companion reflects the moment
        ↓
   Return tomorrow
```

Every system below feeds this loop. If a proposed feature does not feed the loop, it is out of MVP scope.

---

## 2. XP system

### 2.1 Source of truth

`profiles.xp` (`integer`). Server-only writes through `lib/progression/award-xp.ts → awardXp`.

### 2.2 Reward sources

Defined in `lib/progression/xp-rewards.ts`. Numbers are small and round on purpose — see [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) §"no XP inflation".

| Source              | XP   | Triggered by                                  |
| ------------------- | ---- | --------------------------------------------- |
| `WORKOUT_COMPLETE`  | 100  | Finishing a workout session                   |
| `DAILY_QUEST`       |  50  | Claiming a daily quest completion             |
| `DAILY_LOGIN`       |  20  | First login of the day (daily reward)         |
| `STREAK_BONUS`      |  50  | When `touchStreak` increases the streak       |
| `MILESTONE`         |  75  | Emotional milestones (first workout, return)  |

### 2.3 Rules

- **Server-only.** No client computes or proposes an XP amount the server accepts as-is. The action either passes a known `source` (typed `XpRewardSource`) or a server-guarded raw `amount` from a closed list. No "freeform" XP from the client.
- **Idempotent at the action level.** Each action that grants XP must defend against double-clicks (unique constraints, server checks).
- **No negative XP** in MVP. Loss of progress is not part of the design.
- **Always re-derive `level`** in the same transaction-ish flow (see `awardXp`). The two columns must not drift.
- **Audit log** (`xp_events`) is on the post-MVP roadmap (see [`BFG_DATABASE.md`](./BFG_DATABASE.md) §10). Once introduced, every XP grant writes to it.

---

## 3. Level system

### 3.1 Curve

Pure helpers in `lib/progression/levels.ts`. Curve is intentionally gentle then linearly steeper. No exponentials.

- `xpRequiredForLevel(level)`: `100 * (n - 1) + 25 * (n - 1) * (n - 2)` where `n = level - 1`.
- Level 1 → 2: 100 XP. Level 2 → 3: 150 XP. Level 3 → 4: 200 XP. Etc.

### 3.2 Rules

- `calculateLevel(totalXp)` is the only function allowed to derive a level. Don't roll your own.
- `getLevelProgress(totalXp)` is the only function the UI should call for the progress bar. It returns `{ level, xpIntoLevel, xpForNextLevel, progress 0..1 }`.
- Level up effects are **calm and brief** (see [`BFG_UI_RULES.md`](./BFG_UI_RULES.md)). No casino animations.

---

## 4. Streak system

### 4.1 Source of truth

`profiles.streak` (`integer`) + `profiles.last_active_on` (`date`). Logic in `lib/progression/streak.ts → touchStreak`.

### 4.2 Rules

- A "counting" action is workout completion or daily quest completion. Daily login alone does **not** advance the streak (it grants a daily login XP only).
- `touchStreak` is **idempotent per day**: a second qualifying action the same day does not increase the streak.
- Gaps cause a soft restart (streak = 1). **No shame, no negative bonus, no break protection** in MVP. Returning is always safe.
- Streak is computed in UTC (`todayUtcISO`). If users complain about timezone drift, add a `profiles.timezone` column and switch — but only then.
- `STREAK_BONUS` XP is granted only when the streak **increases** (not on restart).

---

## 5. Avatar evolution

### 5.1 Source of truth

`avatars` row (per user, 1:1 with `auth.users`). Fields: `evolution_stage`, `form`, `aura`, `glow_intensity`.

### 5.2 Ladder

Defined in `lib/progression/avatar-evolution.ts`. Five stages, intentionally short so each transition is felt:

| Stage | Min level | Form           | Aura               | Glow |
| ----- | --------- | -------------- | ------------------ | ---- |
| 1     | 1         | `starter`      | `soft_glow`        | 1    |
| 2     | 5         | `awakened`     | `focused_glow`     | 2    |
| 3     | 10        | `attuned`      | `radiant_glow`     | 3    |
| 4     | 20        | `ascendant`    | `prismatic_glow`   | 4    |
| 5     | 35        | `transcendent` | `stellar_glow`     | 5    |

### 5.3 Rules

- Evolution is a **pure function of level**. No separate currency, no manual unlock.
- `hasEvolved(previousLevel, newLevel)` decides whether the `avatars` row needs an update — only on stage crossing.
- The XP award path (`awardXp`) is the only writer of `avatars` evolution fields. If the cosmetic write fails, XP still commits and the next `awardXp` reconciles.
- Visual is a **layered 2D system** (see legacy `AVATAR_SYSTEM.md`). No 3D in MVP, no Unity, no realtime rendering pipeline.
- Forms / auras are **string identifiers** in DB. Labels live in code (`getAvatarFormLabel`, `getAvatarAuraLabel`). Do not duplicate Russian labels in the DB.

---

## 6. Daily quests

### 6.1 Source of truth

Catalog defined in code (`lib/quests/daily-quests.ts`). Completions persisted to `public.daily_quest_completions`.

### 6.2 Rules

- One quest may be claimed at most once per `(user, quest_id, day)`. Enforced by a unique index.
- Quest XP is granted server-side via `awardXp` with `source: 'DAILY_QUEST'`. Client never specifies the amount.
- Quest catalog is **content** but lives in code on MVP. When it becomes user-editable, it moves to its own table (see [`BFG_DATABASE.md`](./BFG_DATABASE.md) §10).
- Reset is **per local UTC day** — there is no manual reset endpoint. The next day, the row simply does not exist yet.
- A failed claim must show a calm Russian message and never reveal Supabase error text.

---

## 7. Workouts

### 7.1 Source of truth

`public.workouts` (catalog) + `public.workout_exercises` (steps). Content is managed via Supabase Table Editor; rules are in `WORKOUT_CONTENT_GUIDE.md`.

### 7.2 Rules

- Workout difficulty is one of `easy | medium | hard`. No other values, ever — enforced by `CHECK`.
- Video provider on MVP is `none` or `kinescope`. Anything else breaks the Russia constraint. See [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) §10.
- Embed URLs are **composed in code** from `video_provider + video_id`. Never store full embed URLs in the DB.
- The session screen renders `workout_exercises`, in `order_index` ASC. `workouts.video_*` fields are kept for compatibility but unused.
- Exercise prescriptions are **time-based** (`duration_sec`) or **reps-based** (reps expressed as ranges such as "10–12", "15–20"). For reps-based exercises, `duration_sec` can still hold the estimated completion time for session pacing and UI flow. Circuit workouts are allowed; "circuit" describes order/structure, not a time-pressure mode.
- **No AMRAP in the near architecture.** "Do as much as possible in N minutes" requires active timers, rep counters, and score tracking that are out of MVP scope. Use fixed time, a time range, or a reps range instead.
- On completion: a Server Action (`lib/workouts/actions.ts`) grants `WORKOUT_COMPLETE` XP, touches streak, and optionally produces a companion reaction (see [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md)).
- Future: `public.workout_completions` log replaces ad-hoc completion handling. Until then, double-completion is prevented at the Server Action layer.

---

## 8. Cosmetics

### 8.1 Source of truth

Catalog in `lib/cosmetics/catalog.ts`. Per-user inventory is **catalog-only on MVP** (every user "owns" what their level / progression unlocks). Real ownership table (`cosmetic_inventory`) is post-MVP.

### 8.2 Rules

- Cosmetics never give a gameplay advantage. No pay-to-win, ever. This is a product invariant.
- Unlock conditions are deterministic from progression state (level, milestones).
- Paid cosmetics expand personalization, never accelerate progression.

---

## 9. Subscription gating

### 9.1 States

`free_trial` (30 days) → `active` → `expired`. Computed by `lib/subscription/state.ts → computeSubscriptionState`. See [`BFG_DATABASE.md`](./BFG_DATABASE.md) §8.

### 9.2 Access rules

- Anything **emotional and core** (companion presence, daily quests, basic workouts, avatar, streak) is **never** gated in MVP. We are not building churn on top of an unfinished loop.
- Premium gating attaches only to optional/expansion features (additional content, deeper cosmetics, advanced quests) — to be decided per release in [`BFG_ROADMAP.md`](./BFG_ROADMAP.md).
- Access check helper: `lib/subscription/access.ts`. All gating goes through it.
- Trial expiry does **not** delete progression. The user keeps their level, streak, and avatar.

---

## 10. Companion as a system

Detailed in [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md). From the systems point of view:

- Inputs: `streak`, last activity, level change, evolution, time of day, recent emotional events.
- Outputs: a short, calm Russian phrase, optionally with a state tag.
- The companion **does not award XP**. It reacts to state changes. It is read-only with respect to progression.

---

## 11. Determinism and reproducibility

A user's full state must be reproducible from server-side data. This means:

- Level reproducible from XP (pure function).
- Avatar reproducible from level (pure function).
- Subscription state reproducible from `profiles.subscription_*` + now (pure function).
- Streak reproducible from `last_active_on` + the rule in §4. A future `xp_events` log will make full reproducibility of XP history possible too.

If a reproduction reveals drift, the server is correct. Reconciliation jobs (post-MVP) prefer recompute from log over trust of denormalised columns.

---

## 12. Anti-cheat philosophy (overview)

Full rules in [`BFG_SECURITY.md`](./BFG_SECURITY.md) §"progression/XP protection". Short version:

- Frontend submits **intent** (e.g. "I claim daily quest X"). Server decides **truth** (looks up the quest, computes XP, enforces idempotency).
- No client-supplied XP amounts. Only typed `XpRewardSource`.
- No client-supplied user IDs. Always `auth.uid()` server-side.
- Rate-limit suspicious sources at the Edge Function when introduced.

---

## 13. Future systems (not in MVP)

Tracked here so we don't accidentally reinvent them.

- `xp_events` log + recomputation job.
- Skill tree or stat system (intentionally rejected — see legacy `PROGRESSION_SYSTEM.md`).
- PvP / leaderboards (rejected for emotional safety).
- Streak freeze / break protection.
- Multi-companion or companion progression.
- Avatar customization economy (cosmetics inventory + paid pieces).
- Quest chains.
- Exercise detection / pose validation.
