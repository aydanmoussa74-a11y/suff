create extension if not exists pgcrypto;

create type public.profile_tier as enum ('member', 'pro', 'curator');
create type public.post_kind as enum ('component', 'screen', 'flow');

create table public.profiles (
  id uuid primary key,
  handle text not null unique,
  name text not null default 'Member',
  avatar_url text,
  tier public.profile_tier not null default 'member',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_handle_format check (handle ~ '^[a-z0-9_]{2,30}$')
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind public.post_kind not null,
  title text not null,
  summary text not null default '',
  author_id uuid not null references public.profiles(id) on delete restrict,
  frameworks text[] not null default '{}',
  tags text[] not null default '{}',
  like_count integer not null default 0 check (like_count >= 0),
  preview_url text,
  preview jsonb not null default '{}'::jsonb,
  palette jsonb not null default '[]'::jsonb,
  snippets jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_posts (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index posts_kind_created_at_idx on public.posts (kind, created_at desc);
create index posts_frameworks_gin_idx on public.posts using gin (frameworks);
create index posts_tags_gin_idx on public.posts using gin (tags);
create index saved_posts_user_created_idx on public.saved_posts (user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  requested_handle text;
  safe_handle text;
begin
  requested_handle := lower(coalesce(new.raw_user_meta_data ->> 'handle', split_part(new.email, '@', 1), 'member'));
  safe_handle := regexp_replace(requested_handle, '[^a-z0-9_]', '', 'g');
  safe_handle := left(safe_handle, 23);
  if length(safe_handle) < 2 then
    safe_handle := 'member';
  end if;

  insert into public.profiles (id, handle, name, avatar_url)
  values (
    new.id,
    safe_handle || '_' || left(replace(new.id::text, '-', ''), 6),
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1), 'Member'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.saved_posts enable row level security;

create policy "Profiles are readable by everyone" on public.profiles
  for select using (true);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Posts are readable by everyone" on public.posts
  for select using (true);

create policy "Users can read their own saved posts" on public.saved_posts
  for select using (auth.uid() = user_id);
create policy "Users can save posts for themselves" on public.saved_posts
  for insert with check (auth.uid() = user_id);
create policy "Users can remove their own saved posts" on public.saved_posts
  for delete using (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.posts to anon, authenticated;
grant update (handle, name, avatar_url) on public.profiles to authenticated;
grant select, insert, delete on public.saved_posts to authenticated;
