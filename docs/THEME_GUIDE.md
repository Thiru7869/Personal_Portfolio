# Theme Guide

The site runs on **two independent axes**, both persisted to `localStorage`
and restored before first paint (no flash of the wrong theme):

- **`data-mode`** on `<html>` — `professional | terminal | ai | developer |
  executive` (5 modes; registry: `frontend/src/config/modes.ts`, ids:
  `shared/constants.ts` → `MODE_IDS`).
- **`data-appearance`** — `light | dark` (registry: same constants file →
  `APPEARANCE_IDS`).

Switching either restyles colors, fonts, radii, shadows, spacing, and
backdrops — with zero per-component conditionals. Color/palette values for
every mode × appearance combination: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
This document covers the *mechanics*: how the system works and how to
extend it.

| Mode | Character | Takeover? |
| --- | --- | --- |
| **Professional** (default) | Minimal, precise — the standard portfolio | No |
| **Terminal** | The whole site becomes a working Parrot-OS-style desktop shell | Yes |
| **AI Workspace** | The whole site becomes a full-page streaming AI chat | Yes |
| **Developer Dashboard** | Editor-styled dashboard of live widgets | Yes |
| **Executive** | Warm, serif, presentation-focused — recruiter/print-friendly | No |

"Takeover" modes don't just restyle — `components/layout/ThemeShell.tsx`
swaps the visible tree for an entirely different full-screen shell
(`components/modes/TerminalDesktop.tsx`, `AiWorkspace.tsx`,
`DevDashboard.tsx`), while the normal site stays mounted-but-`hidden`
underneath so switching back is instant and the server-rendered DOM (SEO
content) is never torn down.

## How it works (60 seconds)

1. `frontend/src/app/globals.css` defines a block of design tokens per
   mode and per appearance:
   `[data-mode="developer"][data-appearance="dark"] { --c-bg: 13 17 23; --c-brand: 88 166 255; … }`.
   Tokens cover **color, border-radius, font family, shadow, and section
   spacing** — not just color.
2. `frontend/tailwind.config.ts` maps Tailwind's scales onto those
   variables: `bg-card` → `rgb(var(--c-card))`, `rounded-xl` →
   `var(--r-md)`, `font-display` → `var(--ff-head)`, `shadow-card` →
   `var(--shadow-card)`.
3. Components only ever use the semantic classes — they never know a
   color, radius, or font name.
4. `ThemeProvider` (`src/lib/theme-context.tsx`, `useExperience()`) sets
   `data-mode` and `data-appearance` on `<html>`, persists both to
   `localStorage`, and plays a brief whole-page morph transition
   (`.theme-switching`, ~0.6s) on change. An inline `<script>`
   (`themeInitScript`, injected in `app/layout.tsx`'s `<head>`) restores
   both from `localStorage` **before first paint** — no flash of the
   wrong mode/appearance on load.

## The token vocabulary

| Token | Utility classes | Meaning |
| --- | --- | --- |
| `--c-bg` | `bg-bg` | page background |
| `--c-surface` | `bg-surface` | raised background (inputs, bars) |
| `--c-card` | `bg-card` | cards and panels |
| `--c-line` | `border-line` | borders and dividers |
| `--c-ink` | `text-ink` | primary text |
| `--c-mute` | `text-mute` | secondary text |
| `--c-brand` | `bg-brand text-brand` | primary accent |
| `--c-brand2` | `text-brand2` | secondary accent |
| `--c-cursor-accent` | (JS-driven, `CustomCursor`) | cursor glow hue, nudged per section in view |
| `--c-term-bg`/`--c-term-ink`/`--c-term-accent` | `bg-term` etc. | terminal window colors — always dark, independent of `data-appearance` |
| `--r-sm/md/lg/xl` | `rounded-lg/xl/2xl/3xl` | corner geometry |
| `--ff-body`, `--ff-head` | `font-sans`, `font-display` | typography |
| `--shadow-card`, `--shadow-glow` | `shadow-card`, `shadow-glow` | depth |
| `--section-pad` | `.section-pad` | vertical section rhythm |

Colors are space-separated RGB (`59 130 246`) so Tailwind can apply alpha:
`bg-brand/12`. This is why the token layer, not hex codes, powers the
modes.

## Editing an existing mode

Open `globals.css`, find the `[data-mode="…"]` (structure) and
`[data-mode="…"][data-appearance="…"]` (color) blocks, change the values,
save — the dev server hot-reloads. Switch modes via the navbar's mode
switcher, the command palette (Ctrl+K → "Mode: …"), or the terminal's
`mode <name>` command; switch appearance via the sun/moon toggle.

**Before shipping a changed accent color, check its contrast** against
that mode's `--c-bg` — see
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#color-palettes) for why this is a hard
requirement here, not a nice-to-have.

## Adding a sixth mode

1. **`shared/constants.ts`** — add the id to `MODE_IDS`.
2. **`shared/types.ts`** — add it to the `ModeId` union.
3. **`frontend/src/config/modes.ts`** — register `{ id, label, tagline,
   icon, takeover }`.
4. **`globals.css`** — add a `[data-mode="<id>"]` block (structure:
   fonts/radii/spacing) and `[data-mode="<id>"][data-appearance="light"]`
   + `[...="dark"]` blocks (colors). Copy the closest existing mode as a
   starting point.
5. If it's a **takeover** mode: build the shell component under
   `components/modes/`, then wire it into `ThemeShell.tsx`'s conditional
   render (following the existing `dynamic(..., { ssr: false, loading:
   ModeLoadingFallback })` pattern for code-splitting).

TypeScript refuses to build until steps 1–3 agree, and the mode then
appears automatically in the mode switcher, the command palette, and the
terminal's `mode` command.

## Design guidance

- Keep contrast ≥ 4.5:1 between `--c-ink` and `--c-bg`, and between
  `--c-brand`/`--c-brand2` and `--c-bg` for any text usage (WCAG AA). The
  `prefers-contrast: more` media query promotes `--c-mute` to `--c-ink`
  for users who ask for more contrast still.
- `--c-brand` must survive as a *button background* with `--c-bg` text on
  it — test the primary CTA after any change.
- Test the extremes after any change: **Executive** (serif, spacious,
  warm) and **Terminal** dark (the most saturated, neon-adjacent) break
  first.

## Changing the default

`shared/constants.ts` → not directly — the defaults live in
`frontend/src/config/modes.ts` (`DEFAULT_MODE`, `DEFAULT_APPEARANCE`) and
the fallback attributes in `frontend/src/app/layout.tsx`
(`<html data-mode="professional" data-appearance="light">`). Both must
agree, or the very first paint (before the init script runs) will briefly
show the wrong default.
