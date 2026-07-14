# Supabase Setup

Supabase is this project's database and admin authentication provider. It
powers four features, all of which gracefully disable themselves if
Supabase isn't configured:

| Feature | Table | API route(s) |
| --- | --- | --- |
| Visitor ratings ("Ship readiness review") | `ratings` | `GET/POST /api/rating` |
| Portfolio Insights (page views, top projects, etc.) | `analytics_events` | `POST /api/track`, `GET /api/insights` |
| Contact-form archive | `contact_messages` | `POST /api/contact` |
| Newsletter signups | `newsletter_subscribers` | `POST /api/newsletter` |
| `/admin` CMS (moderate ratings/messages) | (reads the above) + Supabase Auth | `app/admin/*`, `/api/admin/*` |

**Free:** Yes — Supabase's free tier (500 MB database, 50k monthly active
Auth users, no time limit) is far more than a personal portfolio needs.
**Free tier limitations to know about:** free projects **pause after 7 days
of no API activity** and need a manual "restore" click in the dashboard to
wake back up (data isn't lost, just paused) — if your portfolio gets
regular traffic this never triggers, but a low-traffic personal site might
hit it between visits.

---

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → **Start your project**.
2. Sign in (GitHub sign-in is the fastest option).
3. **New project**:
   - **Name:** anything, e.g. `portfolio`.
   - **Database Password:** generate a strong one and **save it somewhere**
     (a password manager) — you won't need it for this app's `.env`
     variables (those come from the API settings page in step 4), but
     you'll need it if you ever connect a direct Postgres client.
   - **Region:** pick the region closest to where most of your visitors
     (or you, for local dev latency) are. This can't be changed later
     without creating a new project, but for a portfolio's traffic the
     difference is milliseconds either way — don't overthink it.
4. Click **Create new project** and wait (~2 minutes) for provisioning.

## 2. Run the schema

This creates all four tables with row-level security locked down.

1. In the Supabase dashboard, left sidebar → **SQL Editor** → **New query**.
2. Open [`backend/supabase/schema.sql`](../backend/supabase/schema.sql) from
   this repo, copy its entire contents, paste into the editor.
3. Click **Run**. You should see "Success. No rows returned."
4. The script is idempotent (`create table if not exists`) — safe to re-run
   if you ever need to.

**What it creates:** `contact_messages`, `ratings`, `newsletter_subscribers`,
`analytics_events` — with `check` constraints matching this app's own zod
validation (e.g. ratings scores 1–5, message length caps), plus an index on
`analytics_events` for the Insights aggregation query.

## 3. Row-level security (already handled by the schema)

Every table has RLS **enabled with zero policies defined** — this is
deliberate, not incomplete. With RLS on and no policies, Postgres denies
**all** access to the `anon` and `authenticated` roles, full stop. Only
this app's server-side API routes can reach the data, using the
`SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS entirely.

Practical effect: even if your `NEXT_PUBLIC_SUPABASE_ANON_KEY` leaks (it's
public by design, shipped in the browser bundle), it grants **zero**
read/write access to any table. There's nothing to additionally lock down
here — you don't need to write your own RLS policies for this project to
be secure. If you extend the schema with a new table, remember to
`enable row level security` on it too and *not* add public policies unless
you specifically want anon/public access.

## 4. Storage buckets

**Not used.** This project doesn't upload files to Supabase Storage —
certificate images, the resume PDF, and the research paper PDF are all
served as static files from `frontend/public/` (or optionally from
Cloudinary URLs pasted directly into content files — see
[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md#variables-removed-from-this-project)).
No bucket setup is required.

## 5. Authentication (for `/admin`)

The admin CMS uses Supabase Auth's plain **email + password** sign-in
(`supabase.auth.signInWithPassword` in `frontend/src/app/admin/page.tsx`) —
there's no OAuth provider, no magic link, no third-party callback URL to
configure.

1. Dashboard → **Authentication** → **Users** → **Add user**.
2. Enter the email and password you want to sign in with. You can leave
   "Auto Confirm User" checked (no email verification step needed for an
   admin account you're creating for yourself).
3. Click **Create user**.
4. Set `ADMIN_EMAIL` (see below) to **exactly** that email — the API guard
   in `frontend/src/lib/admin-auth.ts` compares them case-insensitively,
   but the value must otherwise match exactly.

That's the entire auth setup. No JWT secret to configure by hand — Supabase
issues and verifies its own session tokens; this app's server code just
calls `supabase.auth.getUser(token)` to validate the bearer token sent by
the admin UI.

## 6. Copy the environment variables

Dashboard → **Project Settings** (gear icon) → **API**:

| Dashboard field | Environment variable | Notes |
| --- | --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Public — safe in the browser |
| Project API keys → `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public — RLS makes it safe (see §3) |
| Project API keys → `service_role` | `SUPABASE_SERVICE_ROLE_KEY` | **Secret** — server only, bypasses RLS. Never expose this one. |

Paste all three into `frontend/.env.local`, plus `ADMIN_EMAIL` from step 5.
Full variable reference: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

## 7. Verify it's working

1. `npm run dev` (restart it if it was already running, so the new env
   vars are picked up).
2. Scroll to the **Ship Readiness Review** section on the homepage and
   submit a rating. It should succeed and the live percentage should
   update — if you instead see an "offline" card, the env vars aren't
   being picked up (double check `.env.local` is inside `frontend/`, not
   the repo root, and that you restarted the dev server).
3. Check it landed in the database: Supabase dashboard → **Table Editor** →
   `ratings` → your row should be there.
4. Go to `localhost:3000/admin`, sign in with the email/password from
   step 5. You should reach the dashboard instead of a "not configured" or
   "not authorized" message.

**Common mistakes:**
- Pasting the `service_role` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or
  vice versa) — both are long JWTs and easy to mix up; the dashboard
  clearly labels which is which, double-check before copying.
- Forgetting to restart `npm run dev` after editing `.env.local`.
- Creating the Auth user with a different email than `ADMIN_EMAIL` (or a
  typo in either) — sign-in will succeed at the Supabase level but the
  app's own check returns `403`.
- Expecting the free project to respond instantly after 7+ days of
  inactivity — it needs a manual "restore" click in the dashboard first
  (you'll see a "Project paused" banner).
