# Contributing / Working on This Repo

This is a personal portfolio, so "contributing" mostly means future-me (or
a friend) making changes safely. The rules below keep the site in the state
it shipped in: zero lint errors, zero type errors, zero console noise.

## Ground rules

1. **Content changes go in `frontend/src/content/` or `src/config/`.**
   If you're editing a component to change words, you're in the wrong file.
2. **Types first.** Adding a field? Start in `shared/types.ts`, let the
   compiler point at every place that needs updating.
3. **No hard-coded colors.** Use the semantic Tailwind tokens (`bg-card`,
   `text-brand`, `border-line`). If a color isn't expressible with tokens,
   the theme system needs the token — add it to every theme block.
4. **Every API route validates with zod** before touching logic, and every
   mutation is rate-limited.
5. **Accessibility isn't optional.** Interactive elements need keyboard
   support and labels; animations must respect `useReducedMotion`.

## Workflow

```bash
git checkout -b feature/<short-name>
# …make changes…
cd frontend
npm run lint && npm run type-check && npm run test && npm run build
```

All four must pass before merging — CI (`.github/workflows/ci.yml`) runs
the same four plus a critical-severity `npm audit`, and will catch it
anyway. Add or update a test in the relevant `*.test.ts(x)` file alongside
any change to `lib/` logic (validation, rate limiting, terminal commands,
etc.) — those modules are unit-tested specifically because they're easy to
break silently.

## Commit style

Short imperative subject, body explains *why*:

```
Add certificate verify links

Recruiters kept asking how to verify the HackerRank cert; the
gallery now links straight to the issuer's verification page.
```

## Pull request process

Even on a personal repo, treat a PR as a review checkpoint, not a
formality:

1. Branch from `main`, one focused change per branch/PR — a content edit
   and a component refactor shouldn't share a PR.
2. PR description states *what* changed and *why* in a sentence or two —
   the commit body usually already has this; paste it in.
3. CI must be green (lint, type-check, test, build, critical `npm audit`)
   before merging — it's required, not advisory.
4. For anything touching a section's visuals: include a before/after
   screenshot or a one-line note on what you checked manually (which mode,
   which breakpoint) — CI proves it compiles, not that it looks right.
5. Squash or keep commits as you prefer; there's no enforced history
   shape on this project, just a clean `main`.
6. Update the relevant doc in the same PR as the code change it
   describes — see [docs/README.md](docs/README.md) for which guide owns
   which topic. A code change and its documentation going stale in
   separate PRs is how docs rot.

## Adding a feature checklist

- [ ] Types in `shared/types.ts` (if new data shapes)
- [ ] Content/config in the right file with a "how to edit" comment
- [ ] Component uses semantic tokens + `Reveal`/motion patterns
- [ ] Keyboard + screen-reader path works
- [ ] Works in all five experience modes AND light/dark (spot-check Terminal and Executive — the extremes)
- [ ] Works without any env vars set (graceful degradation)
- [ ] New `lib/` logic has a test; `npm run test` passes
- [ ] Documented in the relevant guide
