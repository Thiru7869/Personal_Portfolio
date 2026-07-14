# API Keys Setup (Complete Walkthrough)

Every external service this portfolio can use, set up top to bottom. None
are required — the site builds and runs with zero of them, and each one
unlocks exactly one feature. Budget ~5 minutes per service you want.

After each section, put the value into `frontend/.env.local` (copy it from
[`.env.example`](../.env.example) first if you haven't) and restart
`npm run dev`.

This file is the fast, linear path through every service. For more depth
on the three biggest ones, see the dedicated guides:
[SUPABASE_SETUP.md](SUPABASE_SETUP.md), [AI_SETUP.md](AI_SETUP.md),
[EMAIL_SETUP.md](EMAIL_SETUP.md). The full variable-by-variable reference
(including what's required vs. optional and public vs. secret) is
[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## 1. Supabase — database + admin login

**Unlocks:** visitor ratings, Portfolio Insights, contact-message archive,
newsletter signups, `/admin`.
**Free:** yes, no card required. **Limits:** 500 MB database, projects
pause after 7 days idle (one click to resume, no data loss).

1. [supabase.com](https://supabase.com) → **Start your project** → sign in.
2. **New project** → name it, set a database password (save it), pick a
   region → **Create** → wait ~2 minutes.
3. **SQL Editor** → **New query** → paste all of
   [`backend/supabase/schema.sql`](../backend/supabase/schema.sql) → **Run**.
4. **Authentication → Users → Add user** → your email + a password (this
   is your `/admin` login).
5. **Project Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret, server only)
6. Set `ADMIN_EMAIL` to the email from step 4.

**Verify:** submit a rating on the homepage → it should succeed (not show
an "offline" card) → check it appears in Supabase → **Table Editor** →
`ratings`. Full details, including how RLS keeps the public key safe:
[SUPABASE_SETUP.md](SUPABASE_SETUP.md).

---

## 2. Gemini — AI assistant, primary provider

**Unlocks:** working answers from the AI assistant / AI Workspace mode.
**Free:** yes, no card required. **Limits:** per-minute and per-day request
caps on the free tier — plenty for a portfolio; current numbers at
[ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits).

1. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → sign
   in with any Google account.
2. **Create API key** → pick/create a project → copy the key (starts `AIza`).
3. Set `GEMINI_API_KEY`.

**Verify:**
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"say ok"}]}]}'
```
Full details: [AI_SETUP.md](AI_SETUP.md).

---

## 3. Groq — AI assistant, fallback #1

**Unlocks:** a fast fallback if Gemini is unset, fails, or rate-limits.
**Free:** yes. **Limits:** per-minute/per-day caps, current numbers at
[console.groq.com/docs/rate-limits](https://console.groq.com/docs/rate-limits).

1. [console.groq.com](https://console.groq.com) → sign up.
2. **API Keys** → **Create API Key** → copy it **immediately** (shown once).
3. Set `GROQ_API_KEY`.

**Verify:**
```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"say ok"}]}'
```
Full details: [AI_SETUP.md](AI_SETUP.md).

---

## 4. OpenRouter — AI assistant, fallback #2 (optional)

**Unlocks:** a third fallback, pinned to a free model (no billing needed).
**Free:** yes, for the `:free`-suffixed model this app uses.

1. [openrouter.ai](https://openrouter.ai) → sign in.
2. Avatar → **Keys** → **Create Key** → copy it (starts `sk-or-v1-`).
3. Set `OPENROUTER_API_KEY`.

**Verify:**
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"meta-llama/llama-3.3-70b-instruct:free","messages":[{"role":"user","content":"say ok"}]}'
```
Full details: [AI_SETUP.md](AI_SETUP.md).

---

## 5. Gmail SMTP — contact form email, option A

**Unlocks:** contact-form messages delivered straight to your inbox.
**Free:** yes, uses your existing Gmail account.

1. Turn on **2-Step Verification**:
   [myaccount.google.com/security](https://myaccount.google.com/security).
2. [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   → name it `portfolio` → **Create** → copy the 16-character password.
3. Set:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=youraddress@gmail.com
   SMTP_PASS=<16-char app password, no spaces>
   CONTACT_RECEIVER_EMAIL=youraddress@gmail.com
   ```

**Verify:** submit the contact form on `localhost:3000` and check your
inbox. Full details: [EMAIL_SETUP.md](EMAIL_SETUP.md).

---

## 6. Web3Forms — contact form email, option B (no email account needed)

**Unlocks:** contact-form delivery without touching Gmail/SMTP at all. Used
automatically as a fallback if SMTP isn't configured or fails.
**Free:** yes. **Limits:** 250 submissions/month on the free plan (verify
current limits at [web3forms.com](https://web3forms.com)).

1. [web3forms.com](https://web3forms.com) → enter your email → **Create
   Access Key** → the key arrives by email (check spam).
2. Set `WEB3FORMS_ACCESS_KEY`.

**Verify:**
```bash
curl -X POST https://api.web3forms.com/submit -H "Content-Type: application/json" \
  -d '{"access_key":"YOUR_KEY","name":"Test","email":"test@example.com","subject":"Test","message":"hi"}'
```
Full details: [EMAIL_SETUP.md](EMAIL_SETUP.md).

---

## 7. Google Analytics (optional)

**Unlocks:** GA4 pageview tracking, in addition to this project's own
first-party analytics (which needs no external service — see below).
**Free:** yes.

1. [analytics.google.com](https://analytics.google.com) → **Admin** →
   **Create property** → Web platform → follow the wizard.
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`) from **Data Streams** →
   your stream.
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`. GA's script tags only load when
   this is set — leave it unset to skip GA entirely.

**Verify:** open the deployed (or `localhost`) site with the GA Realtime
report open in another tab — your visit should appear within ~30 seconds.

---

## Services that need no setup at all

- **Vercel Analytics** — already wired into `app/layout.tsx`. Nothing to
  configure locally; it activates automatically when the app runs on
  Vercel and no-ops elsewhere.
- **GitHub stats** (Activity section, Developer Dashboard) — call GitHub's
  public unauthenticated REST API and free public badge services
  (`ghchart.rshah.org`, `leetcard.jacoblin.cool`,
  `github-readme-streak-stats.herokuapp.com`). No account, no token. Your
  GitHub username is just a plain string in
  `frontend/src/config/site.ts` (`githubUsername`).
- **This project's own first-party analytics** (the "Portfolio Insights"
  section) — runs entirely through `POST /api/track` into your own
  Supabase `analytics_events` table. Setting up Supabase (§1) is all it
  needs; it's not a separate external service.

## Final checklist

| Variable(s) | Feature | Done? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Correct SEO/sitemap/OG URLs | ☐ |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL` | Database + `/admin` | ☐ |
| `GEMINI_API_KEY` (and/or `GROQ_API_KEY`, `OPENROUTER_API_KEY`) | AI assistant | ☐ |
| `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS` + `CONTACT_RECEIVER_EMAIL` (or `WEB3FORMS_ACCESS_KEY`) | Contact form email | ☐ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | ☐ |
| `NEXT_PUBLIC_INSIGHTS_MIN_VIEWS` | Tune when Portfolio Insights goes public (optional, has a default) | ☐ |
