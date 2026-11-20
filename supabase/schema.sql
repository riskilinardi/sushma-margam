-- Run in Supabase → SQL Editor. Safe to run again.
--
-- Guests can read wishes and photos, and add a wish while the guestbook is
-- open. Only the emails in public.admins can open the guestbook, remove
-- wishes and upload photos (from /admin).

-- Who can manage the site (see the note at the bottom).
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where email = (select auth.jwt() ->> 'email')
  );
$$;

-- A single row of switches.
create table if not exists public.settings (
  id boolean primary key default true check (id),
  guestbook_open boolean not null default false
);
insert into public.settings default values on conflict do nothing;
alter table public.settings enable row level security;

drop policy if exists "Anyone can read settings" on public.settings;
create policy "Anyone can read settings" on public.settings
  for select using (true);

drop policy if exists "Admins can change settings" on public.settings;
create policy "Admins can change settings" on public.settings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Wishes from guests.
create table if not exists public.wishes (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 1 and 60),
  message text not null check (char_length(trim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);
alter table public.wishes enable row level security;

drop policy if exists "Anyone can read wishes" on public.wishes;
create policy "Anyone can read wishes" on public.wishes
  for select using (true);

drop policy if exists "Guests can write while the guestbook is open" on public.wishes;
create policy "Guests can write while the guestbook is open" on public.wishes
  for insert with check ((select guestbook_open from public.settings));

drop policy if exists "Admins can remove wishes" on public.wishes;
create policy "Admins can remove wishes" on public.wishes
  for delete to authenticated using (public.is_admin());

-- Gallery photos. The files live in the public "gallery" bucket; this table
-- keeps their order and size so the page can lay them out before they load.
create table if not exists public.photos (
  id bigint generated always as identity primary key,
  path text not null unique,
  width int not null check (width > 0),
  height int not null check (height > 0),
  created_at timestamptz not null default now()
);
alter table public.photos enable row level security;

drop policy if exists "Anyone can see photos" on public.photos;
create policy "Anyone can see photos" on public.photos
  for select using (true);

drop policy if exists "Admins can add photos" on public.photos;
create policy "Admins can add photos" on public.photos
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can remove photos" on public.photos;
create policy "Admins can remove photos" on public.photos
  for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Admins can upload gallery files" on storage.objects;
create policy "Admins can upload gallery files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admins can delete gallery files" on storage.objects;
create policy "Admins can delete gallery files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery' and public.is_admin());

-- Live updates, so new wishes and photos appear without a refresh.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['wishes', 'photos', 'settings'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;

-- Admins are added separately, straight in the SQL Editor, so their emails
-- never end up in the repository:
--
--   insert into public.admins (email) values ('...'), ('...');
