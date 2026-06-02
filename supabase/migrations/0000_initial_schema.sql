-- BFG MVP: base schema for public.profiles and public.avatars.
--
-- Both tables were created in the live Supabase project before this
-- repository's migration discipline was established. Every subsequent
-- ALTER TABLE migration (0002, 0003) assumed they already existed.
-- This file captures the verified live schema so that a fresh Supabase
-- project can be fully bootstrapped from the repository alone.
--
-- Deliberately excludes columns that later migrations add:
--   last_active_on             → 0002_profile_last_active.sql
--   subscription_status / ...  → 0003_subscription.sql
--
-- handle_new_user trigger: confirmed absent in the live project.
-- Row creation is handled entirely by ensureBfgProfile in application
-- code (lib/profile/ensure-bfg-profile.ts), running under the user's
-- session JWT. The insert policies below allow that path.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS, DROP POLICY IF EXISTS before
-- each CREATE POLICY. Safe to apply to a project where both tables
-- already exist — the table creates become no-ops and the policies are
-- recreated cleanly.
--
-- Apply manually via Supabase SQL Editor.

-- ─── profiles ────────────────────────────────────────────────────────────────
--
-- Per-user progression state. id = auth.users.id (1:1).
-- xp / level / streak are written only by server-side helpers
-- (awardXp, touchStreak). title is a display label set at creation.

create table if not exists public.profiles (
  id     uuid    primary key references auth.users (id) on delete cascade,
  xp     integer not null default 0,
  level  integer not null default 1,
  streak integer not null default 0,
  title  text    not null default 'Начало пути'
);

alter table public.profiles enable row level security;

drop policy if exists "select own profile" on public.profiles;
create policy "select own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- ─── avatars ─────────────────────────────────────────────────────────────────
--
-- Per-user avatar visual state. id = auth.users.id (1:1).
-- All fields are written server-side by awardXp when a level threshold
-- is crossed. Clients may read but not directly update via application UI.

create table if not exists public.avatars (
  id              uuid    primary key references auth.users (id) on delete cascade,
  evolution_stage integer not null default 1,
  form            text    not null default 'starter',
  aura            text    not null default 'soft_glow',
  glow_intensity  integer not null default 1
);

alter table public.avatars enable row level security;

drop policy if exists "select own avatar" on public.avatars;
create policy "select own avatar"
  on public.avatars
  for select
  using (auth.uid() = id);

drop policy if exists "insert own avatar" on public.avatars;
create policy "insert own avatar"
  on public.avatars
  for insert
  with check (auth.uid() = id);

drop policy if exists "update own avatar" on public.avatars;
create policy "update own avatar"
  on public.avatars
  for update
  using (auth.uid() = id);
