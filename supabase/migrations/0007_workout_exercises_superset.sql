-- BFG: суперсеты — фундамент БД (PR6).
--
-- Добавляем nullable superset_group_id к workout_exercises.
-- Два упражнения с одинаковым ненулевым superset_group_id образуют суперсет:
-- они выполняются последовательно и отображаются как один блок тренировки,
-- но рендерятся отдельными слайдами в сессии.
--
-- Поле намеренно nullable: все существующие тренировки оставляют его null
-- и продолжают работать без изменений. Никаких NOT NULL, CHECK или
-- триггеров на этом этапе — только сам столбец + индекс для будущих
-- GROUP BY / WHERE superset_group_id = ... запросов.
--
-- RLS: политики workout_exercises не изменяем. «Authenticated can read
-- active workout exercises» уже распространяется на новую колонку
-- автоматически — RLS в Postgres привязан к строке, а не к набору колонок.
--
-- Существующие запросы (listWorkoutExercises) не ломаются: SELECT *
-- просто получит null в новой колонке; явные SELECT-списки не затрагиваются.
--
-- Полностью идемпотентно. Применить вручную через Supabase SQL Editor.
-- Следующий шаг (PR7): распространить поле на TypeScript-типы в
-- lib/workouts/types.ts и добавить логику группировки в UI-слой.

alter table public.workout_exercises
  add column if not exists superset_group_id uuid default null;

-- Индекс поддерживает будущие запросы вида:
--   WHERE superset_group_id = $1 (выборка пары упражнений суперсета)
--   WHERE workout_id = $1 AND superset_group_id IS NOT NULL (все суперсеты тренировки)
-- Partial index: исключает null-строки, которые составляют 100% текущих данных,
-- тем самым индекс остаётся крошечным пока реальные суперсеты не появятся.
create index if not exists workout_exercises_superset_group_idx
  on public.workout_exercises (superset_group_id)
  where superset_group_id is not null;
