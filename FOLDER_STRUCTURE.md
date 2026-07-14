# Folder Structure Guide

A complete map of the repository and — more importantly — **where to make
every kind of future update**. This is the project's structure/organization
reference — every major folder's responsibility and the file-organization
rules that keep it maintainable (see the last section). For *why* it's
shaped this way, see [docs/PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md).

```
portfolio/
├── frontend/                        # The Next.js application
│   ├── public/
│   │   ├── certificates/            # Certificate images (SVG/PNG/JPG)
│   │   ├── resume/Thiru-Resume.pdf  # ← replace with your real resume
│   │   └── research/paper.pdf       # ← replace with your published paper
│   ├── src/
│   │   ├── app/                     # Routes (App Router)
│   │   │   ├── (site)/              # Public site (navbar/footer/widgets)
│   │   │   │   ├── page.tsx         # THE single-page homepage (section order)
│   │   │   │   ├── blog/            # /blog index + /blog/[slug]
│   │   │   │   ├── qa/              # /qa — one rich page
│   │   │   │   └── loading.tsx      # Skeleton loader for route changes
│   │   │   ├── admin/               # /admin CMS (own chrome, noindex)
│   │   │   ├── api/                 # Backend endpoints — see docs/API_REFERENCE.md
│   │   │   │   ├── contact/         # POST — contact form
│   │   │   │   ├── rating/          # GET/POST — visitor ratings
│   │   │   │   ├── newsletter/      # POST — footer email signup
│   │   │   │   ├── chat/            # POST — AI assistant
│   │   │   │   ├── track/           # POST — first-party analytics
│   │   │   │   ├── insights/        # GET — aggregated insights
│   │   │   │   ├── github/          # GET — cached public GitHub profile stats
│   │   │   │   └── admin/           # messages + ratings moderation (auth)
│   │   │   ├── layout.tsx           # Root layout: fonts, SEO, analytics
│   │   │   ├── globals.css          # ★ ALL light/dark + 5 modes live here
│   │   │   ├── sitemap.ts           # Auto-includes blog slugs
│   │   │   ├── robots.ts            # robots.txt
│   │   │   ├── manifest.ts          # PWA manifest
│   │   │   ├── opengraph-image.tsx  # Social share image (generated)
│   │   │   ├── icon.svg             # Favicon
│   │   │   ├── not-found.tsx        # 404 (terminal-styled)
│   │   │   ├── error.tsx            # Route error boundary
│   │   │   └── global-error.tsx     # Last-resort error boundary
│   │   ├── components/
│   │   │   ├── boot/                # BootSequence — cinematic startup
│   │   │   ├── layout/              # Navbar, Footer, ThemeSwitcher, Logo,
│   │   │   │                        #   CustomCursor, SectionBackdrop
│   │   │   │   └── backdrops/       # Per-section background primitives
│   │   │   ├── illustrations/       # Generative SVG/CSS illustrations
│   │   │   ├── sections/            # One file per homepage section
│   │   │   ├── widgets/             # AiAssistant, CommandPalette, SiteWidgets
│   │   │   └── ui/                  # Reveal, TiltCard, SectionHeading, StatImage
│   │   ├── config/                  # ★ EDIT THESE FOR PERSONAL DETAILS
│   │   │   ├── site.ts              # Name, contacts, socials, resume, stats
│   │   │   ├── modes.ts             # Experience-mode registry (5 modes)
│   │   │   └── navigation.ts        # Navbar + footer links
│   │   ├── content/                 # ★ EDIT THESE FOR CONTENT
│   │   │   ├── profile.ts           # About paragraphs, hero typing lines
│   │   │   ├── projects.ts          # Projects (cards + modal + terminal)
│   │   │   ├── experience.ts        # Internships & work
│   │   │   ├── education.ts         # Education entries
│   │   │   ├── skills.ts            # Skill groups w/ Wikipedia links
│   │   │   ├── blog/                # blog posts (posts.ts) + index
│   │   │   ├── faq/                 # FAQs (questions.ts) + index
│   │   │   ├── datasets.ts          # Quotes, tips, principles, stats
│   │   │   ├── certificates.ts      # Certificates + achievements
│   │   │   ├── testimonials.ts      # Testimonials
│   │   │   ├── services.ts          # "What I Build" cards
│   │   │   ├── research.ts          # Research paper details
│   │   │   └── ai-knowledge.ts      # Assistant knowledge (auto-compiled)
│   │   └── lib/
│   │       ├── terminal-commands.ts # ★ Terminal command registry
│   │       ├── ai-providers.ts      # Gemini → Groq → OpenRouter chain
│   │       ├── email.ts             # SMTP + Web3Forms delivery
│   │       ├── supabase.ts          # DB clients (graceful when unset)
│   │       ├── admin-auth.ts        # Admin API guard
│   │       ├── rate-limit.ts        # Per-IP rate limiting
│   │       ├── validation.ts        # Shared zod schemas for every API route
│   │       ├── analytics.ts         # First-party event tracker
│   │       ├── theme-context.tsx    # Experience (mode+appearance) provider
│   │       └── utils.ts             # cn, scrollToSection, formatDate
│   ├── package.json
│   ├── tailwind.config.ts           # Semantic color tokens (reads CSS vars)
│   ├── next.config.ts               # Security headers, image hosts
│   └── tsconfig.json
├── backend/
│   ├── supabase/schema.sql          # ★ Database schema + RLS (run in Supabase)
│   └── README.md
├── shared/
│   ├── types.ts                     # ★ Content model — add new fields here first
│   ├── constants.ts                 # Section ids, mode/appearance ids, rate limits
│   └── README.md
├── docs/                            # All long-form guides
├── scripts/generate-assets.mjs      # Regenerates resume/paper/cert stand-ins
├── .github/workflows/ci.yml         # Lint + type-check + build on push
├── .vscode/                         # Editor settings + extensions
├── .env.example                     # Every env var, documented
└── README.md
```

## "Where do I edit…?" cheat sheet

| I want to update… | Edit this |
| --- | --- |
| Projects | `frontend/src/content/projects.ts` |
| Internships / Experience | `frontend/src/content/experience.ts` |
| Education | `frontend/src/content/education.ts` |
| Blogs | `frontend/src/content/blog/posts.ts` (page appears automatically) |
| Q&A | `frontend/src/content/faq/questions.ts` (page appears automatically) |
| Certificates | `frontend/src/content/certificates.ts` + image in `frontend/public/certificates/` |
| Research paper | `frontend/src/content/research.ts` + PDF in `frontend/public/research/` |
| Skills | `frontend/src/content/skills.ts` |
| Testimonials | `frontend/src/content/testimonials.ts` |
| Modes & appearance | `frontend/src/app/globals.css` (tokens) + `frontend/src/config/modes.ts` (registry) |
| Navigation | `frontend/src/config/navigation.ts` |
| Social links | `frontend/src/config/site.ts` (`socialLinks`) |
| Contact information | `frontend/src/config/site.ts` |
| Resume | replace `frontend/public/resume/Thiru-Resume.pdf`, path in `site.ts` |
| AI knowledge | `frontend/src/content/ai-knowledge.ts` (`EXTRA_KNOWLEDGE`) |
| Terminal commands | `frontend/src/lib/terminal-commands.ts` (`COMMANDS`) |
| Theme tokens (spacing/shadows/fonts) | `frontend/tailwind.config.ts` |
| Section order on homepage | `frontend/src/app/(site)/page.tsx` |
| Rate limits | `shared/constants.ts` |
| Database tables | `backend/supabase/schema.sql` |

## Architecture rules that keep this maintainable

1. **Content is code.** Sections never hard-code text; they render from
   `src/content/`. TypeScript validates every edit at build time.
2. **Types first.** New fields start in `shared/types.ts`, then flow into
   content files and components.
3. **Themes are CSS variables.** Components use semantic classes
   (`bg-card`, `text-mute`); they never know a hex code.
4. **APIs degrade gracefully.** Every integration checks its env vars and
   turns itself off politely instead of crashing.
5. **Server code stays server-side.** Secrets are only read in `app/api/`
   and `lib/` server modules — never in components.
