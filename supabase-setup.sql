-- ============================================================
-- Konfigurasi database undangan: RSVP, ucapan, dan daftar tamu.
-- Jalankan seluruh berkas ini di Supabase > SQL Editor > New query.
-- ============================================================

create extension if not exists pgcrypto;

-- 1. Tabel ----------------------------------------------------
create table if not exists public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 1 and 100),
  status     text not null check (status in ('hadir', 'tidak_hadir')),
  pax        int  not null default 1 check (pax between 0 and 20),
  message    text check (char_length(message) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists public.wishes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  message    text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now()
);

-- 2. Row Level Security --------------------------------------
alter table public.rsvps  enable row level security;
alter table public.wishes enable row level security;
alter table public.guests enable row level security;

-- Tamu (anon): boleh mengirim RSVP dan ucapan, dan membaca ucapan.
drop policy if exists rsvps_insert_public  on public.rsvps;
drop policy if exists wishes_insert_public on public.wishes;
drop policy if exists wishes_read_public   on public.wishes;
create policy rsvps_insert_public  on public.rsvps  for insert to anon, authenticated with check (true);
create policy wishes_insert_public on public.wishes for insert to anon, authenticated with check (true);
create policy wishes_read_public   on public.wishes for select to anon, authenticated using (true);

-- Admin (authenticated): membaca dan mengelola semua data.
drop policy if exists rsvps_admin  on public.rsvps;
drop policy if exists wishes_admin on public.wishes;
drop policy if exists guests_admin on public.guests;
create policy rsvps_admin  on public.rsvps  for all to authenticated using (true) with check (true);
create policy wishes_admin on public.wishes for all to authenticated using (true) with check (true);
create policy guests_admin on public.guests for all to authenticated using (true) with check (true);

-- 3. Jumlah tamu hadir (publik, tanpa membuka data RSVP) ------
create or replace function public.rsvp_total()
returns int
language sql
security definer
set search_path = public
as $$
  select coalesce(sum(pax), 0)::int from public.rsvps where status = 'hadir'
$$;
revoke all on function public.rsvp_total() from public;
grant execute on function public.rsvp_total() to anon, authenticated;
