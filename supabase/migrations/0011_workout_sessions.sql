-- 0011_workout_sessions.sql
--
-- What:
--   Adds public.workout_sessions — persistent workout in-progress state.
--   One row per started workout session; status 'active' means the workout
--   is In Progress right now.
--
-- Which decisions this supports:
--   • D049 — Workout Start boundary: a session row is created only when the
--     user presses «Начать тренировку»; viewing a workout never writes here.
--   • D050 — Workout Completion boundary: finishing closes the session
--     (status='completed', finished_at) after the existing completion action
--     has run; XP/streak logic is untouched by this migration.
--   • D057 — In Progress has absolute priority over Upcoming on Activity.
--   • D058 — One active workout only: enforced STRUCTURALLY by the partial
--     unique index workout_sessions_one_active. A concurrent double-start
--     (two tabs, replayed request) hits 23505 and the server action resolves
--     it as "resume the existing active session", never a second session.
--   • D040 — started_at / finished_at are the automatic timestamps of the
--     tracking model (duration is intentionally imperfect and never affects
--     XP, levels, streak, achievements, or rewards).
--
-- What it deliberately does NOT implement:
--   • No abandon/cancel logic — D058 introduces no cancellation system.
--     The 'abandoned' status value is RESERVED ONLY (future ops/admin use);
--     no code path sets it.
--   • No expiration, no automatic session recovery, no cleanup jobs (D059).
--   • No analytics, no per-step tracking, no weight fields (D060 §6: tracking
--     never attaches to Steps), no delete policy (rows are history).
--
-- Apply:
--   Run this file manually in the Supabase SQL Editor BEFORE deploying any
--   application code that reads/writes workout_sessions (Slice 7B Phase 2+).
--   If code deploys first, startWorkoutAction will fail until this runs.
--
-- Idempotent: create table/index "if not exists", drop policy + create policy.

create table if not exists public.workout_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  workout_id  text not null references public.workouts(id) on delete cascade,
  status      text not null default 'active'
              check (status in ('active', 'completed', 'abandoned')),
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  created_at  timestamptz not null default now()
);

-- D058: максимум одна активная тренировка на пользователя — структурно.
create unique index if not exists workout_sessions_one_active
  on public.workout_sessions (user_id)
  where (status = 'active');

-- Горячий поиск активной сессии пользователя.
create index if not exists workout_sessions_user_status
  on public.workout_sessions (user_id, status);

alter table public.workout_sessions enable row level security;

-- Чтение только своих сессий.
drop policy if exists "select own workout sessions" on public.workout_sessions;
create policy "select own workout sessions" on public.workout_sessions
  for select using (auth.uid() = user_id);

-- Создание только своей АКТИВНОЙ сессии (граница старта, D049):
-- завершённые/брошенные строки никогда не вставляются напрямую.
drop policy if exists "insert own active workout session" on public.workout_sessions;
create policy "insert own active workout session" on public.workout_sessions
  for insert with check (auth.uid() = user_id and status = 'active');

-- Обновление только своих сессий (закрытие: status/finished_at).
drop policy if exists "update own workout sessions" on public.workout_sessions;
create policy "update own workout sessions" on public.workout_sessions
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Delete-политики нет намеренно: сессии — история, клиент их не удаляет.
