# Changelog

All notable changes to this project. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] — 2026-07-14

First stable release. The portfolio, its backend, its five experience
modes, and its full documentation set are complete and production-ready.

### Added

- **Five complete experience modes** (Professional, Terminal, AI
  Workspace, Developer Dashboard, Executive) × light/dark appearance, all
  driven by a single CSS-variable token layer with zero per-component
  conditionals.
- **Cinematic boot sequence** — terminal-style boot log → glitch
  transition → Morse-code logo reveal → on-brand welcome card — once per
  browser session, replayable on demand, fully `prefers-reduced-motion`
  aware.
- **A working terminal** (30+ commands, history, tab completion) that can
  take over the entire site as its own desktop shell.
- **AI assistant** ("Thiru Assistant") with a Gemini → Groq → OpenRouter
  fallback chain, grounded in a knowledge base compiled automatically from
  every content file; available as a floating widget and as a full-page
  AI Workspace mode.
- **Developer Dashboard mode** — live GitHub contribution graph, streak,
  and repo stats; LeetCode stats; language proficiency; tech stack; AI
  usage; system status; recent writing — with skeleton loading states
  throughout.
- **Per-section ambient backgrounds** — a curated, non-repeating set of
  subtle canvas/SVG backdrops (aurora, blueprint, neural mesh,
  constellation, timeline lighting, digital matrix), mounted only while
  their section is near the viewport.
- **Guided quick tour**, command palette (Ctrl+K), scroll-linked progress,
  a single unified magnetic cursor with section-aware accent color.
- **Visitor ratings** ("Ship readiness review") with live distribution and
  a recent-comments feed, contact form (SMTP + Web3Forms fallback,
  archived to Supabase), newsletter signup, and first-party analytics
  ("Portfolio Insights").
- **Admin CMS** at `/admin` — Supabase Auth sign-in, message inbox, rating
  moderation, and a Content Studio map of every editable content domain.
- **Complete documentation set** — architecture, system design, API
  reference, database schema (with ER diagram), component guide, design
  system, performance, security, environment setup, and per-service setup
  guides for every integration actually used.

### Changed

- Executive mode's palette redesigned to warm ivory / graphite / bronze
  gold / forest green — every accent color re-verified for WCAG AA
  contrast (several pre-existing light-mode accent colors across other
  modes were also darkened slightly after the same audit turned up
  contrast ratios as low as 3.04:1 against their background).
- Per-section canvas/SVG backgrounds replaced a single global,
  session-random ambient backdrop, giving each section its own subtle
  visual identity without adding perceptible weight.
- Developer Dashboard and the homepage Activity section now share a
  `StatImage` component with proper skeleton loading, replacing blank
  space while external stat-card images load.
- Documentation consolidated and renamed for consistency:
  `API_GUIDE.md` → `API_REFERENCE.md`, `DATABASE_GUIDE.md` →
  `DATABASE_SCHEMA.md`, `docs/API_SETUP_GUIDE.md` split into
  `docs/API_KEYS_SETUP.md` plus dedicated `SUPABASE_SETUP.md`/
  `AI_SETUP.md`/`EMAIL_SETUP.md` guides, `docs/ENVIRONMENT_VARIABLES.md` →
  `docs/ENVIRONMENT_SETUP.md`, `docs/PROJECT_UPDATE_GUIDE.md` →
  `docs/MAINTENANCE.md`. Every cross-reference across the repo was
  updated; no duplicate documentation was left behind.

### Fixed

- Three environment variables (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) were documented and
  templated but never read anywhere in the code — removed rather than
  left as dead configuration.
- `docs/THEME_GUIDE.md` described a fictional seven-mode system
  (`data-theme`, modes named "Cloud"/"Cyber", a `config/themes.ts` file
  that doesn't exist) left over from an earlier iteration — rewritten to
  match the actual five-mode/two-appearance system.
- Several README/doc claims didn't match reality: an "AI Chat"/"Cloud"/
  "Cyber" mode count, a "28-article blog"/"101 answers across 27
  categories" figure that overstated actual content by roughly 3–10×, a
  blog word-count guideline off by roughly 2×, a `socialLinks` list
  including a platform (Instagram) that isn't configured while omitting
  two that are (X/Twitter, LeetCode), and a terminal-command example
  referencing a `setTheme` context method that was renamed to
  `setMode`/`setAppearance`.
- `/api/newsletter` existed and worked but was undocumented in the API
  reference; the `newsletter_subscribers` table was undocumented in the
  database schema; `GET /api/rating`'s `recentComments` field (added
  during the visual redesign) was missing from its documented response
  shape. All three now documented.
- A mobile-viewport layout bug: a fixed `min-width` on wide stat-card
  images (GitHub contribution chart) could force its flex/grid ancestors
  wider than the viewport, pushing Developer Dashboard content
  (System Status values, Tech Stack chips) off-screen on narrow screens.
  Fixed at the container level (`min-w-0` on the affected ancestors) so
  the images correctly scroll within their own bounds instead.
- The Command Palette's search input removed the browser's default focus
  outline (`focus:outline-none`) without a replacement — unlike every
  other input in the app — leaving keyboard users with no visible focus
  indicator on that field. Added a `focus-within` border highlight,
  matching the pattern used everywhere else.
- `.card-shell`'s base styles had no `transition`, so Developer mode's
  hover accent (a top-border color change, applied via a mode-scoped CSS
  rule rather than a Tailwind utility) snapped instantly instead of
  animating like every other card's hover state. Added a base transition
  so this — and any future mode-scoped hover rule — animates smoothly by
  default.

### Performance

- Removed an entirely unused Google Font (Sora, `--font-display`) that
  was imported and preloaded on every page load — every heading in the
  app resolves its font through `--ff-head` (Inter, JetBrains Mono, or
  Fraunces depending on mode), which the Sora variable was never wired
  into. One fewer font family downloaded, zero visual change.
- No new runtime dependencies added across the entire redesign and
  hardening effort — every visual effect (canvas backgrounds, progress
  bars, tilt/parallax) is Framer Motion, Canvas2D, or plain CSS; no
  Three.js, no charting library, no client-side data-fetching library.

### Security

- Nine API-route failure paths that previously failed silently (a
  Supabase read/write error, every AI provider failing, contact-form
  email delivery failing) now log via `console.error` with route context,
  so a real production failure leaves a trace instead of vanishing.
  Deliberately left silent: malformed client request bodies (already
  surfaced to the caller as a `400`) and `/api/track` failures
  (analytics is explicitly best-effort, at page-view frequency).
- Full security posture documented for the first time in
  [docs/SECURITY.md](docs/SECURITY.md) — environment separation, input
  validation, rate limiting, CSP/security headers, CORS (none present, by
  design), RLS, and logging, all cross-checked against the actual code
  rather than described from memory.

### Documentation

See the diffs above and [docs/README.md](docs/README.md) for the current,
complete documentation index.
