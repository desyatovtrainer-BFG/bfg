-- 0012_onboarding_fields.sql
--
-- What:
--   Adds the MVP onboarding fields (D078/D079/D080/D085) to public.profiles
--   and the global avatar name (D079/D083) to public.avatars. All columns
--   are NULLABLE: null = «ещё не отвечено» — the resume point of the
--   onboarding flow (D078) is derived from which fields are still null.
--
-- Columns:
--   profiles.goal                 text[]      — S2, multi-select (≥1 enforced
--                                               later in the server action,
--                                               NOT at DB level)
--   profiles.sex                  text        — S2 «Герой/Героиня»; also the
--                                               avatar direction (D079/D083)
--   profiles.fitness_level        text        — S3
--   profiles.training_format      text        — S3 home/gym
--   profiles.weekly_frequency     smallint    — S3, 2/3/4 (D085 matrix)
--   profiles.training_structure   text        — S3, CONDITIONAL (see below)
--   profiles.onboarding_completed_at timestamptz — flips only after S4 (D078)
--   avatars.name                  text        — Naming Ceremony S4 (global,
--                                               never per-direction — D083)
--
-- Conditional training_structure (D085):
--   The field is asked and required ONLY for training_format='gym' AND
--   fitness_level in ('intermediate','advanced'). Home users and beginners
--   are NEVER asked and keep training_structure = NULL — that is the
--   expected, honest state, not missing data.
--   DELIBERATELY NO conditional NOT NULL constraint in SQL: the conditional
--   requirement lives in the onboarding server action / UI validation.
--   Reasons: existing/backfilled users, easier dev, future trainer
--   overrides, and home/beginner users are expected to stay NULL.
--
-- Backfill:
--   Existing profiles get onboarding_completed_at = now() so current dev
--   accounts are never trapped by the future onboarding gate. Their
--   onboarding answer fields stay NULL (honest placeholders in Profile).
--
-- What it deliberately does NOT do:
--   • no RLS changes — existing own-row select/update policies on profiles
--     and avatars already cover these columns; column discipline is the
--     job of the dedicated server actions (Phase 2);
--   • no Program Assignment, no D077 OTP, no UI, no routes;
--   • nothing destructive: no drops, no type changes, no NOT NULL.
--
-- Apply:
--   Run this file manually in the Supabase SQL Editor BEFORE deploying any
--   application code that reads/writes these columns (Slice 15 Phase 2+).
--
-- Idempotent: add column if not exists; named CHECK constraints guarded by
-- duplicate_object exception blocks; backfill only touches NULL rows.

-- ── profiles: onboarding fields ─────────────────────────────────────────

alter table public.profiles add column if not exists goal text[];
alter table public.profiles add column if not exists sex text;
alter table public.profiles add column if not exists fitness_level text;
alter table public.profiles add column if not exists training_format text;
alter table public.profiles add column if not exists weekly_frequency smallint;
alter table public.profiles add column if not exists training_structure text;
alter table public.profiles add column if not exists onboarding_completed_at timestamptz;

-- ── avatars: global avatar name (D079/D083) ─────────────────────────────

alter table public.avatars add column if not exists name text;

-- ── CHECK constraints (all allow NULL — CHECK passes on NULL) ───────────

do $$ begin
  alter table public.profiles
    add constraint profiles_sex_check
    check (sex in ('male', 'female'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.profiles
    add constraint profiles_fitness_level_check
    check (fitness_level in ('beginner', 'intermediate', 'advanced'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.profiles
    add constraint profiles_training_format_check
    check (training_format in ('home', 'gym'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.profiles
    add constraint profiles_weekly_frequency_check
    check (weekly_frequency in (2, 3, 4));
exception when duplicate_object then null; end $$;

-- Значения только из D085; условная обязательность — НЕ здесь (см. шапку).
do $$ begin
  alter table public.profiles
    add constraint profiles_training_structure_check
    check (training_structure in ('full_body', 'split'));
exception when duplicate_object then null; end $$;

-- goal: каждый элемент массива — из допустимого набора D079 (containment,
-- не строковый матчинг). NULL-массив допустим; минимум 1 цель — валидация
-- server action'а, не БД.
do $$ begin
  alter table public.profiles
    add constraint profiles_goal_check
    check (
      goal <@ array[
        'weight_loss',
        'muscle_gain',
        'endurance',
        'general_fitness',
        'body_recomposition'
      ]::text[]
    );
exception when duplicate_object then null; end $$;

-- ── Backfill: существующие аккаунты считаются прошедшими онбординг ──────
-- (защита dev-логинов от будущего гейта; поля ответов остаются NULL).

update public.profiles
   set onboarding_completed_at = now()
 where onboarding_completed_at is null;
