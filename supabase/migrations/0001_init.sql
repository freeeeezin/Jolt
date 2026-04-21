-- ─────────────────────────────────────────────
-- Jolt 초기 스키마
-- ─────────────────────────────────────────────
-- profiles   : 사용자 프로필 (익명 ID 기반)
-- push_tokens: FCM 토큰
-- logs       : 루틴 실행/피드백 로그
-- ─────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ─────────── profiles
create table if not exists public.profiles (
  id            uuid primary key,  -- 클라이언트 localStorage 의 anon_id
  sleep_hours   numeric(3,1) not null check (sleep_hours >= 0 and sleep_hours <= 24),
  meal_type     text not null check (meal_type in ('carb','protein','light','skipped')),
  drowsy_time   text not null check (drowsy_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  notify_time   text not null check (notify_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  drowsy_type   text not null check (drowsy_type in ('blood_sugar_crash','sleep_debt','post_meal_low','circadian_dip')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_notify_time_idx on public.profiles (notify_time);

-- ─────────── push_tokens
create table if not exists public.push_tokens (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  token        text not null unique,
  created_at   timestamptz not null default now()
);

create index if not exists push_tokens_profile_id_idx on public.push_tokens (profile_id);

-- ─────────── logs
create table if not exists public.logs (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  result       text not null check (result in ('good','normal','bad')),
  completed    boolean not null default true,
  drowsy_type  text check (drowsy_type in ('blood_sugar_crash','sleep_debt','post_meal_low','circadian_dip')),
  created_at   timestamptz not null default now()
);

create index if not exists logs_profile_id_created_idx on public.logs (profile_id, created_at desc);

-- ─────────── updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ─────────── RLS
-- 익명 ID 기반 서비스이므로 현재는 모든 테이블을 서버(service_role)에서만 조작한다.
-- 클라이언트는 API 라우트를 통해서만 접근하도록 막는다.
alter table public.profiles    enable row level security;
alter table public.push_tokens enable row level security;
alter table public.logs        enable row level security;

-- 기본 정책: anon 키로는 접근 불가 (service_role 은 RLS 우회).
-- 필요 시 아래 정책을 완화할 수 있다.
drop policy if exists "profiles_no_anon"     on public.profiles;
drop policy if exists "push_tokens_no_anon"  on public.push_tokens;
drop policy if exists "logs_no_anon"         on public.logs;

create policy "profiles_no_anon"
  on public.profiles for select
  to anon
  using (false);

create policy "push_tokens_no_anon"
  on public.push_tokens for select
  to anon
  using (false);

create policy "logs_no_anon"
  on public.logs for select
  to anon
  using (false);
