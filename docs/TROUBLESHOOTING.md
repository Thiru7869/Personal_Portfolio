# Troubleshooting Guide

Symptoms → causes → fixes, ordered by how often they actually happen.

## Build & install

**`npm install` fails or hangs**
Check `node --version` (need 18.18+). Delete `frontend/node_modules` and
`frontend/package-lock.json`, run `npm install` again. Corporate
proxy/VPN? `npm config get registry` should be `https://registry.npmjs.org/`.

**`npm run build` fails with a type error in a content file**
Working as designed — the content model caught a mistake. Read the error's
last line: it names the property and expected type. Common ones: a missing
comma, a `date` not in `YYYY-MM-DD`, a `level` string that isn't one of the
four allowed values.

**Build fails downloading Google Fonts**
`next/font` fetches Inter/Sora/JetBrains Mono at build time. If you build
offline, connect once (fonts cache afterward) or temporarily swap to system
fonts in `src/app/layout.tsx`.

## Runtime

**Site loads but ratings/insights say "warming up" or "offline"**
Supabase env vars are missing or wrong. Check all four (URL, anon key,
service key, ADMIN_EMAIL) in `.env.local` (restart dev) or Vercel
(redeploy). Also: free Supabase projects pause after ~a week idle — open
the Supabase dashboard and hit "Restore".

**AI assistant says providers aren't configured**
No AI key is set. Add at least `GEMINI_API_KEY`. On Vercel, confirm the
variable exists in the *Production* environment, then redeploy.

**AI assistant replies with a rate-limit message**
Per-IP limit is 20 chats / 10 min (change in `shared/constants.ts`).
If it's the *provider* rate-limiting instead, the chain should fail over —
seeing it means every configured provider is exhausted; add a second key
(Groq is the quickest to obtain).

**Contact form: visitor sees an error**
- 400 → validation; the message names the field.
- 429 → 3 messages / 10 min / IP exceeded.
- 502 → no delivery channel worked. Check SMTP values (Gmail App
  Password without spaces, port 465), or add `WEB3FORMS_ACCESS_KEY` as a
  net. Messages are archived to Supabase even when email fails — check
  `/admin`.

**Emails deliver but land in spam**
Normal for a fresh Gmail SMTP sender. Mark one as "not spam"; for a custom
domain set up SPF/DKIM with your DNS provider.

**`/admin` login fails**
"Invalid login credentials" → the auth user doesn't exist or wrong
password (Supabase → Authentication → Users). Signing in works but data
calls return 403 → `ADMIN_EMAIL` doesn't exactly match the auth user's
email.

**Mode/appearance flashes or resets**
The inline no-flash script (`themeInitScript` in `lib/theme-context.tsx`)
must run before paint — if you edited `layout.tsx`, ensure the
`<script dangerouslySetInnerHTML…>` stayed in `<head>`. A mode or
appearance "resetting" usually means localStorage was cleared, or the id
was removed from `MODE_IDS`/`APPEARANCE_IDS` in `shared/constants.ts`.

**Hydration warning in the console**
Almost always introduced by rendering something time/random-dependent
during SSR. Pattern used in this codebase: compute in `useEffect`, or keep
the component client-only via `SiteWidgets`' dynamic imports. Find the
exact component named in the warning and check what differs server vs
client.

## Vercel-specific

**Deploy succeeds, site 404s**
Root Directory isn't set to `frontend`. Project → Settings → General →
Root Directory → `frontend` → redeploy.

**Works locally, broken in production**
90% env vars: they must be re-declared in Vercel, and `NEXT_PUBLIC_*` ones
require a *redeploy* to be baked in. Check Vercel → Deployments → the
build's logs, then Functions logs for runtime errors.

**API routes slow (~300ms extra)**
Function region is far from your Supabase region. Settings → Functions →
set the region next to your database.

## Performance

**Lighthouse dropped below 95**
- New images without `next/image` or missing dimensions → CLS.
- A heavy library imported at page level → check `npm run build` first-load
  JS; move it behind `next/dynamic`.
- Third-party scripts added outside `next/script` → move them in.

## Still stuck

Reproduce with `npm run dev`, read the terminal (server errors) and the
browser console (client errors) — between those two, the answer is almost
always printed. Failing that, search the exact error message; Next.js
errors link to their own docs pages.
