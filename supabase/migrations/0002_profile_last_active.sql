-- BFG MVP: серия активных дней опирается на пару (streak, last_active_on).
--
-- Логика стрика — в lib/progression/streak.ts. Здесь мы только добавляем
-- колонку с датой последней «зачётной» активности. Никакой отдельной
-- истории активности на MVP не заводим — последней даты достаточно,
-- чтобы решить: продолжаем серию, начинаем заново или ничего не делаем.
--
-- Идемпотентно: alter ... if not exists / create index ... if not exists.
-- Применить вручную через Supabase SQL Editor.

alter table public.profiles
  add column if not exists last_active_on date;

create index if not exists profiles_last_active_on_idx
  on public.profiles (last_active_on);
