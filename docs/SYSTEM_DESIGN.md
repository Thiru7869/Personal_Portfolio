# System Design

The runtime behavior behind the architecture described in
[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) — what actually happens,
in order, for the flows that matter most.

## Request lifecycle (a typical page load)

```
1. Browser requests /
2. Next.js serves the pre-rendered/streamed HTML for app/(site)/page.tsx
   — every section component, JSON-LD, metadata already in the markup
3. Inline <script> in <head> reads localStorage and sets
   data-mode / data-appearance on <html> BEFORE first paint
   (no flash of the wrong theme)
4. React hydrates. Client-only islands mount:
     - BootSequence (see below) — only if this is a fresh session
     - CustomCursor, AmbientBackdrop, ScrollProgress
     - Dynamically-imported widgets (AiAssistant, CommandPalette,
       QuickTour) — code-split, load after the shell is interactive
5. Section components that need live data (Activity's GitHub/LeetCode
   cards, Insights, Rating) fire their own client-side fetch to same-origin
   /api/* routes and render a skeleton until the response lands
```

Steps 1–2 happen entirely on the server (or at the CDN edge for statically
generated routes) — a user with JavaScript disabled still sees the full
content, just without the interactive layer.

## Boot sequence

The cinematic startup (`components/boot/BootSequence.tsx`) is a client-only
state machine, gated by `sessionStorage` so it plays once per browser
session, not on every reload:

```
hidden → power-on → lines → glitch → logo → welcome → hidden
```

- **power-on / lines**: a simulated terminal boot log, lines revealed on a
  fixed interval (`lib/boot-sequence.ts` holds the copy and timing
  constants).
- **glitch**: a brief CSS animation transition (`animate-glitch`).
- **logo**: `components/layout/Logo.tsx` in its `animated` variant —
  decodes the site's name from Morse code, then resolves to the wordmark.
  Calls `onComplete` when done, which is what advances the state machine.
- **welcome**: an on-brand welcome card with Start Exploring / Quick Tour /
  Skip. Any of the three commits the session flag and reveals the Hero.

`prefers-reduced-motion` collapses the entire sequence to the welcome card
directly. A "Replay intro" action (footer, command palette) clears the
session flag and dispatches a `replay-boot` event the component listens
for, so the sequence can be re-triggered without a hard reload.

## Dashboard flow (Developer mode)

`components/modes/DevDashboard.tsx` is one of three takeover-mode shells
(see [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md#theme-system-experience-modes--appearance)).
On mount:

1. Two client-side fetches fire in parallel: `GET /api/github` (profile
   stats) and `GET /api/insights` (this app's own AI-conversation count).
   Both are best-effort — a failed fetch just leaves that widget's number
   blank, it never blocks the rest of the dashboard.
2. Widgets that embed external stat-card images (GitHub contribution
   graph, streak badge, LeetCode card) use the shared `StatImage`
   component, which shows a `.skeleton` shimmer until the image's `load`
   event fires, then fades it in — never a layout jump, never a broken
   empty box while waiting.
3. Static widgets (Languages, Tech Stack, Learning Queue, System Status,
   Recent Writing) render immediately from `content/*` — no fetch, no
   loading state needed.
4. **Exit** returns `mode` to `professional` via the shared experience
   context; the normal site was mounted-but-hidden the whole time, so this
   is instant.

## AI workflow

Covered in depth in
[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md#ai-flow). The
system-design-relevant details: the provider chain
(`lib/ai-providers.ts`) is a **fallback**, not a race — providers are tried
strictly in order (Gemini → Groq → OpenRouter), and a provider only "loses"
if it errors before producing any output text. If a provider fails
*mid-stream* (after some text was already sent to the browser), the chain
does **not** retry — the partial answer stands, rather than risk showing
the user two different answers concatenated. Every request also runs
through a 25-second timeout (`fetchWithTimeout`) so a hung upstream
provider can't hang the response indefinitely.

## Error handling

Three layers, from most to least specific:

1. **API routes** — every route validates input with zod before touching
   any logic, catches expected failure modes explicitly (missing config →
   `503`, bad input → `400`, rate limited → `429`), and returns a typed
   JSON error body rather than letting an exception reach the client as an
   unstructured 500. Routes that must never break the page even on total
   failure (`/api/track`) always return `204` regardless of what happened
   internally.
2. **Route error boundary** (`app/error.tsx`) — catches render/runtime
   errors anywhere in a page, logs via `console.error` (captured by
   whatever host's function/runtime logs), and offers **Try again** /
   **Go home** instead of a white screen. Scoped per-route, so a crash in
   one page doesn't take down the whole app.
3. **Global error boundary** (`app/global-error.tsx`) — the last resort,
   for when even the root layout fails. Renders its own minimal
   `<html>/<body>` with inline styles (deliberately not dependent on
   Tailwind/`globals.css`, in case *that* layer is what broke) and a
   restart button.

Feature-level degradation is handled separately, at the data layer, not as
"errors" at all: `isSupabaseConfigured`, `isAiConfigured`, and
`isEmailConfigured` are checked up front, and unconfigured features show an
honest "offline"/"not configured" state rather than attempting a call that
would fail. See [SECURITY.md](SECURITY.md) for the full list of what
degrades and how.

## Performance strategy

- **Static-first.** Every content page (homepage sections, blog posts,
  Q&A) is server-rendered or statically generated — no client-side fetch
  needed just to show content that doesn't change per-visitor.
- **Code-split client islands.** Anything that isn't needed for first
  paint (`AiAssistant`, `CommandPalette`, `QuickTour`, the three takeover
  modes) is loaded via `next/dynamic({ ssr: false })`, keeping the initial
  JS bundle focused on what's actually visible immediately.
- **Canvas work is gated, not global.** Per-section backgrounds
  (`SectionBackdrop`) mount only when their section is within 200px of the
  viewport (`IntersectionObserver`) and unmount when it scrolls away;
  every canvas animation additionally pauses on `visibilitychange` (tab
  backgrounded) and is skipped entirely under `prefers-reduced-motion`.
- **Fonts** load via `next/font` (self-hosted, no render-blocking external
  request, no layout shift from late font swaps).
- **Images** go through `next/image` wherever the source is a static
  asset; external stat-card badges (GitHub chart, LeetCode card) are
  deliberately plain `<img>` tags instead — they're already-optimized SVG
  services, so `next/image` would add a proxy hop for no benefit (see the
  `eslint-disable` comments at each such usage for the specific reasoning).

Full detail and current bundle numbers: [PERFORMANCE.md](PERFORMANCE.md).

## Lazy loading

Two distinct mechanisms, used for two different problems:

| What | Mechanism | Why |
| --- | --- | --- |
| Heavy/rarely-used **components** (AI chat, command palette, takeover modes) | `next/dynamic({ ssr: false })` | Keep them out of the initial JS bundle entirely until needed |
| Off-screen **canvas animations** (section backdrops) | `IntersectionObserver`-gated mount/unmount | Keep them out of the CPU budget until visible, regardless of bundle |
| Below-the-fold **images** | `next/image`'s built-in `loading="lazy"` | Standard browser-native deferral |

## Caching strategy

- **Static pages/assets** — served from the CDN edge as static output;
  effectively cached indefinitely until the next deploy.
- **`GET /api/github`** — `export const revalidate = 3600` (ISR-style,
  1 hour) plus a `Cache-Control: public, s-maxage=3600,
  stale-while-revalidate=86400` response header, since GitHub's own
  unauthenticated rate limit (60/hr) makes frequent refetching pointless.
- **`GET /api/rating`** — `s-maxage=60, stale-while-revalidate=300`. The
  live percentage should feel current but doesn't need to be
  request-fresh.
- **`GET /api/insights`** — `s-maxage=300, stale-while-revalidate=600`
  (5 minutes) — an aggregate dashboard number, not a value anyone expects
  to the second.
- **`POST` routes** (contact, rating, chat, newsletter, track) — never
  cached; each is a fresh mutation or a streamed response.
- **Client-side data** (dashboard widgets, admin tables) — fetched fresh
  on mount every time; there's no client-side cache layer (no SWR/React
  Query) because nothing in this app is fetched often enough, from enough
  places, to need request de-duplication or background revalidation.
