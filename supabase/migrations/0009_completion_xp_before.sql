-- BFG: XP-before snapshot for atomic completion recovery.
--
-- Adds xp_before to workout_completions and daily_quest_completions.
--
-- Problem it solves: the two-step completion flow (INSERT guard → awardXp)
-- is non-atomic. If awardXp fails after the INSERT succeeds, the completion
-- record blocks future retries (23505), permanently losing the user's XP.
--
-- Fix: Server Actions now record profiles.xp at INSERT time as xp_before.
-- On a 23505 retry, the action compares the stored xp_before + xp_awarded
-- against the current profiles.xp to determine whether XP was applied:
--
--   current_xp >= xp_before + xp_awarded  →  XP was applied  →  alreadyCompleted
--   current_xp <  xp_before + xp_awarded  →  XP was NOT applied  →  recover now
--
-- default 0 is safe for existing rows: any user with profiles.xp > 0
-- satisfies current_xp >= 0 + xp_awarded, correctly treating old
-- completion records as already-awarded. See lib/workouts/actions.ts and
-- lib/quests/actions.ts for the recovery logic.
--
-- No RLS changes. The existing INSERT policies on both tables automatically
-- cover the new column. No UPDATE or DELETE policies are introduced.
--
-- Idempotent. Apply manually via Supabase SQL Editor.

alter table public.workout_completions
  add column if not exists xp_before integer not null default 0;

alter table public.daily_quest_completions
  add column if not exists xp_before integer not null default 0;
