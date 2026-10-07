-- Restrict the trigger helper to trigger invocation; public RPC callers do not need it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Index both remaining foreign keys for join and delete performance.
create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists saved_posts_post_id_idx on public.saved_posts (post_id);

-- Evaluate the authenticated user ID once per statement rather than once per row.
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can read their own saved posts" on public.saved_posts;
create policy "Users can read their own saved posts" on public.saved_posts
  for select using ((select auth.uid()) = user_id);

drop policy if exists "Users can save posts for themselves" on public.saved_posts;
create policy "Users can save posts for themselves" on public.saved_posts
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Users can remove their own saved posts" on public.saved_posts;
create policy "Users can remove their own saved posts" on public.saved_posts
  for delete using ((select auth.uid()) = user_id);
