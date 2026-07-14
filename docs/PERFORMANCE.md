# Performance

The concrete techniques behind this project's performance, and the current
numbers — not aspirational targets, what a fresh `npm run build` actually
reports. Re-run `npm run build` after any significant change and compare
against the table below; a regression here is a real regression.

## Current bundle size (as shipped)

```
Route (app)                          Size    First Load JS
┌ ○ /                               41.7 kB      211 kB
├ ○ /blog                            2.74 kB     156 kB
├ ● /blog/[slug]                     2.04 kB     113 kB
├ ○ /projects                        9.11 kB     161 kB
├ ○ /qa                              1.67 kB     150 kB
└ ○ /admin                          71.3 kB      189 kB
+ First Load JS shared by all       102 kB
```

`/admin`'s larger bundle is expected and fine — it's excluded from the
sitemap/search engines, visited by exactly one person, and not part of the
visitor-facing performance budget.

## Bundle optimization

- **No heavy UI/animation dependency beyond Framer Motion.** No
  Three.js/React Three Fiber, no GSAP, no chart library, no date library —
  every canvas effect (`components/layout/backdrops/*`) is hand-rolled
  Canvas2D, and every "chart" (rating distribution, language proficiency
  bars) is a plain `<div>` with an animated `width`, not a charting
  library. This was a deliberate constraint during the visual redesign
  work, not an oversight — each of those libraries would have added
  meaningfully more JS than the effect was worth.
- **Dead weight is removed, not just avoided.** The `Sora` Google Font was
  imported and preloaded for a CSS variable (`--font-display`) that no
  `font-family` declaration anywhere in the codebase actually referenced —
  every heading uses `--ff-head`, which is always Inter, JetBrains Mono,
  or Fraunces depending on mode. Removed entirely (see `app/layout.tsx`);
  one fewer font family downloaded on every single page load, for zero
  visual change.
- **No client-side data-fetching library** (no SWR/React Query/TanStack
  Query) — every client fetch in this app is a single simple `GET` with an
  obvious loading/error shape; a caching/dedup library would be a
  dependency added for a problem the app doesn't have at this scale.

## Dynamic imports (code splitting)

Everything not needed for first paint is `next/dynamic({ ssr: false })`,
so it never taxes the initial JS bundle:

| Component | Where | Loading fallback |
| --- | --- | --- |
| `TerminalDesktop`, `AiWorkspace`, `DevDashboard` (takeover modes) | `ThemeShell.tsx` | `ModeLoadingFallback` — a small branded pulse, so switching modes never flashes blank while the chunk downloads |
| `AiAssistant`, `CommandPalette`, `QuickTour` | `SiteWidgets.tsx` | none — these are floating overlays triggered by user action (click/Ctrl+K), a brief gap before mount is imperceptible |

## Lazy loading

Two different mechanisms for two different costs (bundle weight vs. CPU
work) — see
[SYSTEM_DESIGN.md](SYSTEM_DESIGN.md#lazy-loading) for the full breakdown.
The one worth calling out here: `SectionBackdrop` (the per-section
ambient background) mounts only when its section is within 200px of the
viewport (`IntersectionObserver`) and **unmounts** — not just pauses —
when it scrolls back out, so a long scroll down the homepage never has
more than one or two backdrop canvases actually running at once,
regardless of how many sections exist.

## Image optimization

- `next/image` for every static asset — automatic `avif`/`webp` (see
  `next.config.ts` → `images.formats`), responsive `sizes`, no
  layout-shift (dimensions always specified or `fill` inside a sized
  container).
- External stat-card images (GitHub contribution chart, LeetCode card,
  GitHub streak badge) are deliberately **plain `<img>` tags**, not
  `next/image` — they're already-optimized SVG/PNG services on someone
  else's CDN; routing them through Next's image proxy would add a hop for
  no size or format benefit (see the `eslint-disable` comment at each such
  usage). They use the shared `StatImage` component
  (see [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md#statimage)) for a
  `.skeleton`-shimmer loading state instead.
- No AI-generated raster illustrations anywhere — decorative art
  (`components/illustrations/`) is hand-written inline SVG, which is
  smaller than almost any raster format and needs no `next/image`
  handling at all.

## Rendering strategy

- Homepage: server-rendered/static (server components read `content/*`
  directly; only genuinely interactive sections are `"use client"`).
- Blog posts and Q&A: statically generated at build time
  (`generateStaticParams`) — one HTML file per slug, no per-request work.
- API routes: dynamic by request, except `GET /api/github`
  (`revalidate: 3600` — see [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md#caching-strategy)
  for the full caching picture across every route).

## Font loading

`next/font/google`, self-hosted (no render-blocking third-party request,
no FOUT/FOIT flash from a late-loading external stylesheet):

- **Inter** (`--font-sans`, body + default headings) and **JetBrains
  Mono** (`--font-mono`, Terminal/Developer headings, code, labels) —
  preloaded, since Professional mode (the default) uses both immediately.
- **Fraunces** (`--font-serif`, Executive mode headings only) —
  `preload: false`. It still loads the moment Executive mode is selected;
  it just doesn't compete for bandwidth on the far more common first
  visit that never touches Executive mode.

## Hydration

No hydration-warning-prone patterns (`Date.now()`, `Math.random()`, or
anything else that differs between server and client render) execute
during the initial render — where randomness was genuinely useful
(the tech-node canvas layout, ambient ID generation), it's computed inside
`useEffect`, which only runs client-side, after hydration is already
reconciled. `reactStrictMode: true` is on in `next.config.ts`, which
double-invokes effects in development specifically to surface this class
of bug early.

## Lighthouse readiness

Target: **95+** across Performance/Accessibility/Best Practices/SEO. The
techniques above (static-first rendering, code-split interactivity,
gated canvas work, optimized fonts/images, no layout-shift-prone patterns)
are what get there — there's no separate "Lighthouse mode" or special-case
code path; a fast Lighthouse score is a side effect of the architecture,
not a bolt-on. Run it yourself: Chrome DevTools → Lighthouse, against a
production build (`npm run build && npm run start`), not `next dev` (dev
mode is deliberately unoptimized and will score lower on things that don't
matter in production, like unminified JS).
