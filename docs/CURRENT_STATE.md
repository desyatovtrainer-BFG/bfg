# CURRENT_STATE

What actually exists in the BFG codebase today (as of 2026-06-05).
This document reflects reality, not intent. Verify against code when precision matters.

---

## Architecture decisions in force

- **Next.js 16 App Router**, Server Components by default, `'use client'` opt-in.
- **Supabase** for DB (Postgres), Auth (email/password), and RLS. No service-role key outside Edge Functions.
- **Feature-oriented layout**: `lib/<feature>/` for domain logic, `app/components/<feature>/` for UI.
- **Tailwind v4** for all styling. No CSS-in-JS. No global CSS beyond `app/globals.css`.
- **Framer Motion** for all animation.
- **Kinescope** for video (Russia constraint — no YouTube/Vimeo).
- **Avatar = Body, Companion = Voice** — one unified presence entity. Both roles feed from the same progression state.
- No TanStack Query or Zustand in `package.json` yet — both are mandated when needed, not pre-installed.
- No Edge Functions deployed yet — all logic runs in Server Actions under user-session RLS.

---

## Implemented systems

### Auth and profile
- Email/password sign-up and sign-in (`app/login/`, `app/signup/`, `lib/auth/`).
- Session refresh via `proxy.ts` (Next.js 16 proxy pattern).
- `ensureBfgProfile` bootstraps `public.profiles` and `public.avatars` on first login (`lib/profile/`).
- `getUser()` in `lib/auth/get-user.ts` is the single server-side identity function.

### Progression
- `awardXp` in `lib/progression/award-xp.ts` — single path for all XP writes. Updates `profiles.xp`, recomputes `profiles.level`, triggers avatar evolution if threshold crossed.
- `calculateLevel` / `getLevelProgress` in `lib/progression/levels.ts` — pure functions, source of truth for level derivation.
- `touchStreak` in `lib/progression/streak.ts` — idempotent per-day streak update.
- `getAvatarEvolutionForLevel` / `hasEvolved` in `lib/progression/avatar-evolution.ts` — 5-stage ladder keyed on level.
- XP reward sources defined in `lib/progression/xp-rewards.ts`. Active: `WORKOUT_COMPLETE`, `DAILY_QUEST`. `STREAK_BONUS` and `DAILY_LOGIN` are dead constants pending cleanup (streaks never grant XP — milestones trigger presence feedback only; daily login reward removed from MVP). `MILESTONE` is defined but not wired to any action.

### Daily quests
- Quest catalog defined in code at `lib/quests/daily-quests.ts`.
- `claimDailyQuestAction` in `lib/quests/actions.ts` — inserts into `daily_quest_completions` (unique per `user_id + quest_id + completed_on`), awards XP, touches streak, returns companion feedback.
- Quest completion screen at `app/(app)/quests/` with `app/components/daily-quests/`.
- `xp_before` column on `daily_quest_completions` supports XP recovery if the two-step flow fails (migration 0009).

### Workouts
- Workout catalog and exercise steps stored in `public.workouts` + `public.workout_exercises`.
- `listWorkouts` / `getWorkout` / `listWorkoutExercises` in `lib/workouts/queries.ts`.
- Session screen at `app/(app)/workouts/[id]/` — renders per-exercise slides with Kinescope embeds, superset support.
- `completeWorkoutAction` in `lib/workouts/actions.ts` — idempotent via `workout_completions` unique constraint, awards XP, touches streak, returns companion feedback.
- `workout_completions` table exists (migration 0006) with `xp_before` for recovery (migration 0009).
- Superset validation in `lib/workouts/superset.ts`.

### Companion
- `buildCompanionMessage` in `lib/companion/build-companion-message.ts` — deterministic, 5-state, daily-stable phrase engine. No external API call required.
- Companion states: `first_step`, `present_today`, `in_streak`, `soft_return`, `warm_return`.
- `buildCompanionFeedback` in `lib/workouts/companion-feedback.ts` — contextual reaction shown post-workout and post-quest.
- Companion page at `app/(app)/companion/` with `app/components/companion/companion-screen.tsx`.
- Companion feedback shown after quest and workout completion (overlay component).

### Avatar
- Avatar entity at `app/(app)/avatar/` with `app/components/avatar/avatar-hero.tsx`.
- Stage-colored SVG silhouette on dashboard (`HeroAvatar` component, 5 color schemes keyed on `evolution_stage`).
- Cosmetic reward previews via `app/components/avatar/cosmetic-rewards.tsx` (catalog-only, no inventory table).
- `lib/cosmetics/` — catalog and unlock derivation from progression state.

### Subscription
- `computeSubscriptionState` in `lib/subscription/state.ts` — pure function, three states: `free_trial` | `active` | `expired`.
- 30-day trial from `profiles.trial_started_at`. No payment provider integrated yet (by design, M3).
- `checkAccess` in `lib/subscription/access.ts` — gating helper. Core loop is never gated.

### UI
All primary screens are present:
- `/` — onboarding landing screen (static marketing page, not a guided flow).
- `/dashboard` — dashboard with avatar hero, companion message, quest summary, streak, level.
- `/workouts` — workout catalog list.
- `/workouts/[id]` — full session screen.
- `/quests` — daily quests screen.
- `/companion` — companion phrase screen.
- `/avatar` — avatar body screen.
- `/progress` — XP bar, streak panel, evolution block.
- `/profile` — subscription state.
- `/login`, `/signup` — auth screens.

### Database (migrations applied)

| Migration | What it adds |
|-----------|-------------|
| `0000_initial_schema.sql` | `profiles`, `avatars` |
| `0001_daily_quest_completions.sql` | `daily_quest_completions` with unique idempotency |
| `0002_profile_last_active.sql` | `profiles.last_active_on` |
| `0003_subscription.sql` | Subscription columns on `profiles` |
| `0004_workouts.sql` | `workouts` catalog table |
| `0005_workout_exercises.sql` | `workout_exercises` table |
| `0006_workout_completions.sql` | `workout_completions` idempotency table |
| `0007_workout_exercises_superset.sql` | Superset group column on `workout_exercises` |
| `0008_workouts_display_order.sql` | Display order on `workouts` |
| `0009_completion_xp_before.sql` | `xp_before` column on both completion tables |

---

## Partially implemented

| System | What exists | What is missing |
|--------|-------------|----------------|
| Companion coverage | Post-workout and post-quest feedback; companion page | Not yet surfaced on every screen where it adds value (dashboard presence is visual only) |
| Avatar evolution animation | Static stage-colored avatar on dashboard | Subtle visual moment on stage change (< 600ms animation required for M1) |
| Workout session UX | Exercise slides, superset, completion | Calm completion screen design not finalized |
| Content | Tables and schema ready | Need ≥3 workouts with real Kinescope videos; ≥5 daily quests in catalog |
| Onboarding | Static landing screen at `/` | Guided onboarding flow (3–4 steps, M2) not built |
| Infrastructure | Manual migrations via SQL Editor | No staging environment; smoke checklist not yet formalized |

---

## Known technical debt

1. **Two-step completion is non-atomic** — `INSERT guard → awardXp` is not a single Postgres transaction. Migration 0009 added `xp_before` as a recovery mechanism; a proper atomic RPC (Phase 2 of Master Roadmap) is the clean fix.
2. **No TanStack Query yet** — optimistic UI and background refetch will require it when the UX demands it.
3. **No `xp_events` log** — XP history is not auditable; post-M1 (M2 / soft launch).
4. **No `companion_messages` log** — companion phrase history not persisted; post-M1.
5. **Quest catalog hardcoded in `lib/quests/daily-quests.ts`** — fine for MVP; becomes a DB table post-MVP.
6. **Dead XP constants in `lib/progression/xp-rewards.ts`** — `STREAK_BONUS` (product decision 2026-06-09: streaks never grant XP; milestones trigger emotional presence feedback only) and `DAILY_LOGIN` (daily login reward removed from MVP) are unused and pending cleanup. Do not wire them up.

---

## Recently completed work (last ~10 commits)

- Surfaced avatar/companion presence on the dashboard.
- Fixed and simplified daily quest completion flow.
- Showed companion feedback after quest completion.
- Hardened completion XP recovery (migration 0009, `xp_before`).
- Aligned all docs with the "one presence, two roles" (avatar = body / companion = voice) architecture.
- Removed nonfunctional daily reward panel and misleading labels.
- Added companion doctrine foundation doc.
