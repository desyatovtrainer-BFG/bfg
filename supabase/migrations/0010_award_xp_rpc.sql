-- 0010_award_xp_rpc.sql
--
-- What:
--   Adds public.bfg_increment_xp(p_user_id uuid, p_amount integer)
--   → TABLE(new_xp integer, prev_level integer)
--
-- Why:
--   The previous awardXp pattern read profiles.xp into Node, added the amount
--   in JavaScript, then wrote the result back. Two concurrent qualifying actions
--   (double-tap, two browser tabs, a replayed request) could both read the same
--   xp value before either write landed, compute their totals independently, and
--   the last UPDATE would win — silently dropping the first XP grant.
--
--   A single SQL UPDATE is atomic in Postgres: the read and write happen in one
--   operation with no gap for a concurrent transaction to interleave.
--   `SET xp = xp + p_amount` eliminates the race entirely.
--
-- What it does NOT do:
--   • Does not compute or persist profiles.level — calculateLevel stays in
--     TypeScript; awardXp writes the level in a separate step after this call.
--   • Does not touch avatars.
--   • Does not use the service role. security invoker means the function
--     executes under the caller's JWT and the existing profiles UPDATE policy
--     (auth.uid() = id) is the enforcement boundary — exactly as before.
--
-- Apply:
--   Run this file in the Supabase SQL Editor BEFORE deploying the Next.js build
--   that calls rpc('bfg_increment_xp'). If the application code is deployed
--   first, every awardXp call will return an error until this migration runs.
--
-- Idempotent: CREATE OR REPLACE is safe to re-run.

create or replace function public.bfg_increment_xp(
  p_user_id uuid,
  p_amount   integer
)
returns table(new_xp integer, prev_level integer)
language plpgsql
security invoker
as $$
begin
  -- Guard: a zero or negative amount is a programming error, not a user action.
  -- The Node layer in awardXp already validates this, but defence-in-depth means
  -- any future caller — a recompute job, a test script, a direct SQL call — also
  -- gets an explicit error instead of silently decrementing XP.
  if p_amount <= 0 then
    raise exception
      'bfg_increment_xp: p_amount must be a positive integer, got %', p_amount
      using errcode = 'check_violation';
  end if;

  -- Atomic increment.
  --
  -- SET xp = xp + p_amount is evaluated and committed as one Postgres operation.
  -- No concurrent UPDATE on the same profiles row can observe the intermediate
  -- state between the internal read and write that every UPDATE performs.
  --
  -- RETURNING columns:
  --   xp    → new total XP after the increment   (mapped to new_xp).
  --   level → stored level column, untouched by this UPDATE, so it reflects
  --           the level *before* Node recalculates it (mapped to prev_level).
  --           awardXp uses this as previousLevel for level-up detection.
  return query
    update public.profiles
       set xp = xp + p_amount
     where id = p_user_id
    returning
      xp    as new_xp,
      level as prev_level;
end;
$$;

-- Restrict execution to authenticated users.
-- anon role is intentionally excluded: even if it called this function,
-- security invoker + the profiles UPDATE policy (auth.uid() = id) would
-- match zero rows for an unauthenticated session, but making the intent
-- explicit here is cleaner.
revoke execute on function public.bfg_increment_xp(uuid, integer) from public, anon;
grant  execute on function public.bfg_increment_xp(uuid, integer) to   authenticated;
