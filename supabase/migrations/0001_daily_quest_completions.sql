-- BFG MVP: ежедневные квесты, минимальная персистентность.
--
-- Одна строка = «юзер X закрыл квест Y в дату Z». UNIQUE по тройке
-- защищает от двойного начисления XP при двойном клике / гонке вкладок.
--
-- Применить вручную через Supabase SQL Editor (миграционная инфра
-- ещё не подключена — это первый SQL-файл в репо).

create extension if not exists "pgcrypto";

create table if not exists public.daily_quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,
  completed_on date not null default current_date,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, quest_id, completed_on)
);

create index if not exists daily_quest_completions_user_day_idx
  on public.daily_quest_completions (user_id, completed_on);

alter table public.daily_quest_completions enable row level security;

-- RLS: каждый видит и пишет только своё. Сервер ходит под сессией юзера,
-- поэтому auth.uid() = user_id — единственное правило, которое нам нужно.
drop policy if exists "select own daily quest completions"
  on public.daily_quest_completions;
create policy "select own daily quest completions"
  on public.daily_quest_completions
  for select
  using (auth.uid() = user_id);

drop policy if exists "insert own daily quest completions"
  on public.daily_quest_completions;
create policy "insert own daily quest completions"
  on public.daily_quest_completions
  for insert
  with check (auth.uid() = user_id);
