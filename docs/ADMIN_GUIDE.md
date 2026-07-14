# Admin Guide

The admin area lives at **`/admin`**. It has no navbar, no assistant, and
is excluded from search engines and the sitemap.

## Prerequisites

Admin requires Supabase (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)):

1. Tables created from `backend/supabase/schema.sql`
2. An auth user created in Supabase → Authentication → Users
3. Env vars set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`

Until then, `/admin` shows a configuration notice instead of a login.

## Signing in

Email + password of the Supabase auth user. Two locks protect the data:
the session token must be valid, **and** the email must equal
`ADMIN_EMAIL` — any other Supabase user gets a 403 from every admin API.

## The four tabs

### Overview
Total messages (with unread count), total ratings with live average, and
the number of managed content domains.

### Messages
The contact-form inbox. Every submission is archived here even when the
email was also delivered. Unread messages have a highlighted border.
Actions: **Mark read/unread**, **Delete**, and reply via the mailto link
on the sender's address.

### Ratings
Every rating with stars, feedback text, and date. Delete anything abusive —
the public average recalculates immediately.

### Content Studio
The map of every editable content domain → its exact file, current entry
count, and what it feeds. This is the answer to "where do I edit X?"
without leaving the browser.

## Why content isn't edited in the browser

Deliberate architecture decision: editorial content (projects, blogs, Q&A,
skills…) is **content-as-code** — typed files in git. What that buys:

- **Validation** — a typo in a field name fails the build instead of
  silently breaking a section.
- **History** — every content change is a commit you can review and revert.
- **Zero drift** — no second copy of the content in a database that can
  disagree with what's deployed.
- **Free-tier safety** — content pages stay statically generated and fast.

Dynamic visitor data (messages, ratings, analytics) — the stuff that must
change without a deploy — lives in Supabase and is managed in the tabs
above.

Editing workflow: open the file from Content Studio's path → edit → commit
→ push → Vercel deploys in ~2 minutes.

## Security notes

- Sessions are Supabase JWTs stored by the Supabase client; **Sign out**
  invalidates the session locally.
- Admin API routes never trust the browser: every request re-verifies the
  token server-side against `ADMIN_EMAIL`.
- The database itself refuses anonymous access (RLS with no policies), so
  even a bug in an admin route can't open public access.
- Forgot the password? Supabase Dashboard → Authentication → Users →
  ⋮ → Send password recovery (or just create a new user and update
  `ADMIN_EMAIL`).
