# Security

Every security control actually implemented in this codebase — what it is,
where it lives, and why. Nothing here is aspirational.

## Environment variables & secret management

- **Every secret is server-only.** Only variables prefixed `NEXT_PUBLIC_`
  are compiled into the browser bundle; everything else
  (`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `SMTP_PASS`, etc.) is
  read exclusively inside `app/api/*` route handlers and `lib/*` server
  modules, never imported by a client component. Full variable-by-variable
  reference (including which is public vs. secret, and why each public one
  is safe to expose): [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).
- **`.env.local` is gitignored** at both the repo root and inside
  `frontend/` — verify with `git status` before your first commit in a
  fresh clone regardless, since a global gitignore misconfiguration
  elsewhere is the one way this slips through.
- **`.env.example` ships only placeholder values**, never real
  credentials — every value in it is a realistic-looking example, not an
  empty string (so it doubles as documentation of the expected format).
- **Graceful degradation instead of crashing on missing secrets.** Every
  integration checks `isSupabaseConfigured` / `isAiConfigured` /
  `isEmailConfigured` up front and shows an honest "offline"/"not
  configured" UI state rather than attempting a call that would throw. A
  fresh clone with zero environment variables set builds and runs
  correctly — this is tested by CI in the sense that the build itself
  never depends on any env var being present.
- **Key rotation:** if a key ever leaks, rotate it at the source
  (Supabase → Project Settings → API → "Reset"; each AI provider's
  dashboard → delete and recreate the key) and update it wherever it's
  deployed. Details: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md#safety-notes).

## Input validation

Every API route validates its body with a zod schema
(`frontend/src/lib/validation.ts`) before any logic runs —
`schema.safeParse(body)`, reject on failure with a `400` naming what's
wrong. Schemas enforce the same length/shape limits as the database's own
`check` constraints (see [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)), so
a request that passes validation can't violate a table constraint either.
The contact form additionally carries a **honeypot field** (`company`,
must stay empty) — a bot that fills every field gets a fake `200` success
with nothing delivered or stored, rather than a `400` that would tell it
which field to leave blank next time.

## API authentication

- **Public routes** (`contact`, `rating`, `newsletter`, `chat`, `track`,
  `insights`, `github`) — no authentication, by design; they're meant for
  any visitor.
- **Admin routes** (`/api/admin/*`) — every request must carry
  `Authorization: Bearer <supabase-access-token>`. `lib/admin-auth.ts` →
  `requireAdmin()` re-verifies that token against Supabase **on every
  single request** (`supabase.auth.getUser(token)`), then additionally
  checks the token's email matches `ADMIN_EMAIL` (case-insensitive). Two
  independent checks: a valid Supabase session that isn't the admin's
  email still gets `403`. The server never trusts a client-side "am I
  signed in" flag — there's no session state on the server to trust
  *or* to fake.
- Sign-in itself is plain Supabase Auth email + password
  (`supabase.auth.signInWithPassword`) — no custom JWT issuance, no OAuth
  provider, no callback URLs to secure. Supabase issues and verifies its
  own session tokens.

## Rate limiting

Per-IP sliding-window limiter (`lib/rate-limit.ts`), applied to every
mutation route:

| Route | Limit |
| --- | --- |
| `/api/contact` | 3 / 10 min / IP |
| `/api/rating` (POST) | 5 / hour / IP |
| `/api/chat` | 20 / 10 min / IP |
| `/api/newsletter` | 3 / hour / IP |

Blocked requests get `429` with a `Retry-After` header. The limiter is
**in-memory, per serverless instance** — an explicit, documented trade-off
(see the comment at the top of `rate-limit.ts`): on a platform like Vercel
each warm instance keeps its own window, which is sufficient abuse
protection for a portfolio's traffic pattern (bursts tend to hit the same
warm instance) without needing an external store. If this project ever
needed strict *global* limits across every instance, the fix is a Redis
(e.g. Upstash) backend behind the same `rateLimit()` interface — not a
redesign.

## Content Security Policy & security headers

Applied to every response via `next.config.ts` → `headers()`:

| Header | Value (summary) |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'`; explicit allow-lists for script/style/img/font/connect/frame sources; `object-src 'none'`; `frame-ancestors 'self'`; `upgrade-insecure-requests` in production |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |

**Why `'unsafe-inline'` on `script-src`/`style-src`:** the theme-init
script (runs before first paint to avoid a mode/appearance flash),
JSON-LD, and Next.js's own hydration scripts are inline by nature. A
nonce-based CSP would force every page into dynamic rendering, losing the
static generation this project's Lighthouse scores depend on. `object-src
'none'` plus `base-uri 'self'` plus `frame-ancestors 'self'` still block
the highest-severity injection vectors (plugin embeds, `<base>` hijacking,
clickjacking) regardless. This is a documented, deliberate trade-off, not
an oversight — see the comment block at the top of `next.config.ts`.

`'unsafe-eval'` and `ws:`/`wss:` are added to `script-src`/`connect-src`
**only when `NODE_ENV !== "production"`** (React Refresh + webpack HMR
need them in dev) — the deployed site never carries them.

## CORS

**No CORS headers are set anywhere** — every API route is same-origin
only by default, which is correct here: nothing in this project is
designed to be called cross-origin from another site. There's no
`Access-Control-Allow-Origin: *` or per-route CORS configuration to audit
because there's deliberately none of it.

## Database security (Supabase RLS)

Every table has row-level security **enabled with zero policies** —
`anon`/`authenticated` roles are denied all access by default; only the
server-side `SUPABASE_SERVICE_ROLE_KEY` (never sent to the browser)
bypasses RLS. Full detail: [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md#row-level-security-rls).
Practical consequence: even a leaked `NEXT_PUBLIC_SUPABASE_ANON_KEY`
grants no read/write access to any table.

## Error handling

Three layers — API-route-level typed error responses, a route-level React
error boundary, and a last-resort global error boundary — detailed in
[SYSTEM_DESIGN.md](SYSTEM_DESIGN.md#error-handling). Relevant here: no
error response body ever includes a stack trace, a raw database error
message, or any internal detail — every route returns a short, fixed,
human-written error string, with the real error (if any) going to the
server log instead (see below), not the client.

## Logging

Every API route that can fail in a way its caller can't already explain
from the response alone (an unexpected Supabase error, every AI provider
failing, email delivery failing) logs via `console.error` with the route
and a short description, so a real production failure leaves a trace in
your host's function logs — this was tightened up for the 1.0 release;
previously several of these failed silently. Two categories are
*deliberately* left silent, not overlooked:

- **Malformed request bodies** (`req.json()` throwing on invalid JSON) —
  already surfaced to the caller as a `400`; logging a client's bad input
  server-side would be noise, not signal.
- **`/api/track` failures** — analytics is explicitly best-effort by
  design (the route always returns `204` regardless of what happened
  internally); logging every dropped analytics event at page-view
  frequency would drown out logs that matter.

No route logs request bodies, emails, or message content — only the fact
that something failed and where.

## What's intentionally out of scope

- **No CAPTCHA** — the honeypot field plus rate limiting is the anti-spam
  strategy; a portfolio's contact form doesn't see enough abuse volume to
  justify the UX cost of a CAPTCHA.
- **No WAF/DDoS layer of its own** — inherited from whatever platform
  hosts it (e.g. Vercel's edge network); not something this application
  layer implements itself.
- **Dependency vulnerability scanning is CI-gated, but only on severity
  `critical`** — `.github/workflows/ci.yml` runs a dedicated `audit` job
  (`npm audit --omit=dev --audit-level=critical`) on every push/PR.
  High/moderate advisories don't fail the build; the workflow's own
  comment explains why: at the time this was set up, the remaining
  advisories were transitive build-time dependencies inside Next.js
  itself (not runtime-exploitable in a static deploy) that couldn't be
  fixed without downgrading Next. Dependabot tracks those instead. Revisit
  this gate's threshold periodically — a "true at setup time" exception
  can go stale.
