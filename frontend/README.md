# frontend/

The Next.js 15 application — UI, API routes, and all content.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint         # ESLint
npm run type-check   # tsc --noEmit (strict)
npm run build        # production build
npm run start        # serve the build
```

## Orientation

| Folder | Responsibility |
| --- | --- |
| `src/app/` | Routes: `(site)` public pages, `admin/` CMS, `api/` backend endpoints, plus SEO files (sitemap, robots, OG image) |
| `src/components/sections/` | One component per homepage section |
| `src/components/layout/` | Navbar, footer, theme switcher, popup, back-to-top |
| `src/components/widgets/` | AI assistant, command palette (code-split) |
| `src/components/ui/` | Reveal, TiltCard, SectionHeading primitives |
| `src/config/` | **Edit me:** personal details, themes registry, navigation |
| `src/content/` | **Edit me:** all visible content (typed) |
| `src/lib/` | Terminal commands, AI chain, email, Supabase, rate limiting, theme context, analytics |
| `public/` | Resume PDF, research PDF, certificate images |

Content editing walkthroughs: [../docs/CUSTOMIZATION_GUIDE.md](../docs/CUSTOMIZATION_GUIDE.md).
Environment variables: [../docs/ENVIRONMENT_SETUP.md](../docs/ENVIRONMENT_SETUP.md).

Imports use two aliases: `@/*` → `frontend/src/*` and `@shared/*` →
`../shared/*` (types and constants shared with backend concerns).
