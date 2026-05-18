-- BFG MVP: упражнения внутри тренировки.
--
-- Раньше у тренировки было одно «общее» видео (workouts.video_*),
-- но контент BFG — это последовательность упражнений, у каждого
-- своё короткое видео. Сама тренировка остаётся «шапкой» (название,
-- описание, сложность, длительность), а порядок и контент шагов
-- живёт здесь.
--
-- Поля workouts.video_provider / workouts.video_id намеренно не
-- удаляем: миграции в проде идут вручную через SQL Editor, и сносить
-- колонки опасно. На MVP они просто перестанут использоваться в UI —
-- сессия теперь строится из workout_exercises.
--
-- ID — uuid: упражнения мы не линкуем по slug снаружи, никакие
-- глубокие ссылки на отдельное упражнение не нужны. order_index +
-- workout_id уникальны: одно «место» на тренировке = одно упражнение,
-- без неоднозначной сортировки.
--
-- video_provider: те же два значения, что и у workouts — 'none' и
-- 'kinescope'. Kinescope = российский видеохостинг, доступен в РФ
-- без VPN. Embed-URL не храним, собираем в коде.
--
-- RLS: читают только авторизованные, и только активные упражнения.
-- Активность родительской тренировки дополнительно фильтруется на
-- уровне приложения (listWorkoutExercises вызывается только если
-- workouts.is_active=true прошёл свою RLS). Намеренно НЕ открываем
-- insert/update/delete — контент заливаем service role'ом.
--
-- Идемпотентно. Применить вручную через Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id text not null
    references public.workouts(id) on delete cascade,
  order_index integer not null
    check (order_index >= 0),
  title text not null,
  description text not null default '',
  duration_sec integer not null
    check (duration_sec > 0),
  video_provider text not null default 'none'
    check (video_provider in ('none', 'kinescope')),
  video_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (workout_id, order_index)
);

create index if not exists workout_exercises_workout_active_idx
  on public.workout_exercises (workout_id, is_active, order_index);

alter table public.workout_exercises enable row level security;

drop policy if exists "authenticated can read active workout exercises"
  on public.workout_exercises;
create policy "authenticated can read active workout exercises"
  on public.workout_exercises
  for select
  to authenticated
  using (is_active = true);

-- Сид: добавляем по 3 шага к существующим MVP-тренировкам, чтобы
-- экран сессии не оказался пустым после применения миграции. Длительности
-- по упражнениям примерно складываются в duration_min родителя — это не
-- инвариант (агрегатов не считаем), а просто разумное наполнение.
--
-- on conflict (workout_id, order_index) do nothing: повторный прогон
-- ничего не дублирует и не перетирает ручные правки контента.
insert into public.workout_exercises
  (workout_id, order_index, title, description, duration_sec,
   video_provider, video_id, is_active)
values
  ('morning-flow',  0, 'Дыхание',        'Спокойное дыхание сидя. Настройся на движение.', 120, 'none', null, true),
  ('morning-flow',  1, 'Кошка-корова',   'Мягкая мобилизация спины. Двигайся в своём ритме.', 180, 'none', null, true),
  ('morning-flow',  2, 'Растяжка',       'Лёгкое вытяжение. Без рывков.',                    300, 'none', null, true),

  ('strength-mini', 0, 'Приседания',     'Базовое движение с собственным весом.',            300, 'none', null, true),
  ('strength-mini', 1, 'Отжимания',      'Можно с колен. Главное — техника.',                300, 'none', null, true),
  ('strength-mini', 2, 'Планка',         'Удерживай корпус. Дыши.',                          180, 'none', null, true),

  ('cardio-pulse',  0, 'Прыжки на месте', 'Разогрев. Лёгкий ритм.',                          180, 'none', null, true),
  ('cardio-pulse',  1, 'Берпи',           'Силовой кардио-блок. Темп — свой.',               240, 'none', null, true),
  ('cardio-pulse',  2, 'Спринт на месте', 'Финальный импульс. Дай себе всё.',                180, 'none', null, true)
on conflict (workout_id, order_index) do nothing;
