# Suff deployment and Supabase setup

## 1. Create and configure Supabase

1. Create a Supabase project and save its Project URL, anon/public key, and service-role key securely.
2. In the Supabase SQL Editor, run [`supabase/migrations/20261007010000_suff_schema.sql`](supabase/migrations/20261007010000_suff_schema.sql). This creates `profiles`, `posts`, and `saved_posts`, profile creation on Auth signup, indexes, grants, and row-level security policies.
3. Enable Email auth in **Authentication → Providers → Email**. Configure email confirmation and your SMTP provider before production use.
4. Enable Google and/or GitHub under **Authentication → Providers** and enter each provider's OAuth client credentials. Add the Supabase callback URL shown in the provider setup screen to its OAuth application. The app's sign-in sheet offers both providers; enable only those for which you supply credentials.
5. Set the Supabase **Site URL** to the production Vercel URL. Add both the production URL and any preview URLs to **Authentication → URL Configuration → Redirect URLs**, including `https://<your-domain>/auth/callback`.
6. Seed the sample creators and posts/flows from `src/data/posts.ts` from a trusted local shell:

   ```sh
   NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co" \
   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
   npm run seed:posts
   ```

   The seed uses stable UUIDs and upserts by slug, so it can be safely rerun. The service-role key bypasses RLS: use it only in this one-off seed command. Do not put it in a `NEXT_PUBLIC_*` variable, commit it, or add it to Vercel for this app.

## 2. Environment variables

Set these in Vercel for **Production**, **Preview**, and **Development** as appropriate:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public client config | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client config | Supabase anon/publishable key; RLS protects data |

The build intentionally works without these values for local previews and returns the bundled sample feed. Once configured, Explore and Flows read public post records from Supabase, Saved reads authenticated saved-post records, and the auth modal uses Supabase Auth. A configured but unreachable database surfaces an empty/error state instead of silently masking the backend failure.

## 3. Vercel production deployment

1. Import `aydanmoussa74-a11y/suff` from GitHub into Vercel and select **Next.js**. The repository uses the Next.js App Router; leave the framework build command as `next build` (or `npm run build`) and output settings at their Next.js defaults.
2. Add the two public Supabase variables above to Vercel's project environment settings before the first production build. Do not add the service-role key.
3. Deploy the production branch. Vercel runs `npm run build`; no credentials are embedded at build time and the pages remain server-rendered against the public Supabase API.
4. Add the production deployment URL to Supabase Auth's site and redirect URL allowlists. Verify email signup, OAuth callback, Explore, Flows, and Saved after deployment.

## 4. Auth and data behavior

- Email/password sign-in and sign-up use Supabase Auth. New auth users receive a `profiles` row from the migration trigger. The UI never marks a user identity-verified; `verified` defaults to false.
- Google and GitHub use Supabase OAuth's PKCE callback at `/auth/callback`.
- Saved records are scoped by `auth.uid()` with RLS and stored by `(user_id, post_id)`.
- Public read policies expose profile display fields and published sample posts. Keep privileged writes off the client and review policies before adding post submission or moderation features.
