# backend/

The backend of this portfolio runs in two places:

1. **Next.js API routes** — the application server. The code lives in
   `frontend/src/app/api/` because Next.js requires routes inside the app,
   but it is server-only code (contact form, ratings, analytics, AI chat,
   admin). Shared server libraries are in `frontend/src/lib/`
   (`email.ts`, `ai-providers.ts`, `rate-limit.ts`, `supabase.ts`,
   `admin-auth.ts`).

2. **Supabase PostgreSQL** — the database. This folder owns its schema.

## Folder contents

| Path | Purpose |
| --- | --- |
| `supabase/schema.sql` | Complete database schema + row-level security. Run it in the Supabase SQL Editor. |

## Where to make future updates

- **New table or column** → edit `supabase/schema.sql`, re-run it in the
  SQL Editor, then update the matching types in `shared/types.ts` and the
  API route that reads/writes it.
- **New API endpoint** → add a `route.ts` under
  `frontend/src/app/api/<name>/` and validate its input with zod.
- **Rate limits** → `shared/constants.ts` (`RATE_LIMITS`).

Setup instructions (creating the Supabase project, running the schema,
creating the admin user) are in `docs/SUPABASE_SETUP.md`.
