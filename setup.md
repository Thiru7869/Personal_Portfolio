# Setup Guide — Local Installation

Get the portfolio running on your machine from zero. Time required: about
five minutes without API keys, about thirty with everything connected.

## 1. Prerequisites

- **Node.js 18.18+** (Node 20 or 24 recommended) — check with `node --version`
- **npm 9+** — comes with Node
- **Git** (optional but recommended)

## 2. Install

```bash
cd frontend
npm install
```

## 3. Run

```bash
npm run dev
```

Open http://localhost:3000. You should see the boot popup, then the site.

**That's it for a working site.** Everything below is optional wiring.

## 4. Environment variables (optional features)

Copy the template:

```bash
# from the repo root
copy .env.example frontend\.env.local     # Windows
cp .env.example frontend/.env.local       # macOS/Linux
```

Then fill in only what you want:

| Feature you want | Variables you need |
| --- | --- |
| AI assistant | `GEMINI_API_KEY` (and/or `GROQ_API_KEY`, `OPENROUTER_API_KEY`) |
| Ratings + Insights + Admin | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL` |
| Contact form email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_RECEIVER_EMAIL` (or just `WEB3FORMS_ACCESS_KEY`) |
| Google Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |

Step-by-step instructions for obtaining every key:
[docs/API_KEYS_SETUP.md](docs/API_KEYS_SETUP.md). Full variable reference:
[docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md).

Restart `npm run dev` after changing `.env.local`.

## 5. Set up the database (for ratings, insights, contact archive, admin)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `backend/supabase/schema.sql`,
   and run it.
3. In **Authentication → Users → Add user**, create your admin account
   (email + password). Put the same email in `ADMIN_EMAIL`.
4. Copy the URL and keys from **Project Settings → API** into `.env.local`.

## 6. Make it yours

1. `frontend/src/config/site.ts` — your name, email, phone, socials, links.
2. `frontend/src/content/` — your projects, story, experience, education.
3. Replace `frontend/public/resume/Thiru-Resume.pdf` with your resume and
   `frontend/public/research/paper.pdf` with your paper.
4. Drop your certificate scans into `frontend/public/certificates/` and
   update `frontend/src/content/certificates.ts`.

Full walkthrough: [docs/CUSTOMIZATION_GUIDE.md](docs/CUSTOMIZATION_GUIDE.md).

## 7. Verify everything

```bash
npm run lint
npm run type-check
npm run build
```

All three must pass cleanly. If they don't, see
[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).
