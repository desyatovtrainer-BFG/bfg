-- BFG MVP: идемпотентность завершения тренировки.
--
-- Одна строка = «юзер X завершил тренировку Y в дату Z». UNIQUE по тройке
-- (user_id, workout_id, completed_on) защищает от двойного начисления XP
-- при двойном клике / гонке вкладок / реплее запроса.
--
-- Это узкая «защитная» таблица под идемпотентность, а не полноценный
-- audit-log тренировок (тот живёт в roadmap как `workout_completions`
-- post-MVP, см. BFG_DATABASE.md §10). По форме мы повторяем шаблон
-- daily_quest_completions (см. 0001) — намеренно, чтобы и серверный
-- код имел одинаковую структуру обработки 23505.
--
-- Применить вручную через Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id text not null references public.workouts(id) on delete cascade,
  completed_on date not null default current_date,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, workout_id, completed_on)
);

create index if not exists workout_completions_user_day_idx
  on public.workout_completions (user_id, completed_on);

alter table public.workout_completions enable row level security;

-- RLS: каждый видит и пишет только своё. Сервер ходит под сессией юзера,
-- поэтому auth.uid() = user_id — единственное правило, которое нам нужно.
-- update/delete намеренно не открываем: запись о завершении не редактируется.
drop policy if exists "select own workout completions"
  on public.workout_completions;
create policy "select own workout completions"
  on public.workout_completions
  for select
  using (auth.uid() = user_id);

drop policy if exists "insert own workout completions"
  on public.workout_completions;
create policy "insert own workout completions"
  on public.workout_completions
  for insert
  with check (auth.uid() = user_id);
