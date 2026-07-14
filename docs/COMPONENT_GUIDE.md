# Component Guide

The reusable building blocks — components designed to be dropped into more
than one place, as opposed to the one-file-per-section components under
`components/sections/` (those are documented by what they render, in
[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md), not by props).

## Motion & layout primitives (`components/ui/`)

### `<Reveal>`

Scroll-triggered entrance animation used across almost every section.
Respects `prefers-reduced-motion` (content simply appears, no motion).

```tsx
import { Reveal } from "@/components/ui/Reveal";

<Reveal delay={0.1}>
  <div className="card-shell p-6">…</div>
</Reveal>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | required |
| `delay` | `number` | `0` | seconds, for staggering a list (`i * 0.06` is the common pattern) |
| `y` | `number` | `28` | initial vertical offset in px |
| `className` | `string` | — | passed straight to the underlying `motion.div` |

Animates once (`viewport={{ once: true }}`) with a fixed easing curve
(`[0.21, 0.47, 0.32, 0.98]`, duration `0.6s`) — this is the project's
canonical "standard" motion timing; new entrance animations should reuse
`Reveal` rather than hand-writing another `initial`/`whileInView` pair.

### `<SectionHeading>`

The eyebrow + title + lede block that opens every homepage section — used
for visual consistency, not just to save typing.

```tsx
<SectionHeading
  eyebrow="projects"
  title="Things I've built"
  lede="A selection of what shipped, not everything I've touched."
/>
```

| Prop | Type | Required |
| --- | --- | --- |
| `eyebrow` | `string` | yes — rendered as `~/{eyebrow}` |
| `title` | `string` | yes |
| `lede` | `string` | no |

Already wraps itself in a `<Reveal>` — don't nest it in another one.

### `<TiltCard>`

3D perspective tilt that follows the mouse (the hero's identity card, some
project cards). Disabled for `prefers-reduced-motion` and effectively inert
on touch devices (no `mousemove` events to drive it).

```tsx
<TiltCard maxTilt={6}>
  <div className="card-shell">…</div>
</TiltCard>
```

| Prop | Type | Default |
| --- | --- | --- |
| `children` | `ReactNode` | — |
| `className` | `string` | — |
| `maxTilt` | `number` (degrees) | `7` |

### `<StatImage>`

An external stat-card `<img>` (GitHub contribution chart, LeetCode card,
streak badge) with a `.skeleton` shimmer shown until the image's `load`
event fires, then a fade-in. Shared by `Activity.tsx` (homepage) and
`DevDashboard.tsx` (Developer mode) so both get identical loading feel.

```tsx
<StatImage
  src={`https://ghchart.rshah.org/58a6ff/${site.githubUsername}`}
  alt={`GitHub contribution graph for ${site.githubUsername}`}
  height={128}
  minWidth={640}
  bordered={false}
  onFail={() => setChartOk(false)}
/>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string` | — | required |
| `alt` | `string` | — | required |
| `height` | `number` | — | required — reserves space so nothing jumps while loading |
| `minWidth` | `number` | — | for images wider than their container (wrap in a scrolling parent — see below) |
| `bordered` | `boolean` | `true` | set `false` when the caller already wraps this in a bordered card, to avoid a nested-border look |
| `onFail` | `() => void` | — | required — called on the image's `error` event; the caller decides the fallback UI |

**Gotcha this component exists to prevent:** a fixed `minWidth` on an
`<img>` inside a flex/grid item can force the whole ancestor chain wider
than its container, because flex/grid items default to `min-width: auto`
(content-size floor). Always pair a `minWidth`-using `StatImage` with a
`min-w-0` on its grid/flex ancestors, and wrap it in an
`overflow-x-auto` div if the image is meant to be wider than its card.

## Identity & chrome (`components/layout/`)

### `<Logo>`

The site's identity mark — Morse code for the site name decodes into the
wordmark once, in the boot sequence; everywhere else it's just the
wordmark (with the Morse spelled out in a hover tooltip).

```tsx
<Logo variant="compact" />                      // navbar — every mount
<Logo variant="animated" onComplete={() => {}} /> // boot sequence — once
```

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `"compact" \| "animated"` | `"compact"` |
| `onComplete` | `() => void` | — (only meaningful for `"animated"`) |
| `className` | `string` | — |

Don't use `variant="animated"` outside the boot sequence — a full
Morse-decode on every route change would be more gimmick than delight.

### `<CustomCursor>`

The site's single magnetic cursor: a small dot plus a softer, slower
trailing glow. Mounted once, globally, by `ThemeShell`. Not meant to be
placed per-section — its glow hue nudges automatically per the section
currently in view (via an internal `IntersectionObserver`,
`--c-cursor-accent`). Fine-pointer devices only; hidden under
`prefers-reduced-motion` and in print.

### `<SectionBackdrop kind="…">`

Gives one homepage section its own subtle background identity. Mounts (and
unmounts) only while its section is within 200px of the viewport, so
off-screen sections cost nothing.

```tsx
<section id="skills" className="section-pad">
  <SectionBackdrop kind="mesh" />
  <div className="section-shell">…</div>
</section>
```

`kind`: `"aurora" | "grid" | "blueprint" | "waves" | "timeline" | "mesh" |
"constellation" | "matrix"` — see
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#section-backdrops) for which section
uses which and why, and `components/layout/backdrops/*` for the individual
primitives (`Aurora`, `Grid`, `Blueprint`, `Waves`, `TimelineLighting`,
and the shared `NodeCanvas` that powers `mesh`/`constellation`/`matrix`).

**Placement requirement:** `SectionBackdrop`'s host is `position: absolute`
with `z-index: 0` — it must be the first child of a `position: relative`
container, and any real content sharing that container needs its own
`position: relative` (or higher) stacking context to paint above it. The
project's `.section-pad`/`.section-shell` utility classes already handle
this pairing automatically (see `globals.css`); a bespoke container (like
a takeover mode's root div) needs to opt in explicitly — see how
`DevDashboard.tsx` and `AiWorkspace.tsx` do it for the pattern to copy.

## Illustrations (`components/illustrations/`)

### `<AbstractMesh>`

A small generative line-art/gradient-mesh SVG — two soft gradient blobs
behind a sparse node network, entirely inline SVG using the active theme's
`--c-brand`/`--c-brand2` tokens (no raster assets, no image-generation
API). Used sparingly as a decorative accent: the boot sequence's welcome
card, the AI Workspace sidebar, the blog list header.

```tsx
<AbstractMesh className="h-16 w-full rounded-xl opacity-60" id="ai-workspace" />
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `className` | `string` | — | sizing/positioning/opacity — this component has no default size |
| `id` | `string` | `"mesh"` | must be unique per instance on the page — becomes part of an SVG `<linearGradient>` id, and duplicate SVG gradient ids across a page cause rendering bugs in some browsers |

## When to add a new reusable component vs. inlining

Add it here (a real component in `ui/`, `layout/`, or `illustrations/`)
when the same visual pattern appears in **two or more places** — that's
the actual signal, not "this might be reused someday." A pattern used once
belongs inline in its section component; extracting it early just adds a
prop-drilling layer with no present benefit. Every component above was
extracted after the second usage, not before the first.
