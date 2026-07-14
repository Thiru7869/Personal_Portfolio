# Email Setup (Contact Form)

Powers message delivery for the Contact section's form
(`POST /api/contact` → `frontend/src/lib/email.ts`). Two transports, tried
in order:

```
1. SMTP (SMTP_HOST + SMTP_USER + SMTP_PASS all set) — via Nodemailer
2. Web3Forms (WEB3FORMS_ACCESS_KEY) — used if SMTP isn't configured,
   or if a configured SMTP send throws
```

If neither is configured, the form still works — the message is archived to
Supabase (if that's configured) and the visitor sees an honest "saved"
confirmation instead of a fake "sent" one. You don't need both transports;
pick one. Web3Forms is the faster path (no email provider account needed).

---

## Option 1: SMTP with Gmail (recommended if you already have Gmail)

**What it is:** Standard SMTP mail delivery via
[Nodemailer](https://nodemailer.com), authenticated with a Gmail **App
Password** — not your normal Google password (Google blocks plain-password
SMTP login by default).
**Free:** Yes, uses your existing Gmail account.
**Limits:** Gmail SMTP caps at ~500 messages/day for regular accounts —
irrelevant for a portfolio contact form.

**Step-by-step:**

1. **Turn on 2-Step Verification** (required for App Passwords to exist):
   Google Account → [myaccount.google.com/security](https://myaccount.google.com/security)
   → **2-Step Verification** → follow the prompts.
2. **Generate an App Password:**
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   → App name: `portfolio` → **Create**. Google shows a 16-character
   password in four groups of four (like `abcd efgh ijkl mnop`).
3. **Copy it** — remove the spaces when you paste it into `.env.local`.

**Where to paste it:** `frontend/.env.local` →
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=youraddress@gmail.com
SMTP_PASS=abcdefghijklmnop
CONTACT_RECEIVER_EMAIL=youraddress@gmail.com
```
`SMTP_USER` is both the login and the "From" address. `CONTACT_RECEIVER_EMAIL`
is where messages land — set it if you want a different inbox than
`SMTP_USER` (e.g. a `contact@` alias); otherwise it defaults to the `email`
field in `frontend/src/config/site.ts`.

**Verify it works:** submit the contact form on `localhost:3000` with a
real email address you can check, and confirm the message arrives at
`CONTACT_RECEIVER_EMAIL`. There's no separate CLI test for SMTP credentials
in this project — the contact form itself is the test. If you want to
sanity-check credentials before wiring up the UI, this one-liner (Node,
run from `frontend/`) attempts a login without sending anything:
```bash
node -e "require('nodemailer').createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user:'YOUR_EMAIL',pass:'YOUR_APP_PASSWORD'}}).verify().then(()=>console.log('OK')).catch(e=>console.error('FAIL',e.message))"
```

**Common mistakes:**
- Using your real Gmail password instead of an App Password — Google
  rejects it outright, and the error message can be misleadingly generic.
- Forgetting 2-Step Verification is a prerequisite — the App Passwords page
  won't even appear until it's on.
- Leaving spaces in the copied App Password.
- Using a Google **Workspace** account where the admin has disabled
  "less secure app" / App Password access — check with your Workspace
  admin, or use a personal Gmail account instead.
- Any non-Gmail SMTP provider works too (Outlook, a custom domain's mail
  server, etc.) — just set `SMTP_HOST`/`SMTP_PORT` to match and skip the
  App Password step (use whatever auth that provider requires).

---

## Option 2: Web3Forms (no email account required)

**What it is:** A free-tier form-backend service — you get an access key,
POST form data to their API, and they relay it to your inbox by email. No
SMTP setup, no Google account changes.
**Free:** Yes, no credit card.
**Free tier limits:** 250 submissions/month on the free plan (verify
current limits at [web3forms.com](https://web3forms.com) — pricing pages
change).

**Step-by-step:**

1. Go to [web3forms.com](https://web3forms.com).
2. Enter the email address you want submissions delivered to.
3. Click **Create Access Key**. The key is emailed to that address (check
   spam if it doesn't arrive within a minute).
4. Copy the key from the email.

**Where to paste it:** `frontend/.env.local` →
```
WEB3FORMS_ACCESS_KEY=your-access-key-from-the-email
```

**Verify it works:**
```bash
curl -X POST https://api.web3forms.com/submit \
  -H "Content-Type: application/json" \
  -d '{"access_key":"YOUR_KEY","name":"Test","email":"test@example.com","subject":"Test","message":"Verifying my Web3Forms key"}'
```
A working key returns `{"success": true, "message": "Email sent successfully."}`.
Then submit the actual contact form on `localhost:3000` to confirm delivery.

**Common mistakes:**
- Confusing the **access key** (used server-side, what this project needs)
  with a **form embed snippet** Web3Forms also offers for no-code sites —
  this project only needs the key.
- Not checking spam for the initial "here's your key" email.

---

## Choosing between them / using both

This project tries SMTP first if configured, and only falls back to
Web3Forms if SMTP isn't set up or a send fails — so setting both isn't
wasteful, it's a safety net (e.g. Gmail temporarily blocking a login vs.
your Web3Forms quota being exhausted are independent failure modes). For a
personal portfolio, one is genuinely enough; add the second only if you
want the redundancy.

Either way, if Supabase is configured
(see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)), every contact-form submission
is archived to the `contact_messages` table regardless of whether email
delivery succeeded — visible in `/admin`.
