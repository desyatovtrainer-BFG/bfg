-- BFG MVP: каталог тренировок.
--
-- Контент-таблица: title, description, difficulty, duration, category,
-- thumbnail_url + пара полей под видео-провайдер. Сейчас провайдеров
-- ровно два: 'none' (просто карточка без видео) и 'kinescope'
-- (российский видеохостинг, работает в РФ без VPN — приоритет MVP).
-- Когда подключим Kinescope по-настоящему, никаких миграций не нужно:
-- редактор контента просто проставит video_provider = 'kinescope' и
-- video_id. Никаких embed-URL в БД не храним — собираем их в коде,
-- чтобы поменять домен/параметры одним местом.
--
-- ID — текстовый slug ('morning-flow'), чтобы:
--   - ссылки на тренировки оставались читаемыми,
--   - completeWorkoutAction мог принять стабильный идентификатор
--     без знания внутреннего uuid.
--
-- RLS: читают только авторизованные, и только активные тренировки.
-- Запись на MVP не нужна — контент заливается миграцией / руками
-- через service role. Никаких политик insert/update/delete намеренно
-- не создаём, чтобы клиент случайно ничего не записал.
--
-- Идемпотентно. Применить вручную через Supabase SQL Editor.

create table if not exists public.workouts (
  id text primary key,
  title text not null,
  description text not null,
  difficulty text not null
    check (difficulty in ('easy', 'medium', 'hard')),
  duration_min integer not null
    check (duration_min > 0),
  category text not null,
  thumbnail_url text,
  video_provider text not null default 'none'
    check (video_provider in ('none', 'kinescope')),
  video_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists workouts_active_created_idx
  on public.workouts (is_active, created_at);

alter table public.workouts enable row level security;

drop policy if exists "authenticated can read active workouts"
  on public.workouts;
create policy "authenticated can read active workouts"
  on public.workouts
  for select
  to authenticated
  using (is_active = true);

-- Сид MVP-каталога. Те же три тренировки, что мы использовали в коде
-- до перехода на БД — чтобы экран не «опустел» после применения
-- миграции. on conflict do nothing: при повторных прогонах ничего
-- не ломаем, ручные правки контента в БД сохраняются.
insert into public.workouts
  (id, title, description, difficulty, duration_min, category,
   thumbnail_url, video_provider, video_id, is_active)
values
  ('morning-flow',  'Утренний поток',     'Лёгкая мобильность и пробуждение тела', 'easy',   10, 'mobility', null, 'none', null, true),
  ('strength-mini', 'Силовой мини-сет',   'Базовые движения с собственным весом',  'medium', 20, 'strength', null, 'none', null, true),
  ('cardio-pulse',  'Кардио-импульс',     'Короткий взрыв активности',             'hard',   15, 'cardio',   null, 'none', null, true)
on conflict (id) do nothing;
