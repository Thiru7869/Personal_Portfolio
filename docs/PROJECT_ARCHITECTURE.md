# Project Architecture

How the pieces fit together. For "which file do I edit for X," see
[FOLDER_STRUCTURE.md](../FOLDER_STRUCTURE.md) (the complete folder map) or
[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) (content editing). This
document is about *why* it's shaped the way it is.

## Overall architecture

A single Next.js 15 App Router application (`frontend/`) is the entire
product: server-rendered content pages, client-side interactive islands,
and its own backend (API routes talking to Supabase). There is no separate
backend service — `backend/` in the repo root holds only the Supabase SQL
schema and its own README, not a running server.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                            │
│  Server-rendered HTML (sections, SEO, JSON-LD)             │
│  + client islands (terminal, AI chat, cursor, backdrops)   │
└───────────────┬─────────────────────────────────────────┘
                │  fetch() to same-origin /api/*
┌───────────────▼─────────────────────────────────────────┐
│         Next.js App Router (frontend/src/app)              │
│  Pages & layouts (RSC)     API routes (route.ts handlers)  │
└───────────────┬───────────────────────┬──────────────────┘
                │                       │
     Gemini / Groq / OpenRouter    Supabase (Postgres + Auth)
     (AI assistant, server-side)   (ratings, messages, analytics,
                                    newsletter, admin auth)
```

**Why one app instead of a separate frontend/backend deploy:** the API
routes and the pages that call them share types (`shared/types.ts`),
share validation schemas, and deploy atomically — there's no version-skew
window between "the frontend expects a new field" and "the backend serves
it." For a project this size, a separate backend would add an operational
surface (a second thing to deploy, a second thing to have downtime) without
buying anything back.

## Folder structure (top level)

```
portfolio/
├── frontend/         The Next.js application — see below
├── backend/          Supabase SQL schema + its own README (no server code)
├── shared/           TypeScript types + constants imported by both the
│                      frontend and (conceptually) any future backend
├── docs/             This documentation set
└── scripts/          One-off content-generation script (placeholder assets)
```

Full annotated tree: [FOLDER_STRUCTURE.md](../FOLDER_STRUCTURE.md).

## Frontend architecture

```
frontend/src/
├── app/              Routes (App Router) — pages, layouts, API handlers
│   ├── (site)/       The public site: navbar/footer/widgets chrome,
│   │                  the homepage, /blog, /qa
│   ├── admin/         /admin CMS — deliberately OUTSIDE (site), gets none
│   │                  of its chrome (no navbar, no assistant, no indexing)
│   └── api/           Backend endpoints — see API_REFERENCE.md
├── components/
│   ├── sections/      One component per homepage section (Hero, Skills, …)
│   ├── modes/          The three takeover-mode shells (Terminal, AI, Dev)
│   ├── layout/          Navbar, Footer, ThemeShell, CustomCursor, backdrops
│   ├── boot/            The cinematic startup sequence
│   ├── widgets/          Floating overlays: AI chat bubble, command palette,
│   │                     quick tour (all client-only, code-split)
│   ├── illustrations/   Generative SVG art (no raster assets)
│   ├── ui/               Small reusable primitives (Reveal, TiltCard, …)
│   ├── terminal/         The terminal emulator's rendering internals
│   ├── projects/          Project explorer/modal
│   ├── blog/ · faq/       List/search UIs for those two content types
│   └── hero/               Hero-specific pieces (tech-node canvas, dock)
├── content/            ★ All visible copy — typed data, not JSX
├── config/              ★ Personal details, mode registry, navigation
├── lib/                 Business logic: AI provider chain, email, Supabase
│                         clients, rate limiting, validation, analytics,
│                         theme state, terminal command registry
└── app/globals.css      ★ Every design token for every mode × appearance
```

**The rule that makes this maintainable:** components render structure and
read from `content/`/`config/` — they never hardcode copy. A component
file answers "how is this displayed"; a content file answers "what does it
say." This is why `docs/CUSTOMIZATION_GUIDE.md` can promise that editing
the site never means touching a component.

## Backend architecture

There's no standalone server process — "backend" here means the API
routes under `frontend/src/app/api/*`, each a `route.ts` exporting
`GET`/`POST`/etc. handlers that run as Vercel serverless functions (or
Node.js when self-hosted). Every mutation route follows the same shape:

```
zod schema.safeParse(body)   →  reject invalid input before any logic
   ↓
rateLimit(kind, clientIp)     →  429 if the per-IP window is exhausted
   ↓
getServiceSupabase()          →  null if unconfigured → 503, feature disabled
   ↓
do the work, return a typed JSON response
```

Full endpoint-by-endpoint contract: [API_REFERENCE.md](../API_REFERENCE.md).
The pattern itself is documented once, at the bottom of that file, so new
routes follow it without re-deriving it.

## Data flow

**Content (static):** `content/*.ts` → imported directly by section
components at build time → rendered as static HTML (`generateStaticParams`
for blog/Q&A detail pages) → no database round-trip, no loading state,
crawlable by default.

**Visitor-generated data (dynamic):** browser → `POST /api/*` → zod
validation → rate limit → Supabase (service-role client, bypasses RLS) →
typed JSON response → the calling component updates its own state. Reads
follow the mirror path (`GET /api/rating`, `GET /api/insights`) and are
edge-cached for a short window (see each route's `Cache-Control`).

**Admin data:** `/admin` signs in via Supabase Auth in the browser, then
sends the resulting access token as a Bearer header on every
`/api/admin/*` call; `lib/admin-auth.ts` re-verifies that token server-side
on every request (never trusts a client-side "am I signed in" flag).

## AI flow

1. Browser sends the conversation (`{ messages: [...] }`) to
   `POST /api/chat`.
2. The route validates it with zod, then calls
   `streamAssistant(messages)` in `lib/ai-providers.ts`.
3. `assistantSystemPrompt` and a compiled knowledge-base string
   (`content/ai-knowledge.ts` — built at import time by concatenating
   facts pulled from every other content file: projects, experience,
   skills, blog, FAQ, etc.) are injected as the system message, so the
   assistant only ever answers from real portfolio content.
4. The provider chain is tried in order — Gemini → Groq → OpenRouter —
   using whichever keys are configured; the first one that starts
   streaming text wins. If a provider errors *before* yielding any text,
   the chain falls through to the next one silently.
5. Response text streams back to the browser as plain text chunks (not
   full SSE re-emission) and is appended to the last assistant message in
   `lib/use-chat.ts`, which both the floating `AiAssistant` widget and the
   full-page `AiWorkspace` mode share.

Because the personality and knowledge live in one shared prompt, the
assistant's voice doesn't change depending on which provider actually
answered.

## Theme system (experience modes × appearance)

Two independent state axes, both persisted to `localStorage` and restored
by an inline `<script>` in `app/layout.tsx` **before first paint** (no
flash of the wrong theme):

- **`data-mode`** on `<html>` — one of `professional | terminal | ai |
  developer | executive` (`shared/constants.ts` → `MODE_IDS`,
  `config/modes.ts` for labels/taglines).
- **`data-appearance`** — `light | dark`.

`app/globals.css` defines every color/radius/font/shadow/spacing token per
`[data-mode]` and `[data-appearance]` combination; `tailwind.config.ts`
maps Tailwind's own scales (`bg-*`, `rounded-*`, `font-*`, `shadow-*`) onto
those CSS variables. Components only ever use the semantic Tailwind
classes — never a hardcoded color or radius — so every mode/appearance
combination reskins the whole site with zero per-component conditionals.

Three modes (`terminal`, `ai`, `developer`) are **takeover modes**: instead
of just restyling, `components/layout/ThemeShell.tsx` swaps in an entirely
different full-screen shell (a Parrot-OS-style desktop, a chat workspace,
an editor-style dashboard) while keeping the normal site mounted-but-hidden
underneath, so switching back is instant and the server-rendered DOM stays
intact for SEO. Full mechanics: [THEME_GUIDE.md](THEME_GUIDE.md).

## Rendering flow

- **Homepage (`/`):** a single React Server Component (`app/(site)/page.tsx`)
  rendering every section component in order. Most section components are
  themselves server components that just read `content/*` — only the ones
  with real interactivity (search, forms, animation) are `"use client"`.
- **Blog/Q&A detail pages:** statically generated at build time via
  `generateStaticParams`, one route per slug.
- **Takeover modes, floating widgets (AI chat, command palette, quick
  tour):** loaded via `next/dynamic` with `ssr: false` — they never block
  first paint or add to the initial server-rendered HTML, and (for the
  takeover modes) show a small branded loading fallback while their chunk
  streams in.
- **API routes:** dynamic by default (`export const revalidate = 3600` on
  `/api/github` is the one exception, since GitHub profile stats don't
  need to be fetched on every request).

## State management

There is no global state library (Redux/Zustand/etc.) — state is scoped to
exactly where it's needed:

- **Experience state** (mode + appearance): React Context
  (`lib/theme-context.tsx`, `useExperience()`), the one genuinely
  cross-cutting piece of client state, since dozens of components need to
  read or change it.
- **Chat state**: a small custom hook (`lib/use-chat.ts`) shared by both
  chat surfaces, encapsulating messages/streaming/busy state.
- **Everything else** (form inputs, open/closed panels, fetched data for
  one widget): local `useState`/`useEffect` in the component that owns it.
  Server data fetched client-side (ratings summary, GitHub stats, admin
  tables) is fetched directly with the browser `fetch` API in a
  `useEffect` — no data-fetching library — since each case is a single
  simple `GET` with an obvious loading/error shape.

This is a deliberate choice, not an oversight: the app's genuine
cross-component state is small (two values), and reaching for a state
library to manage it would add a dependency and a learning curve for no
benefit at this scale.
