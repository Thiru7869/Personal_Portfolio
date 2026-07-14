# Deployment Guide — Vercel & Render (Free Tier)

Deploying this portfolio to production, free tier end to end. Everything below
runs on services with a genuinely free plan — no paid upgrade is required for
any core feature.

## Free-tier stack at a glance

| Concern | Service | Free-tier notes |
| --- | --- | --- |
| Frontend + API routes | **Vercel** (Hobby) | Static pages + serverless functions; auto-deploy from GitHub. Primary target. |
| Alternative host | **Render** (Free web service) | `render.yaml` included. Spins down when idle (~30s cold start). |
| Database | **Supabase** (Free) or **Neon** | PostgreSQL + auth + row-level security. Pauses after ~1 week idle. |
| AI assistant | **Gemini** → **Groq** → **OpenRouter** free models | Streaming, with automatic failover. Per-IP rate limiting keeps usage tiny. |
| Contact email | **Gmail SMTP** or **Web3Forms** | App Password (SMTP) or a free Web3Forms access key. |
| GitHub / LeetCode stats | **GitHub API** (unauthenticated) + public LeetCode card | Cached 1h server-side to stay well under rate limits. |
| Resume / Meeting | **Google Drive** + **Google Forms** | Already wired to the owner's links. |

**The site builds and runs with zero environment variables** — every feature
that needs a key degrades to a friendly "not configured" state instead of
breaking. Add keys to switch features on.

### Rate limits & free-tier caveats

- **Gemini free tier**: generous RPM; the fallback chain covers momentary limits.
- **Groq / OpenRouter free models**: rate-limited but sufficient for a portfolio; used only when Gemini is unavailable.
- **Supabase free**: 500 MB DB, project pauses when idle — first request after a pause is slow (design already handles this via graceful loading states).
- **Render free**: service sleeps after 15 min idle (~30s wake). Vercel has no such sleep, which is why it's the recommended host.
- **GitHub unauthenticated API**: 60 req/hr — the `/api/github` route caches for an hour, so this is never hit in practice.

### Recommended production configuration

- Host the Next.js app on **Vercel**, database on **Supabase**, both in a region near your users (e.g. Mumbai `bom1`).
- Set `GEMINI_API_KEY` (primary) plus at least one fallback (`GROQ_API_KEY`).
- Use **Web3Forms** for contact email if you'd rather not manage a Gmail App Password.
- Turn on **Vercel Analytics** (free) in the dashboard.
- Everything else can stay unset until you need it.

## One-time setup

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio v1"
git branch -M main
git remote add origin https://github.com/<you>/portfolio.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import the `portfolio` repository.
3. **Set Root Directory to `frontend`** — this is the one setting people
   miss. Framework preset: Next.js (auto-detected). Leave build settings
   default.

### 3. Add environment variables

Vercel → Project → **Settings → Environment Variables**. Add everything
from your `.env.local` (see [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)),
plus:

```
NEXT_PUBLIC_SITE_URL = https://<your-domain>
```

Add each variable to **Production** and **Preview**. Never commit
`.env.local` itself — it's gitignored for a reason.

### 4. Deploy

Click **Deploy**. First build takes ~2 minutes. Every future `git push`
to `main` deploys production automatically; every push to any other branch
creates a preview URL.

### 5. Custom domain (optional)

Project → **Settings → Domains** → add your domain and follow the DNS
instructions. Then update `NEXT_PUBLIC_SITE_URL` to the final domain and
redeploy (it feeds the sitemap, canonical URLs, and Open Graph tags).

### 6. Region (recommended)

Project → **Settings → Functions → Region** — pick the region closest to
your Supabase project (e.g. Mumbai/`bom1` if your database is in Mumbai)
so API routes aren't paying intercontinental latency.

### 7. Turn on Vercel Analytics

Project → **Analytics** → Enable. The `@vercel/analytics` component is
already wired in the code; enabling it in the dashboard starts collection.

## Deploy commands (CLI alternative)

```bash
npm i -g vercel
cd frontend
vercel          # first run: link project, creates a preview
vercel --prod   # production deploy
```

## Post-deploy checklist

- [ ] Homepage loads and the boot popup plays
- [ ] All five modes + light/dark switch (navbar controls)
- [ ] Terminal responds to `help` and `sudo hire thiru`
- [ ] Contact form delivers to your inbox (check spam the first time)
- [ ] AI assistant answers (needs at least one AI key)
- [ ] Rating submits and the average updates (needs Supabase)
- [ ] `/admin` sign-in works with your Supabase auth user
- [ ] `https://<domain>/sitemap.xml` and `/robots.txt` respond
- [ ] Share the URL in a WhatsApp/Slack message — the Open Graph card renders
- [ ] Run Lighthouse in Chrome DevTools (aim: 95+ across the board)
- [ ] Submit the sitemap in [Google Search Console](https://search.google.com/search-console)

## Keeping the free tier happy

- **Supabase pauses after ~1 week of inactivity.** Visiting the site wakes
  it (first request is slow). For zero cold starts, add an external uptime
  ping (e.g. cron-job.org hitting `/api/rating` every 6 hours).
- **AI keys**: Gemini and Groq free tiers are generous for a portfolio;
  the fallback chain plus per-IP rate limiting keeps usage tiny.
- **Vercel**: a portfolio sits far below the free Hobby limits.
