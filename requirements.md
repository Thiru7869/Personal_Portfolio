# Requirements — What This Portfolio Implements

The feature specification this project was built against, and where each
requirement lives in the code. This is a point-in-time checklist, not a
live reference — exact counts (posts, questions, etc.) drift as content is
added; for current specifics see [README.md](README.md) and the guides in
[docs/](docs/).

## Core

- [x] Single-page portfolio — all content sections on `/`; only Blog, Q&A,
  Admin, auth, and APIs are separate routes
- [x] Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS + Framer Motion
- [x] Node.js backend via Next.js API routes
- [x] Supabase PostgreSQL + Supabase Auth
- [x] Free-tier compatible end to end (Vercel, Supabase, Gemini/Groq, Web3Forms, Cloudinary-ready)

## Sections (homepage, in order)

| Section | Component | Highlights |
| --- | --- | --- |
| Hero | `sections/Hero.tsx` | Typing animation, mouse-parallax lighting, 3D tilt code panel, scroll-linked fade, availability badge, research badge, stats, Resume / Hire Me / Book Meeting, GitHub / LinkedIn / Email |
| About | `sections/About.tsx` | Human-written story: journey, goals, personality, interests, research, objectives |
| Terminal | `sections/Terminal.tsx` | Parrot-OS-inspired, centered, 30+ commands, Tab autocomplete (double-Tab lists), ↑/↓ history, "did you mean", theme switching, Ctrl+L |
| Skills | `sections/Skills.tsx` | 7 animated groups; every skill links to Wikipedia; level legend |
| Projects | `sections/Projects.tsx` | Featured cards, quick-view modal with problem / solution / architecture / challenges / learnings, GitHub / demo / case study |
| Experience | `sections/Experience.tsx` | Animated timeline, responsibilities + achievements per role |
| Education | `sections/Education.tsx` | Institution, location, degree, stream, duration, description — no GPA |
| Research | `sections/Research.tsx` | Publication, abstract, contributions, download, one-click citation copy; badged in hero + terminal + AI |
| Certificates | `sections/Certificates.tsx` | Gallery, fullscreen preview, download, verify link |
| What I Build | `sections/Services.tsx` | Services renamed as required |
| Testimonials | `sections/Testimonials.tsx` | Minimal, three quotes |
| Rating | `sections/Rating.tsx` | Interactive 5-star + feedback, live average + distribution from Supabase |
| Insights | `sections/Insights.tsx` | Visitors, downloads, countries, devices, top projects — animated charts |
| Contact | `sections/Contact.tsx` | Working form (SMTP → Web3Forms → archive), WhatsApp/GitHub/LinkedIn/Instagram/Email/Phone, Google Maps, availability |
| Footer | `layout/Footer.tsx` | Dynamic year, quick links, socials |

## Global features

- [x] **Five experience modes × light/dark appearance** — Professional
  (default), Terminal, AI Workspace, Developer Dashboard, Executive —
  swapping colors, fonts, radii, shadows, spacing, cards, buttons, navbar,
  footer, background, terminal, and scrollbars via CSS-variable tokens.
  Current details: [docs/THEME_GUIDE.md](docs/THEME_GUIDE.md).
- [x] **Command palette** — Ctrl+K; searches sections, commands, projects,
  skills, experience, education, themes, AI, resume, navigation
- [x] **AI assistant** — "Thiru Assistant", floating bottom-right,
  Linux-flavoured, grounded in a compiled knowledge base, Gemini → Groq →
  OpenRouter fallback, markdown + code formatting, history, suggested
  questions, typing indicator
- [x] **Startup popup** — boot-log style initialization (no "Welcome/Hello"),
  once per session, skippable, reduced-motion aware
- [x] **Back to top** — above the chat bubble, scroll-progress ring, animated
- [x] **Blog** — 12 posts, 200–250 words each, separate pages, SEO metadata,
  JSON-LD, prev/next
- [x] **Q&A** — 20 interview-quality answers, 200–250 words each, separate
  pages, FAQ structured data, categories
- [x] **Admin CMS** at `/admin` — Supabase Auth sign-in, overview stats,
  message inbox (read/delete), rating moderation, Content Studio mapping
  every content domain to its file

## Quality gates

- [x] Animations: Framer Motion, 2D + 3D tilt, parallax, scroll, hover,
  micro-interactions, page transitions, loading skeletons
- [x] Responsive: mobile / tablet / laptop / desktop
- [x] Accessibility: WCAG-AA-oriented — keyboard everywhere, focus-visible
  styles, ARIA roles/labels, skip link, `prefers-reduced-motion`,
  `prefers-contrast` support, screen-reader text
- [x] Performance: static generation for all content pages, code-split
  widgets, `next/font`, `next/image`, minimal first-load JS
- [x] Security: zod validation on every route, per-IP rate limiting,
  honeypot, security headers, RLS-locked tables, error boundaries,
  admin double-check (token + email)
- [x] SEO: dynamic metadata, Open Graph image (generated), Twitter cards,
  JSON-LD (Person, WebSite, ScholarlyArticle, BlogPosting, FAQPage),
  sitemap, robots, canonicals
- [x] Analytics: Vercel Analytics + optional GA4 + first-party insights

## Validation status

`npm run lint`, `npm run type-check`, and `npm run build` all pass; the dev
server runs without console errors or hydration warnings. See the CI
workflow in `.github/workflows/ci.yml` which enforces this on every push.
