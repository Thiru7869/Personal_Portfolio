<div align="center">

# Thiru — Portfolio

**Thirumala Narasimha Poluru** · Full-Stack Developer · AI & Data Science Enthusiast

A single-page portfolio engineered like a premium SaaS product — **five complete experience
modes** (Professional, Terminal, AI Workspace, Developer Dashboard, Executive) each with light
and dark appearance, a terminal that takes over the entire site, an AI assistant with a
three-provider fallback chain, a blog engine, a Q&A knowledge base, a CMS, first-party
analytics, and a working contact pipeline — all running on **free tiers**.

`Next.js 15` · `React 19` · `TypeScript` · `Tailwind CSS` · `Framer Motion` · `Supabase` · `Node.js`

[Live Site](https://thiru.dev) · [Vercel Deployment](https://personal-portfolio-three-sand-92.vercel.app/) · [Blog](/blog) · [Q&A](/qa) · [GitHub](https://github.com/Thiru7869)

</div>

---

## Overview

This is not a template. Every visible feature demonstrates an engineering skill: the theme
engine shows design-token architecture, the terminal shows systems thinking, the AI assistant
shows responsible LLM integration, and the backend shows validated, rate-limited, gracefully
degrading APIs. The site is content-driven — every word lives in typed data files, separate
from components, so it can be updated without touching UI code.

The visitor should remember **Thiru**, not the framework.

## Feature highlights

| Area | What's inside |
| --- | --- |
| **Experience modes** | 5 complete modes — Professional, Terminal, AI Workspace, Developer Dashboard, Executive — each with light and dark appearance. Modes swap colors, fonts, radii, shadows, spacing, and backdrops via a CSS-variable token layer; Terminal, AI, and Developer replace the entire site with their own takeover shell. |
| **Hero** | Typing animation, a calm living tech-node background, scroll-linked motion, availability + research badges, and CTAs (Hire Me, Resume, Book Meeting, Take a Tour). |
| **Sections** | About + identity grid, interactive terminal, searchable skills, project case studies + every GitHub repo, live GitHub/LeetCode activity, experience timeline, education, research paper, achievements & certifications (Google Drive), What I Build, Now/Learning/Uses/Philosophy, testimonials, FAQ preview, visitor ratings, and first-party insights. |
| **Blog** | Hand-written articles with search, categories, collections, reading series, table of contents, related posts, share, and full SEO. |
| **Q&A** | Conversational answers across several categories, searchable and filterable, with FAQ structured data. |
| **AI assistant** | "Thiru Assistant" — grounded in a compiled knowledge base, Gemini → Groq → OpenRouter failover, markdown, suggested questions, honest degradation. |
| **Command palette** | Ctrl+K — search sections, projects, skills, themes; copy email/phone/GitHub; share; toggle focus mode; start the tour. |
| **Quick Tour** | Spotlight-guided walkthrough of the whole portfolio. |
| **Backend** | Contact (SMTP + Web3Forms fallback), ratings, newsletter, analytics, AI chat, GitHub stats, and an admin CMS — all zod-validated and rate-limited. |
| **Extras** | Custom cursor, scroll progress, confetti moments, magnetic hovers, skeleton loaders, PWA manifest, terminal-styled 404, error boundaries. |

## Architecture

```
Browser
  │
  ├─ Static content sections (React Server Components — zero JS cost)
  ├─ Client islands (terminal, palette, AI chat, ratings — code-split)
  │
  ▼
Next.js API Routes (Node.js / TypeScript)
  ├─ zod validation + per-IP rate limiting on every mutation
  ├─ contact → SMTP (Nodemailer) → Web3Forms fallback → Supabase archive
  ├─ chat → Gemini → Groq → OpenRouter fallback chain
  ├─ ratings / newsletter / analytics / insights
  └─ admin/* → Supabase Auth (token + ADMIN_EMAIL double-check)
  │
  ▼
Supabase PostgreSQL (row-level security; service-role key server-only)
```

**Design principles:** content-as-code (typed data, not hard-coded JSX) · design tokens over
conditionals (7 themes, zero per-component branches) · graceful degradation (every integration
switches off politely when unconfigured) · server-first (interactivity opts in at the leaves).

## Folder structure

```
portfolio/
├── frontend/                 Next.js app (UI + API routes)
│   ├── src/
│   │   ├── app/              Routes: (site) homepage/blog/qa, admin, api, SEO files
│   │   ├── components/       sections · layout · widgets · blog · faq · ui · terminal
│   │   ├── config/           site.ts (personal details) · themes.ts · navigation.ts
│   │   ├── content/          profile · projects · experience · skills · research ·
│   │   │                     certificates · services · datasets · blog/ · faq/ · ai-knowledge
│   │   └── lib/              theme-context · terminal-commands · ai-providers · email ·
│   │                         supabase · rate-limit · analytics · confetti · admin-auth
│   └── public/               resume · research paper · certificates · blog covers
├── backend/supabase/         schema.sql (tables + row-level security)
├── shared/                   types.ts · constants.ts (the content model)
├── docs/                     setup, API, admin, themes, customization, troubleshooting guides
├── scripts/                  generate-assets.mjs (resume/paper/certs/covers)
├── render.yaml               Render deployment blueprint
└── .github/workflows/ci.yml  lint + type-check + build on every push
```

Full map with "where do I edit X?" answers: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md).

## Getting started

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

The site runs with **zero configuration** — features needing API keys switch off gracefully
until you add them. To enable everything, copy `.env.example` to `frontend/.env.local` and
follow [docs/API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md).

### Scripts

```bash
npm run dev          # development server
npm run lint         # ESLint
npm run type-check   # TypeScript (strict)
npm run build        # production build
npm run start        # serve the production build
```

## Environment variables

Copy `.env.example` → `frontend/.env.local`. Every variable is optional; each unlocks one
feature — nothing here is required for the site to build and run. Full variable-by-variable
reference (required/optional, public/secret, what breaks without it):
[docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md). Step-by-step key generation for every
service: [docs/API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md) (or the focused guides —
[SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md), [AI_SETUP.md](docs/AI_SETUP.md),
[EMAIL_SETUP.md](docs/EMAIL_SETUP.md)).

| Feature | Variables |
| --- | --- |
| AI assistant | `GEMINI_API_KEY` (and/or `GROQ_API_KEY`, `OPENROUTER_API_KEY`) |
| Database (ratings, insights, admin, newsletter) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL` |
| Contact email | `SMTP_*` + `CONTACT_RECEIVER_EMAIL`, or `WEB3FORMS_ACCESS_KEY` |
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Vercel Analytics needs no key) |
| SEO/sitemap/OG URLs | `NEXT_PUBLIC_SITE_URL` (defaults to `http://localhost:3000`) |
| Portfolio Insights visibility threshold | `NEXT_PUBLIC_INSIGHTS_MIN_VIEWS` (defaults to `100`) |

## Deployment

**Vercel (recommended).** Push to GitHub → import at vercel.com/new → set **Root Directory to
`frontend`** → add environment variables → Deploy. Full guide: [deployment.md](deployment.md).
Live instance: [personal-portfolio-three-sand-92.vercel.app](https://personal-portfolio-three-sand-92.vercel.app/).

**Render.** The repo ships [`render.yaml`](render.yaml) — New → Blueprint on render.com, point
it at the repo, set the env vars in the dashboard.

**Database.** Create a Supabase project, run `backend/supabase/schema.sql` in the SQL Editor,
create your admin auth user, and set `ADMIN_EMAIL` to match.

## Editing content

Everything visible lives in one typed file — change it once, it updates everywhere (site,
terminal, AI assistant, SEO). Walkthroughs in [docs/CUSTOMIZATION_GUIDE.md](docs/CUSTOMIZATION_GUIDE.md).

| What | File |
| --- | --- |
| Name, contacts, socials, resume, availability | `frontend/src/config/site.ts` |
| About story, identity, now/uses/roadmap | `frontend/src/content/profile.ts` |
| Projects & GitHub repos | `frontend/src/content/projects.ts` |
| Experience · Education · Skills · Research · Certificates | matching files in `frontend/src/content/` |
| Blog articles | `frontend/src/content/blog/articles-*.ts` |
| FAQ / Q&A | `frontend/src/content/faq/faq-*.ts` |
| Themes | `frontend/src/app/globals.css` + `frontend/src/config/themes.ts` |
| Terminal commands | `frontend/src/lib/terminal-commands.ts` |

## Performance · SEO · Accessibility

- **Performance** — static generation for content, code-split client islands, `next/font`,
  `next/image`, dynamic imports for heavy widgets. Targets Lighthouse 95+.
- **SEO** — dynamic metadata, Open Graph, Twitter cards, JSON-LD (Person, WebSite,
  ScholarlyArticle, BlogPosting, FAQPage), auto-generated sitemap, robots, canonicals.
- **Accessibility** — semantic HTML, keyboard paths through every interaction (terminal,
  palette, modals), visible focus, ARIA where HTML runs out, `prefers-reduced-motion` and
  `prefers-contrast` honoured, per-theme contrast checks.

## Documentation

| Guide | Purpose |
| --- | --- |
| [setup.md](setup.md) · [deployment.md](deployment.md) | Install and ship |
| [docs/PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md) · [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md) | How it's built, and how it behaves at runtime |
| [API_REFERENCE.md](API_REFERENCE.md) · [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Endpoints and schema (with ER diagram) |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) · [CONTRIBUTING.md](CONTRIBUTING.md) | Map and conventions |
| [docs/COMPONENT_GUIDE.md](docs/COMPONENT_GUIDE.md) · [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Reusable components and design tokens |
| [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) | Every environment variable: required?, public or secret?, what breaks without it |
| [docs/API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md) | Every API key, beginner-friendly, start to finish |
| [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) | Database + `/admin` login, in depth |
| [docs/AI_SETUP.md](docs/AI_SETUP.md) | Gemini / Groq / OpenRouter, in depth |
| [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md) | Contact-form email delivery, in depth |
| [docs/CUSTOMIZATION_GUIDE.md](docs/CUSTOMIZATION_GUIDE.md) · [docs/THEME_GUIDE.md](docs/THEME_GUIDE.md) | Editing content and modes |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) · [docs/MAINTENANCE.md](docs/MAINTENANCE.md) | CMS and maintenance |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) · [docs/SECURITY.md](docs/SECURITY.md) | Current bundle numbers, and the full security posture |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | When something breaks |
| [CHANGELOG.md](CHANGELOG.md) | What shipped in each version |

## Future roadmap

- Real certificate scans and a designed resume PDF (placeholders ship generated)
- Cloud/DevOps project repos as they're built out
- Optional MDX authoring for the blog
- i18n for regional reach

## Author

**Thirumala Narasimha Poluru (Thiru)** — Bengaluru, India
[GitHub](https://github.com/Thiru7869) · [LinkedIn](https://www.linkedin.com/in/poluru-thirumala-narasimha-23775926b/) · [X](https://x.com/Thiru06765700) · [LeetCode](https://leetcode.com/u/thiru7869/) · reddytn4@gmail.com

## Contributing

Personal project — issues and suggestions welcome. Code style and workflow in
[CONTRIBUTING.md](CONTRIBUTING.md); all changes must pass `lint`, `type-check`, and `build`.

## License

Code structure is free to learn from. Content (text, resume, research, images) is
© Thirumala Narasimha Poluru.
