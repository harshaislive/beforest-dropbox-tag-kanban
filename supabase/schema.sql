-- Supabase schema for Dropbox Tag Kanban MVP
-- local-first tagging: tags are appended locally in UI first, then synced.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create type public.kanban_status as enum ('to_tag', 'tagged', 'in_review', 'approved');

create table if not exists public.image_assets (
  id uuid primary key default uuid_generate_v4(),
  dropbox_path text unique not null,
  preview_url text,
  status public.kanban_status not null default 'to_tag',
  assigned_to uuid references public.profiles(id),
  ingested_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.image_tags (
  id bigserial primary key,
  image_id uuid not null references public.image_assets(id) on delete cascade,
  tag text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table if not exists public.tag_events (
  id bigserial primary key,
  image_id uuid not null references public.image_assets(id) on delete cascade,
  event_type text not null check (event_type in ('add_tag', 'remove_tag', 'move_status', 'sync_writeback')),
  payload jsonb not null default '{}'::jsonb,
  actor_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

create or replace view public.leaderboard as
select
  p.id as user_id,
  coalesce(p.display_name, 'Anonymous') as display_name,
  count(it.id)::int as tagged_count
from public.profiles p
left join public.image_tags it on it.created_by = p.id
group by p.id, p.display_name
order by tagged_count desc;

alter table public.profiles enable row level security;
alter table public.image_assets enable row level security;
alter table public.image_tags enable row level security;
alter table public.tag_events enable row level security;

-- MVP-friendly permissive RLS for authenticated users.
create policy "authenticated read assets" on public.image_assets
for select to authenticated using (true);

create policy "authenticated write assets" on public.image_assets
for all to authenticated using (true) with check (true);

create policy "authenticated read tags" on public.image_tags
for select to authenticated using (true);

create policy "authenticated write tags" on public.image_tags
for all to authenticated using (true) with check (true);

create policy "authenticated read events" on public.tag_events
for select to authenticated using (true);

create policy "authenticated write events" on public.tag_events
for all to authenticated using (true) with check (true);

create policy "read own profile" on public.profiles
for select to authenticated using (id = auth.uid());

create policy "upsert own profile" on public.profiles
for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
