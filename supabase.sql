-- Run this in Supabase SQL Editor
-- Table for waitlist

create extension if not exists "pgcrypto";

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2 and char_length(name) <= 60),
  email text not null unique check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  position serial, -- queue number, auto-increment
  created_at timestamptz not null default now(),
  ip_address text,
  user_agent text
);

-- index for fast lookup
create index if not exists waitlist_email_idx on public.waitlist (email);
create index if not exists waitlist_position_idx on public.waitlist (position);
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anyone to insert (for waitlist join)
-- You can restrict further with anon role only
drop policy if exists "Allow anon insert" on public.waitlist;
create policy "Allow anon insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- Allow anyone to read their own? For admin we use service_role which bypasses RLS
-- If you want public to check position by email, uncomment below:
-- drop policy if exists "Allow select" on public.waitlist;
-- create policy "Allow select" on public.waitlist for select to anon using (true);

-- For service_role bypass, no policy needed - service_role bypasses RLS.

-- Optional: function to get count
create or replace function public.waitlist_count()
returns bigint
language sql
security definer
as $$ select count(*) from public.waitlist; $$;
