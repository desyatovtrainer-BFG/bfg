-- BFG: editorial ordering for the workout catalog.
--
-- Adds display_order to workouts so content editors can control catalog
-- sequence independently of created_at. All existing rows default to 0;
-- ties fall back to created_at ASC (see listActiveWorkouts in queries.ts),
-- so the visible order is unchanged until display_order values are set
-- explicitly via the Supabase Table Editor.
--
-- No RLS changes — the existing "authenticated can read active workouts"
-- policy covers this column automatically.
--
-- Idempotent. Apply manually via Supabase SQL Editor.

alter table public.workouts
  add column if not exists display_order integer not null default 0;

create index if not exists workouts_display_order_idx
  on public.workouts (display_order, created_at);
