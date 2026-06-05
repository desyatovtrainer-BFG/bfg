# BFG Database

Source-of-truth document for the BFG database schema, RLS strategy, and migration discipline.
The database is the **only place we trust** for user state. Frontend and client code are never authoritative. See [`BFG_SECURITY.md`](./BFG_SECURITY.md).

> Companion documents:
> [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) ·
> [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) ·
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md)

---

## 1. Principles

- **Postgres is the source of truth.** Every progression value lives here, not in the client.
- **RLS everywhere.** Every table in `public` has `enable row level security` and explicit policies. No exceptions.
- **Least privilege.** Anonymous role has no access by default. Authenticated role gets only what is necessary, narrowed by `auth.uid()`.
- **Migrations are append-only.** Never rewrite a merged SQL file. Always add a new numbered migration.
- **Idempotent migrations.** Use `if not exists`, `do $$ ... $$`, and `on conflict do nothing` so that re-running is safe.
- **No service-role from app.** Client and Next.js server use anon key + user JWT. Service role only inside Edge Functions.

---

## 2. Migration discipline

Location: `supabase/migrations/`. Naming: `NNNN_short_snake_case.sql`. Numbers are monotonically increasing.

Each migration file must:

- start with a short comment block explaining **what it adds, why, what it deliberately does not do**;
- be idempotent (`if not exists`, `drop policy if exists` + `create policy`, `do $$ ... $$` guards);
- include RLS enable + policies in the same migration that creates a table;
- be applied **manually** via the Supabase SQL Editor on the project until we add CI-driven migrations. Document the apply step in the PR description.

A migration must NOT:

- be edited after merge — add a new one instead;
- drop columns / tables in production without a multi-step plan (see §11);
- contain seed data that conflicts with manually edited content (use `on conflict do nothing`).

---

## 3. Tables (current)

The numbers below match `supabase/migrations/*.sql` and reflect the live schema.

### 3.1 `auth.users`
Managed by Supabase Auth. We do not extend it. We extend `public.profiles` instead.

### 3.2 `public.profiles`
Per-user state. `id` = `auth.users.id`.

| Column                    | Type        | Notes                                          |
| ------------------------- | ----------- | ---------------------------------------------- |
| `id`                      | `uuid` PK   | FK to `auth.users.id`                          |
| `xp`                      | `integer`   | Total XP. Server-only writes.                  |
| `level`                   | `integer`   | Derived from XP via `calculateLevel`.          |
| `streak`                  | `integer`   | Consecutive active days.                       |
| `title`                   | `text`      | Display label set at profile creation. Default: `'Начало пути'`. |
| `last_active_on`          | `date`      | Last day that "counted" toward streak.         |
| `subscription_status`     | `text`      | `free_trial` \| `active` \| `expired`          |
| `trial_started_at`        | `timestamptz` | Set at profile creation; drives trial expiry. |
| `subscription_expires_at` | `timestamptz` | Set by payment provider when `status=active`. |

RLS:
- `select` own profile.
- `update` own profile (limited columns — see [`BFG_SECURITY.md`](./BFG_SECURITY.md) on column-level protection plans).
- No `insert` from the client — profile is bootstrapped via `ensureBfgProfile` server-side.
- No `delete`.

Migrations: `0000_initial_schema.sql`, `0002_profile_last_active.sql`, `0003_subscription.sql`.

### 3.3 `public.avatars`
Per-user avatar visual state.

| Column            | Type      | Notes                                  |
| ----------------- | --------- | -------------------------------------- |
| `id`              | `uuid` PK | FK to `auth.users.id` (1:1 with user)  |
| `evolution_stage` | `integer` | Stage index derived from `level`.      |
| `form`            | `text`    | Form identifier (`spark`, `flame`, ...) |
| `aura`            | `text`    | Aura identifier.                       |
| `glow_intensity`  | `integer` | 0–100, drives shader-ish glow.         |

RLS: `select` and `update` own row only. Server (under user session) writes via `awardXp` when the level crosses an evolution threshold.

Migration: `0000_initial_schema.sql`.

### 3.4 `public.daily_quest_completions`
One row per (`user`, `quest_id`, `date`). Idempotent by unique constraint.

| Column          | Type      | Notes                                    |
| --------------- | --------- | ---------------------------------------- |
| `id`            | `uuid` PK | `default gen_random_uuid()`              |
| `user_id`       | `uuid`    | FK to `auth.users.id`, on delete cascade |
| `quest_id`      | `text`    | Quest identifier from `lib/quests`       |
| `completed_on`  | `date`    | `default current_date`                   |
| `xp_awarded`    | `integer` | Snapshot of XP given (server-side)       |
| `xp_before`     | `integer` | `profiles.xp` at insert time; used for XP recovery if `awardXp` fails after INSERT succeeds |
| `created_at`    | `timestamptz` | `default now()`                       |
| unique          | (`user_id`, `quest_id`, `completed_on`) | guards double-claim     |

RLS:
- `select` own.
- `insert` own (with `with check (auth.uid() = user_id)`).
- No `update` / `delete` from the client.

Migrations: `0001_daily_quest_completions.sql`, `0009_completion_xp_before.sql`.

### 3.5 `public.workouts`
Workout catalog. Public read for authenticated users; writes are admin-only via service role.

| Column            | Type        | Notes                                              |
| ----------------- | ----------- | -------------------------------------------------- |
| `id`              | `text` PK   | kebab-case slug, drives URLs `/workouts/<id>`      |
| `title`           | `text`      |                                                    |
| `description`     | `text`      |                                                    |
| `difficulty`      | `text`      | `easy` \| `medium` \| `hard` (CHECK)               |
| `duration_min`    | `integer`   | > 0 (CHECK)                                        |
| `category`        | `text`      | Free tag                                           |
| `thumbnail_url`   | `text`      | Optional                                           |
| `video_provider`  | `text`      | `none` \| `kinescope` (CHECK)                      |
| `video_id`        | `text`      | Provider-native id, no embed URL stored            |
| `is_active`       | `boolean`   | Draft flag for the catalog                         |
| `created_at`      | `timestamptz` | `default now()`                                 |

RLS:
- `select` only `is_active = true` for role `authenticated`.
- No client `insert`/`update`/`delete` policies — content is managed via the Supabase Table Editor with the service role. See `WORKOUT_CONTENT_GUIDE.md`.

Migration: `0004_workouts.sql`.

### 3.6 `public.workout_exercises`
Steps inside a workout. Provides the per-exercise video, ordering, and text.

| Column          | Type      | Notes                                          |
| --------------- | --------- | ---------------------------------------------- |
| `id`            | `uuid` PK | `default gen_random_uuid()`                    |
| `workout_id`    | `text`    | FK to `workouts.id`, on delete cascade         |
| `order_index`   | `integer` | >= 0 (CHECK), unique per `workout_id`          |
| `title`         | `text`    |                                                |
| `description`   | `text`    | `default ''`                                   |
| `duration_sec`  | `integer` | > 0 (CHECK)                                    |
| `video_provider`| `text`    | `none` \| `kinescope` (CHECK)                  |
| `video_id`      | `text`    | Provider-native id                             |
| `is_active`     | `boolean` | Allows hiding a single step without deleting   |
| `created_at`    | `timestamptz` | `default now()`                            |

RLS:
- `select` only `is_active = true` for role `authenticated`.
- No client mutation.

Migration: `0005_workout_exercises.sql`.

### 3.7 `public.workout_completions`
Idempotency guard for workout completion. One row per (`user`, `workout`, `date`). Prevents double XP on double-click, tab race, or request replay. Modelled after `daily_quest_completions` (§3.4).

**Note:** this is not the full append-only analytics log originally planned in the roadmap. It is a narrow write-guard. A future audit log may supersede or extend it.

| Column          | Type          | Notes                                          |
| --------------- | ------------- | ---------------------------------------------- |
| `id`            | `uuid` PK     | `default gen_random_uuid()`                    |
| `user_id`       | `uuid`        | FK to `auth.users.id`, on delete cascade       |
| `workout_id`    | `text`        | FK to `workouts.id`, on delete cascade         |
| `completed_on`  | `date`        | `default current_date`                         |
| `xp_awarded`    | `integer`     | Snapshot of XP granted (server-side)           |
| `xp_before`     | `integer`     | `profiles.xp` at insert time; used for XP recovery if `awardXp` fails after INSERT succeeds |
| `created_at`    | `timestamptz` | `default now()`                                |
| unique          | (`user_id`, `workout_id`, `completed_on`) | guards double-completion      |

RLS:
- `select` own.
- `insert` own (with `with check (auth.uid() = user_id)`).
- No `update` / `delete` from the client.

Migrations: `0006_workout_completions.sql`, `0009_completion_xp_before.sql`.

---

## 4. RLS strategy

### 4.1 Default deny

Every table in `public` is created with `enable row level security`. The Postgres default once RLS is enabled is **deny**. Policies are added explicitly per operation (`select`, `insert`, `update`, `delete`).

### 4.2 Auth check pattern

For user-owned tables (`profiles`, `avatars`, `daily_quest_completions`, future `xp_events`, future `companion_messages`):

```sql
create policy "select own X" on public.X
  for select using (auth.uid() = user_id);

create policy "insert own X" on public.X
  for insert with check (auth.uid() = user_id);

create policy "update own X" on public.X
  for update using (auth.uid() = user_id);
```

For shared read-only content (`workouts`, `workout_exercises`):

```sql
create policy "authenticated can read active X" on public.X
  for select to authenticated using (is_active = true);
```

### 4.3 Server Actions never bypass RLS

Server Actions use the **SSR Supabase client** bound to the user's cookie. They run under the same `auth.uid()` as the user. They cannot do more than the policies allow — by design.

Privileged writes (e.g. backfilling XP from history, payment webhook updates) go through **Edge Functions** with the service role key. See [`BFG_SECURITY.md`](./BFG_SECURITY.md).

### 4.4 Validating RLS in PRs

When a PR touches a table or adds one, the reviewer must verify:

- RLS is enabled,
- `select` / `insert` / `update` / `delete` are each either explicitly allowed with `auth.uid()` or intentionally absent,
- No policy uses raw user-supplied data without `auth.uid()` correlation,
- No service-role-only operations leaked into a Server Action.

---

## 5. Identifier conventions

- User-owned tables: `id uuid primary key default gen_random_uuid()` and a separate `user_id uuid not null references auth.users(id) on delete cascade`.
- 1:1-with-user tables (e.g. `avatars`, `profiles`): `id uuid primary key references auth.users(id) on delete cascade`. Avoid a separate `user_id` for 1:1.
- Catalog tables (`workouts`): human-readable `text` slug as PK. Slugs never change after publication — they appear in URLs.
- Slugs: lower kebab-case (`morning-flow`). ASCII only.

---

## 6. Time and dates

- Timestamps: `timestamptz`, default `now()`.
- Dates that represent "the day in user-time" (streak, daily quest completions) use `date`. We currently treat them as the server day; if regional behaviour becomes a problem, add an explicit timezone column on `profiles`.
- Never store epoch ints in new tables. Use `timestamptz`.

---

## 7. Server-side derived values

Some columns are derived from other columns. They are persisted because we need to query against them and because re-derivation on every read is wasteful.

| Persisted column              | Derived from                        | Computed in                          |
| ----------------------------- | ----------------------------------- | ------------------------------------ |
| `profiles.level`              | `profiles.xp`                       | `lib/progression/levels.ts` + `awardXp` |
| `avatars.evolution_stage`     | `profiles.level`                    | `awardXp` when a level threshold is crossed |
| `profiles.streak`             | `last_active_on` + today            | `lib/progression/streak.ts`          |
| `profiles.last_active_on`     | server "now()" on qualifying events | `awardXp` / streak helper            |

Rule: a derived column is only ever written by **server code**. Never expose a Server Action that lets the client set it directly.

---

## 8. Subscription model

- Three states: `free_trial`, `active`, `expired`.
- Trial: 30 days from `trial_started_at`. Computed on read via `lib/subscription/state.ts`, **not** by a cron job that mutates the row.
- Active: `subscription_expires_at` must be > now. Set by the payment provider (future) via an Edge Function with service-role privileges.
- Provider-agnostic by design: no provider IDs on `profiles`. When we integrate ЮKassa / Tinkoff / CloudPayments / ЮMoney, the provider table will be separate (`public.subscription_payments`) and reference `profiles.id`.

---

## 9. Backups and recovery

- Supabase project provides automatic daily backups on the paid plan.
- Before any destructive migration (drop column, rename, type change): take a manual snapshot via Supabase Dashboard → Database → Backups.
- Recovery rehearsals: at least once per quarter, restore a staging project from a recent backup. Document the run in `docs/BFG_ROADMAP.md` operational milestones.

---

## 10. Tables we intentionally do NOT have yet (MVP)

Reasoning is in [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md). These are reserved names so we keep them consistent when added.

- `public.xp_events` — append-only log of XP grants. Needed for anti-cheat + recomputation. To be added before public launch.
- `public.companion_messages` — log of companion phrases shown to the user. Needed for memory + tone consistency.
- `public.subscription_payments` — provider-specific payment records.
- `public.cosmetic_inventory` — owned cosmetics per user (currently catalog-only).
- `public.user_flags` — feature flags / device flags per user.

When you introduce one of these, follow §3 documentation pattern.

---

## 11. Destructive change protocol

To drop a column or table that is in use:

1. Add a migration that **stops writing** to the column. Ship it.
2. Wait at least one release cycle.
3. Add a migration that **stops reading** from the column. Ship it.
4. Add a final migration that drops the column. Verify backup. Apply.

For renames: prefer add-new + dual-write + cutover + drop-old over `alter table rename`.

---

## 12. Database review checklist

For any PR that touches `supabase/migrations/`:

- [ ] New file is numbered and named in `snake_case`.
- [ ] First comment block describes intent, non-goals, and apply instructions.
- [ ] All new tables have `enable row level security` + policies for every required operation.
- [ ] CHECK constraints cover documented value sets (`difficulty`, `subscription_status`, `video_provider`).
- [ ] Indexes added for any column used in `where` or `order by` of a hot query.
- [ ] No `service_role` usage in app code paths.
- [ ] Idempotent on re-run.
- [ ] If destructive: follows §11.
