# Environment Setup

The master reference for every environment variable this application reads.
Nothing here is invented — this list was built by grepping `process.env.`
across the entire codebase (`frontend/src`, `backend`, `scripts`), so it's
exactly what the code actually uses, no more, no less.

**The site runs with zero environment variables set.** Every feature that
needs a key checks for it first and degrades to an "offline" state (or hides
itself) instead of crashing. Add variables incrementally, only for the
features you want to turn on.

- **Template:** [`.env.example`](../.env.example) at the repo root.
- **Local dev:** copy it to `frontend/.env.local` (gitignored — never commit
  it) and restart `npm run dev` after any change.
- **Step-by-step key generation:** [API_KEYS_SETUP.md](API_KEYS_SETUP.md),
  or the focused guides — [SUPABASE_SETUP.md](SUPABASE_SETUP.md),
  [AI_SETUP.md](AI_SETUP.md), [EMAIL_SETUP.md](EMAIL_SETUP.md).

**Rule of thumb:** variables prefixed `NEXT_PUBLIC_` are compiled directly
into the browser bundle at build time — anyone can read them in the page
source. Never put a secret behind that prefix. Everything else is
server-only and never reaches the client.

## Full reference

| Variable | Public? | Required? | Read in | Purpose | Without it |
| --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Optional | `config/site.ts`, `lib/ai-providers.ts` | Canonical URL for SEO/sitemap/Open Graph tags and the AI provider's `HTTP-Referer` header | Falls back to `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Optional* | `lib/supabase.ts` | Supabase project endpoint | Ratings, Insights, contact archive, newsletter, and `/admin` all show an offline/disabled state |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Optional* | `lib/supabase.ts` | Row-level-security-respecting client, used for the admin sign-in flow | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | **No — secret** | Optional* | `lib/supabase.ts` | Server-only client that bypasses RLS; every API route that reads/writes the database uses it | Same as above |
| `ADMIN_EMAIL` | No | Optional | `lib/admin-auth.ts` | The one email allowed to authenticate into `/admin`; checked against the signed-in Supabase Auth user | Admin API routes return `503 Admin backend not configured` |
| `GEMINI_API_KEY` | No | Optional** | `lib/ai-providers.ts` | AI assistant — first provider tried | Chain skips to Groq |
| `GROQ_API_KEY` | No | Optional** | `lib/ai-providers.ts` | AI assistant — second provider tried | Chain skips to OpenRouter |
| `OPENROUTER_API_KEY` | No | Optional** | `lib/ai-providers.ts` | AI assistant — third provider tried | If none of the three are set, the chat returns a friendly "not configured" message instead of erroring |
| `SMTP_HOST` | No | Optional*** | `lib/email.ts` | Outgoing mail server for the contact form | Falls back to Web3Forms if configured, else the message is only archived to Supabase |
| `SMTP_PORT` | No | Optional | `lib/email.ts` | SMTP port | Defaults to `465` |
| `SMTP_USER` | No | Optional*** | `lib/email.ts` | SMTP auth username (also the "From" address) | See `SMTP_HOST` |
| `SMTP_PASS` | No | Optional*** | `lib/email.ts` | SMTP auth password (Gmail: an **App Password**, not your login password) | See `SMTP_HOST` |
| `CONTACT_RECEIVER_EMAIL` | No | Optional | `lib/email.ts` | Inbox that receives contact-form submissions | Defaults to the `email` field in `frontend/src/config/site.ts` |
| `WEB3FORMS_ACCESS_KEY` | No | Optional | `lib/email.ts` | Fallback contact-form delivery if SMTP isn't configured or fails | Contact form relies on SMTP only (or just archives to the database) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Yes | Optional | `app/layout.tsx` | Google Analytics 4 measurement ID | GA's `<Script>` tags are never injected — no GA at all, not even a no-op |
| `NEXT_PUBLIC_INSIGHTS_MIN_VIEWS` | Yes | Optional | `components/sections/Insights.tsx` | Minimum first-party page views before the public "Portfolio Insights" section shows real numbers | Defaults to `100` |

\* The three Supabase variables are independent of each other in code, but
functionally you need all three together — partial configuration still
leaves every DB-backed feature offline.

\*\* At least one AI key is needed for the AI assistant / AI Workspace mode
to produce real answers; all three are individually optional.

\*\*\* `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are checked together
(`lib/email.ts`) — SMTP is only considered "configured" when all three are
present. `SMTP_PORT` is not part of that check; it always has a default.

## Not environment variables (and why)

A few services are used by this project but need **no configuration at
all** — worth knowing so you don't go looking for a key that doesn't exist:

- **Vercel Analytics** (the `<Analytics />` component in `app/layout.tsx`,
  from `@vercel/analytics`) — auto-detects when the app is actually running
  on Vercel and no-ops everywhere else. No environment variable, no
  dashboard setup beyond enabling the Analytics tab after a deploy.
- **GitHub stats** (the Activity section and the Developer Dashboard mode,
  via `GET /api/github`) — call GitHub's public, unauthenticated REST API
  (`api.github.com/users/<username>`), which allows 60 requests/hour
  per IP. The route caches responses for an hour, so no Personal Access
  Token is used or needed. The GitHub *username* itself is a plain string
  in `frontend/src/config/site.ts` (`githubUsername`), not a secret.
- **GitHub contribution graph / LeetCode stats cards** — rendered as plain
  `<img>` tags pointing at free public badge services
  (`ghchart.rshah.org`, `leetcard.jacoblin.cool`,
  `github-readme-streak-stats.herokuapp.com`). No account, no key.

## Variables removed from this project

`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
`CLOUDINARY_API_SECRET` previously appeared in `.env.example` and
`docs/ENVIRONMENT_VARIABLES.md`, but **no code in this repository ever
reads them** — grepping `process.env.` across the whole project turns up
zero references. They were reserved for a signed-upload feature that was
never built. Removed rather than documented, per the rule that this file
only lists variables the code actually uses.

If you want to host images on Cloudinary today, you don't need any of
those variables or an API key at all: Cloudinary's public delivery URLs
(`https://res.cloudinary.com/...`) already work as plain image sources —
`next.config.ts` allows `res.cloudinary.com` as a remote image host, and
you can paste a Cloudinary URL directly into e.g. `certificates.ts`'s
`image` field. Uploading through Cloudinary's own dashboard (Media
Library) needs only your Cloudinary login, not an API key.

## Where to set variables

- **Local development:** `frontend/.env.local` (gitignored — verify with
  `git status` before your first commit). Restart `npm run dev` after any
  edit; Next.js only reads `.env.local` at process start.
- **Production:** set in your hosting provider's environment variable
  dashboard. Not covered here — see [`deployment.md`](../deployment.md) if
  you need it; this document is scoped to local configuration only.

## Safety notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security entirely. It must
  never appear in a client component, a `NEXT_PUBLIC_` variable, or a git
  commit. It's only ever imported from server-side code
  (`lib/supabase.ts` → `getServiceSupabase()`).
- If a key ever leaks (committed by accident, pasted somewhere public):
  rotate it immediately at the source (Supabase → Project Settings → API →
  "Reset"; Google AI Studio / Groq / OpenRouter → delete and recreate the
  key), then update it wherever it's deployed.
- `.env.local` is covered by `.gitignore` at both the repo root and inside
  `frontend/`, but double-check with `git status` before your first commit
  in a fresh clone — a global gitignore misconfiguration elsewhere on your
  machine is the one way this slips through.
