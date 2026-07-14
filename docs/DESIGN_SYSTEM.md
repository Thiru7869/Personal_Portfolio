# Design System

Typography, color, spacing, shadows, motion, and iconography — the visual
language every mode is built from. For the mechanics of *how* modes swap
these tokens, see [THEME_GUIDE.md](THEME_GUIDE.md); for the components
built on top of these tokens, see [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md).

Everything below is a CSS custom property defined in
`frontend/src/app/globals.css` and consumed through Tailwind's scales
(`tailwind.config.ts` maps `bg-*`/`rounded-*`/`font-*`/`shadow-*` onto
these variables) — **no component ever hardcodes a color, radius, or
font.** That single rule is what lets five modes × two appearances reskin
the entire site with zero per-component conditionals.

## Typography

| Token | Font | Loaded via | Used for |
| --- | --- | --- | --- |
| `--font-sans` (`--ff-body`, `--ff-head` default) | Inter | `next/font/google`, preloaded | Body text everywhere; headings in Professional/AI/Executive... wait — see note below |
| `--font-mono` | JetBrains Mono | `next/font/google`, preloaded | Terminal mode body+headings, Developer mode headings, code, labels, the eyebrow text above every section heading |
| `--font-serif` | Fraunces | `next/font/google`, **not** preloaded (`preload: false`) | Executive mode headings only — deferred since most visitors never switch to it |

`--ff-head` per mode: **Professional** → Inter · **Terminal** → JetBrains
Mono · **AI Workspace** → Inter (only radii change in AI mode) ·
**Developer** → JetBrains Mono · **Executive** → Fraunces (serif).

Two Tailwind utility classes carry all of this: `font-sans` (→
`--ff-body`) and `font-display` (→ `--ff-head`) — component code always
uses one of these two classes, never a font name.

**Type scale:** no separate type-scale token — headings compose Tailwind's
standard size utilities (`text-3xl`, `text-4xl`, `sm:text-5xl`, …) directly
with `font-display font-bold tracking-tight`, and `--track-head` (a
per-mode letter-spacing token, e.g. `-0.03em` default, `0em` in Terminal)
rides along automatically via the `.font-display`/heading base rule in
`globals.css`.

## Color palettes

All colors are stored as space-separated RGB triplets (`37 99 235`, not
`#2563EB`) specifically so Tailwind's `/opacity` syntax works —
`bg-brand/12`, `border-brand/40`, etc. Hex shown below for readability
only; the source of truth is always `globals.css`.

| Mode | Appearance | `--c-bg` | `--c-ink` | `--c-brand` | `--c-brand2` |
| --- | --- | --- | --- | --- | --- |
| Professional | light | `#FFFFFF` | `#111418` | `#2563EB` blue | `#12873D` green |
| Professional | dark | `#090A0C` | `#F3F4F6` | `#60A5FA` blue | `#4ADE80` green |
| Terminal | light | `#DEE2E6` | (default ink) | `#137438` green | `#1D4ED8` blue |
| Terminal | dark | `#060A08` | `#BEF5C8` | `#00FF41` neon green | `#4ADE80` green |
| AI Workspace | light | `#F8F9FC` | (default ink) | `#6B5CEC` purple | `#0D8266` teal |
| AI Workspace | dark | (default dark bg) | (default dark ink) | `#9486FF` purple | `#34D399` teal |
| Developer | light | `#FFFFFF` | (default ink) | `#0969DA` blue | `#1A7F37` green |
| Developer | dark | `#0D1117` | `#E6EDF3` | `#58A6FF` blue | `#3FB950` green |
| Executive | light | `#FAF8F3` warm ivory | `#292622` graphite | `#8C6C34` bronze gold | `#285842` forest green |
| Executive | dark | `#171512` graphite ink | `#EDE6D8` warm ivory | `#CDAC6C` champagne gold | `#619476` forest green |

Rows marked "(default …)" inherit the light/dark appearance base value
(`:root`/`[data-appearance="dark"]`) rather than overriding it — most
modes only override `--c-bg`/`--c-surface`/`--c-line`/`--c-brand`/
`--c-brand2`, not every token.

Every token beyond these four exists too: `--c-surface` (raised
backgrounds — inputs, bars), `--c-card` (cards/panels), `--c-line`
(borders/dividers), `--c-mute` (secondary text), and the terminal-specific
`--c-term-bg`/`--c-term-ink`/`--c-term-accent` (used by the boot sequence
and terminal chrome, always dark regardless of the active appearance — a
terminal window doesn't go "light mode").

**Contrast is a hard requirement, not a suggestion.** Every `--c-brand`/
`--c-brand2` value above was checked against its own mode's `--c-bg` with
the WCAG relative-luminance formula and holds ≥4.5:1 for normal text — see
the inline comments in `globals.css` next to any value that was darkened
from an earlier pick to clear that bar. If you change an accent color,
re-check contrast before shipping it; a color that merely "looks fine" on
one monitor can measure well under 4.5:1.

## Section backdrops

Each homepage section gets its own subtle background identity
(`<SectionBackdrop kind="…">` — see
[COMPONENT_GUIDE.md](COMPONENT_GUIDE.md#sectionbackdrop-kind)), assigned so
no two adjacent sections repeat:

| Section | `kind` | What it looks like |
| --- | --- | --- |
| Hero | `aurora` | Two large, slow-drifting soft gradient blobs |
| About, Research, Now | `grid` | Faint graph-paper grid, masked to an ellipse |
| Skills | `mesh` | Sparse linked-node canvas (calm, low-opacity) |
| Projects | `blueprint` | Layered blueprint grid lines |
| Experience | `timeline` | A soft light beam drifting down the section |
| Education, Certificates, FAQ | `waves` | Layered wave silhouettes at the bottom |
| Contact | `constellation` | Sparser linked-node canvas, larger nodes |
| Developer Dashboard (takeover) | `matrix` | Restrained falling-glyph columns |
| AI Workspace (takeover) | `mesh` | Same primitive as Skills |
| Terminal, Activity, Testimonials, Rating, Insights | *(none)* | Deliberately backdrop-free — already visually dense |

All backdrops are pure CSS/SVG or a shared lightweight Canvas2D primitive
(`NodeCanvas`, powering `mesh`/`constellation`/`matrix`) — no Three.js, no
WebGL, kept intentionally cheap. Every canvas variant pauses on
`visibilitychange` and is static under `prefers-reduced-motion`.

## Spacing

`--section-pad` sets the vertical rhythm between homepage sections and
varies by mode's *personality*, not arbitrarily: `6.5rem` default,
`4.5rem` in Terminal (denser, more "desktop" feeling), `8rem` in Executive
(generous, presentation-style whitespace). Within a section, spacing uses
Tailwind's standard scale (`gap-2` through `gap-10`, `p-4` through `p-9`)
chosen per component density — a chip row and a feature-card grid
legitimately want different gaps; there's no separate custom spacing
token beyond `--section-pad`.

## Shadows

Two tokens: `--shadow-card` (the resting elevation every `.card-shell`
uses) and `--shadow-glow` (a colored, brand-tinted glow for hover/focus
emphasis, e.g. `.btn-primary:hover`, `hover:shadow-glow`). Both are
full box-shadow value strings (not just a color) so each mode can express
"depth" differently — Developer mode sets `--shadow-card: 0 0 transparent`
(flat, editor-style, relying on its top-border accent instead — see
`[data-mode="developer"] .card-shell` in `globals.css`), while Executive
mode uses a warm, low-contrast shadow tuned to feel like paper rather than
UI chrome. `.card-shell` itself carries a base `transition` for
`border-color`/`box-shadow`/`transform` so any mode's hover state animates
smoothly by default, even modes (like Developer's top-border accent) that
don't add their own Tailwind transition utility.

## Motion principles

- **One canonical entrance animation.** `<Reveal>` (see
  [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md#reveal)) — opacity + `y`-offset,
  `0.6s`, easing `[0.21, 0.47, 0.32, 0.98]`, triggered once per element on
  scroll into view. New entrance animations should reuse it rather than
  hand-rolling another curve.
- **Two hover speeds, chosen by weight.** Buttons/icon-buttons animate at
  `200ms` (`transition-all duration-200`); cards and larger surfaces at
  `300ms` (`transition-all duration-300`). Heavier elements get a touch
  more time to feel intentional rather than twitchy.
- **`active:scale-[0.98]` on every clickable control** (buttons, icon
  buttons, chips) — the one universal tap/click feedback in the system.
- **`prefers-reduced-motion` is load-bearing, not decorative.** A global
  media query in `globals.css` collapses every animation/transition
  duration to `0.01ms`; every canvas-based component additionally checks
  `window.matchMedia("(prefers-reduced-motion: reduce)")` directly and
  renders a static frame instead of starting a `requestAnimationFrame`
  loop at all (not just a faster one).
- **Motion never blocks content.** Nothing is `opacity: 0` without a
  `prefers-reduced-motion` fallback that renders it immediately — a user
  who asks for reduced motion gets the full page, instantly, not a
  half-finished animation frozen mid-transition.

## Icons

[Lucide React](https://lucide.dev) exclusively — no second icon set, no
custom SVG icon components outside `components/illustrations/` (which are
decorative art, not icons). Icons are sized explicitly per context
(`size={13}` for inline labels, `size={17}`–`20` for standalone buttons)
rather than inheriting a global icon size, and always carry
`aria-hidden="true"` when the adjacent text already conveys the meaning
(the common case) or a real `aria-label` on the interactive parent when
the icon *is* the only label (icon-only buttons).
