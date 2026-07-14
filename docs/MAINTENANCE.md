# Maintenance Guide

How to keep the portfolio current over months and years — the routine
maintenance playbook.

## The universal workflow

```bash
# 1. edit content files (see the map below)
# 2. verify locally
cd frontend
npm run dev            # eyeball it
npm run lint && npm run type-check && npm run test && npm run build
# 3. ship
git add -A && git commit -m "Add <thing>" && git push
```

CI (`.github/workflows/ci.yml`) re-runs the same four checks plus a
critical-severity `npm audit` on every push/PR — if your local run is
green, CI will be too. Total time for a routine content update: ~5
minutes.

## Common updates, fastest path

| Situation | Do this |
| --- | --- |
| **Shipped a new project** | Add entry in `content/projects.ts`; consider `featured: true` (and un-feature something else); mention it in `EXTRA_KNOWLEDGE` (`content/ai-knowledge.ts`) if it deserves assistant airtime |
| **New internship / job** | Add to the top of `content/experience.ts`; update the old role's `end`; update hero stats in `config/site.ts` if the numbers changed |
| **Wrote a blog post** | Append to `content/blog/posts.ts` with today's `publishDate` — index, page, sitemap, and assistant update themselves |
| **Added a Q&A entry** | Append to `content/faq/questions.ts` — `/qa`, search, and the homepage preview update themselves |
| **New certificate** | Image into `public/certificates/`, entry into `content/certificates.ts` |
| **New resume version** | Overwrite `public/resume/Thiru-Resume.pdf` (same name = no code change) |
| **Paper published / status changed** | Update `content/research.ts` (`status`, `venue`, `doi`, `citation`), replace `public/research/paper.pdf` |
| **Not available for hire right now** | `config/site.ts` → `available: false` (hides the hero badge and contact banner) |
| **Phone/email changed** | `config/site.ts` — one file, updates everywhere including the terminal and assistant |
| **Learned a new skill** | Right group in `content/skills.ts`, start at `Learning`, promote honestly over time |

## Adding an AI provider

The chain (`frontend/src/lib/ai-providers.ts`) currently tries Gemini →
Groq → OpenRouter in order. To add a fourth (or replace one):

1. Write a `streamXyz(messages)` async generator function following the
   existing `streamGemini`/`streamGroq`/`streamOpenRouter` pattern — for
   any OpenAI-compatible API (most providers are), reuse the shared
   `streamOpenAICompatible()` helper instead of writing a new HTTP client.
2. Add its API key check to `isAiConfigured`.
3. Add it to the `chain` array in `streamAssistant()`, in whatever
   priority order you want it tried.
4. Add the corresponding env var to `.env.example` and
   [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md), and a setup walkthrough
   section to [AI_SETUP.md](AI_SETUP.md) (account creation, key
   generation, free-tier limits, a test `curl` request — match the format
   of the existing three).
5. To swap a model on an *existing* provider instead of adding a new one,
   it's a one-line change — the `GEMINI_MODEL`/`GROQ_MODEL`/
   `OPENROUTER_MODEL` constants at the top of `ai-providers.ts`.

## Updating themes / modes

Color and structural tokens live in `frontend/src/app/globals.css`; the
mode registry in `frontend/src/config/modes.ts`. Full mechanics
(including how to add an entirely new mode) are in
[THEME_GUIDE.md](THEME_GUIDE.md) — the short version for a routine tweak:
find the `[data-mode="…"][data-appearance="…"]` block, change a value,
check its contrast against that mode's background before shipping (see
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#color-palettes)).

## The quarterly 20-minute review

1. **Numbers drift.** Hero stats, "years coding", project counts — bump
   them in `config/site.ts`.
2. **Experience tense.** Is "Present" still true?
3. **Rating feedback.** `/admin` → Ratings — visitors tell you what's
   broken or unclear; act on repeats.
4. **Insights.** Which projects get views? Put your best foot in
   `featured`.
5. **Dependencies.** Dependabot opens grouped weekly PRs automatically
   (`.github/dependabot.yml` — framework/React together, dev tooling
   together); review and merge the ones that pass CI. For anything it
   doesn't catch, `cd frontend && npm outdated` — apply minor updates,
   read release notes for majors, run the full validation trio after.
6. **Security advisories.** CI hard-fails on `critical`-severity `npm
   audit` findings only (see [SECURITY.md](SECURITY.md#whats-intentionally-out-of-scope)
   for why); periodically run `npm audit` without the severity filter
   yourself to see what's accumulating below that bar.
7. **Lighthouse.** Chrome DevTools → Lighthouse on a production build. If
   a score dropped, diff what shipped recently against
   [PERFORMANCE.md](PERFORMANCE.md)'s current bundle-size table.

## Content quality bar (worth keeping)

- Achievements carry numbers ("cut load time 38%"), responsibilities
  carry verbs.
- Blog posts stay short (existing posts run ~80–110 words) — long enough
  to say something, short enough to be read in one sitting.
- Every claim on the site should survive being asked about in an
  interview, because the site *will* come up in interviews.

## Upgrading dependencies

**Routine (patch/minor):** handled by Dependabot's weekly PRs — review the
diff, confirm CI is green, merge.

**Next.js majors:** pin a weekend, read the codemod notes, upgrade on a
branch:

```bash
npx @next/codemod@latest upgrade
npm run lint && npm run type-check && npm run test && npm run build
```

The content layer is plain TypeScript data — framework upgrades almost
never touch it. That's by design.

**React majors** move together with Next.js in Dependabot's grouping
(`next-react` group in `dependabot.yml`) since they need to stay in lock
step.
