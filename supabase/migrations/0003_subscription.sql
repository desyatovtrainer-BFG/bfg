-- BFG MVP: фундамент подписки.
--
-- Сейчас система знает только три состояния:
--   free_trial — 30-дневный бесплатный период от даты регистрации.
--   active     — оплаченная подписка.
--   expired    — триал или подписка закончились.
--
-- Provider-agnostic: никакой связи со Stripe или конкретным эквайрингом.
-- Когда подключим российские платёжные системы (ЮKassa, Tinkoff, CloudPayments,
-- ЮMoney и т.д.), они будут только проставлять `subscription_status = 'active'`
-- и `subscription_expires_at`. Сама модель подписки от провайдера не зависит.
--
-- Логика расчёта итогового состояния (учёт триала и срока действия) —
-- в lib/subscription/state.ts. Здесь только колонки и дефолты.
--
-- Применить вручную через Supabase SQL Editor.

alter table public.profiles
  add column if not exists subscription_status text
    not null default 'free_trial';

-- check-constraint навешиваем отдельно, чтобы add column был идемпотентным
-- при повторном прогоне миграции (если колонка уже есть с дефолтом).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_subscription_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_subscription_status_check
      check (subscription_status in ('free_trial', 'active', 'expired'));
  end if;
end $$;

alter table public.profiles
  add column if not exists trial_started_at timestamptz
    not null default now();

alter table public.profiles
  add column if not exists subscription_expires_at timestamptz;

create index if not exists profiles_subscription_status_idx
  on public.profiles (subscription_status);
