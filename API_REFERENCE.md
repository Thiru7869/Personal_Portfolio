# API Reference

Every backend endpoint, its contract, and its failure behaviour. All routes
live in `frontend/src/app/api/` and validate input with zod
(`frontend/src/lib/validation.ts`) before any logic runs. All mutation
routes are rate-limited per IP (limits in `shared/constants.ts` →
`RATE_LIMITS`, shown per-endpoint below).

Base URL: your deployment (e.g. `https://thiru.dev`) or `http://localhost:3000`.

---

## POST /api/contact

Contact-form submission. Delivers by SMTP, falls back to Web3Forms, and
archives to Supabase (best effort — delivery and archival are independent;
one failing doesn't block the other).

**Validation** (`contactSchema`): `name` 2–100 chars, `email` valid email
≤150 chars, `subject` 3–150 chars, `message` 10–3000 chars, `company` must
be empty (honeypot — see below).

**Authentication:** none (public).

**Request**

```json
{
  "name": "Jane Recruiter",
  "email": "jane@company.com",
  "subject": "Full stack role",
  "message": "We'd like to talk…",
  "company": ""
}
```

`company` is a honeypot — it must be empty. Bots that fill it receive a
fake `200` success and nothing is delivered or stored.

**Responses**

| Status | Body | Meaning |
| --- | --- | --- |
| 200 | `{ "ok": true }` | Delivered and/or archived |
| 400 | `{ "error": "…" }` | Validation failed (message says which field) |
| 429 | `{ "error": "…" }` | Rate limited (3 messages / 10 min / IP) — `Retry-After` header set |
| 502 | `{ "error": "…" }` | No delivery channel worked and no database configured |

---

## GET /api/rating

Public rating summary, including the most recent one-line review comments.

**Authentication:** none (public).

**Response 200**

```json
{
  "average": 4.6,
  "count": 27,
  "distribution": { "1": 0, "2": 1, "3": 2, "4": 5, "5": 19 },
  "recentComments": [
    { "score": 5, "feedback": "The terminal sold me." }
  ]
}
```

`recentComments` holds up to the 6 most recent ratings that included
feedback text, newest first — the underlying data has no name/identity
field, so this is inherently anonymous.

Returns **503** when Supabase is not configured (the UI shows its offline
card). Cached for 60 s at the CDN (`stale-while-revalidate=300`).

## POST /api/rating

**Validation** (`ratingSchema`): `score` required integer 1–5, `feedback`
optional string ≤300 chars.

**Authentication:** none (public).

**Request**

```json
{ "score": 5, "feedback": "The terminal sold me." }
```

**Responses:** `200 { "ok": true }` · `400` invalid body · `429` rate
limited (5 submissions / hour / IP) · `500` write failed · `503` not
configured.

---

## POST /api/newsletter

Footer email signup. Stores the address in Supabase
(`newsletter_subscribers`, unique on email — resubmitting the same address
just upserts, it's not an error).

**Validation** (`newsletterSchema`): `email` valid email ≤150 chars.

**Authentication:** none (public).

**Request**

```json
{ "email": "you@company.com" }
```

**Responses**

| Status | Body | Meaning |
| --- | --- | --- |
| 200 | `{ "ok": true }` | Stored |
| 400 | `{ "error": "That email doesn't look right." }` | Validation failed |
| 429 | `{ "error": "…" }` | Rate limited (3 / hour / IP) |
| 500 | `{ "error": "Couldn't save that — try again." }` | Database write failed |
| 503 | `{ "error": "Newsletter not configured." }` | Supabase not configured |

---

## POST /api/chat

Thiru Assistant. Walks the provider chain Gemini → Groq → OpenRouter with
the personality and knowledge base injected server-side. Streams back a
**plain text** response body (not SSE) — the client appends chunks as they
arrive.

**Validation** (`chatSchema`): `messages` array, 1–30 items; each item's
`content` 1–2000 chars; last message's `role` must be `"user"`. Only the
most recent 10 turns are actually forwarded to the model.

**Authentication:** none (public).

**Request**

```json
{
  "messages": [
    { "role": "user", "content": "What's his strongest stack?" }
  ]
}
```

**Responses**

| Status | Body | Meaning |
| --- | --- | --- |
| 200 | streamed plain text | Reply, token by token |
| 400 | `{ "error": "…" }` | Invalid conversation shape |
| 429 | `{ "error": "…" }` | Rate limited (20 / 10 min / IP) |
| 502 | `{ "error": "…" }` | Every configured provider failed |
| 503 | `{ "error": "…" }` | No provider key configured |

---

## POST /api/track

First-party analytics events (fired by `frontend/src/lib/analytics.ts`).
No cookies, no user identifiers — only the event type, coarse country
(from the hosting platform's `x-vercel-ip-country`-style edge header, when
present), and a device class parsed from the user agent.

**Validation:** `type` must be one of the allowed event names below;
malformed bodies are silently ignored rather than erroring.

**Authentication:** none (public).

**Request**

```json
{ "type": "page_view", "path": "/blog" }
```

Valid `type` values: `page_view`, `resume_download`, `project_view`,
`contact_submit`, `rating_submit`, `chat_opened`, `terminal_command`.

**Response:** **always `204`**, even on bad input or a missing database —
analytics must never break the page or surface an error to the visitor.

---

## GET /api/insights

Aggregates for the "Portfolio Insights" section.

**Authentication:** none (public).

**Response 200**

```json
{
  "totalViews": 1289,
  "resumeDownloads": 74,
  "terminalCommands": 311,
  "chatSessions": 96,
  "topProjects": [{ "slug": "leafsense", "views": 122 }],
  "countries": [{ "name": "IN", "count": 830 }],
  "devices": [{ "name": "Mobile", "count": 640 }]
}
```

503 when Supabase is not configured. Cached for 5 minutes at the CDN.

---

## GET /api/github

Cached, unauthenticated public GitHub profile stats for the username in
`config/site.ts` (`githubUsername`). No token used or needed — see
[docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md#not-environment-variables-and-why).

**Authentication:** none (public).

**Response 200** — always `200`, even on upstream failure (fields are
`null` instead of the request erroring, so the UI can degrade to plain
links):

```json
{ "repos": 14, "followers": 3, "avatar": "https://...", "createdAt": "2021-03-01T00:00:00Z" }
```

Revalidated hourly (`export const revalidate = 3600`) and CDN-cached for an
hour, so GitHub's 60-requests/hour unauthenticated limit is never a
concern regardless of site traffic.

---

## Admin endpoints (authentication required)

All `/api/admin/*` routes require the header
`Authorization: Bearer <supabase-access-token>` from a Supabase Auth
session whose email equals `ADMIN_EMAIL` (case-insensitive comparison).
The token is re-verified server-side on every request
(`lib/admin-auth.ts` → `requireAdmin()`) — the server never trusts a
client-side "am I signed in" flag. Anything else gets `401` (no/invalid
token) or `403` (valid token, wrong email); an unconfigured backend
(missing Supabase or `ADMIN_EMAIL`) gets `503`. The admin UI at `/admin`
handles all of this for you — these are documented for direct API use.

### /api/admin/messages
- `GET` → `{ "messages": [ … ] }` (newest first, max 200)
- `PATCH` `{ "id": "<uuid>", "read": true }` → toggle the read flag
- `DELETE` `{ "id": "<uuid>" }` → remove a message

### /api/admin/ratings
- `GET` → `{ "ratings": [ … ] }` (newest first, max 500)
- `DELETE` `{ "id": "<uuid>" }` → remove spam/abuse

---

## The pattern every route follows

```
zod schema.safeParse(body)   →  reject invalid input before any logic
   ↓
rateLimit(kind, clientIp)     →  429 if the per-IP window is exhausted
   ↓
getServiceSupabase()          →  null if unconfigured → 503, feature disabled
   ↓
do the work, return a typed JSON response
```

Deeper rationale for this shape: [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md#request-lifecycle-a-typical-page-load)
and [docs/SECURITY.md](docs/SECURITY.md).

## Adding a new endpoint

1. Create `frontend/src/app/api/<name>/route.ts`.
2. Define a zod schema in `lib/validation.ts`; parse with `safeParse`
   before any logic.
3. Rate-limit mutations: add an entry to `RATE_LIMITS` in
   `shared/constants.ts` and call `rateLimit("<name>", ip)`.
4. If it touches the database, use `getServiceSupabase()` and handle the
   `null` (unconfigured) case with a `503`.
5. Document it here.
