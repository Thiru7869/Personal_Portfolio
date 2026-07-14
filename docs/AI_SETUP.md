# AI Provider Setup

Powers the **Thiru Assistant** floating chat widget and the full-page **AI
Workspace** mode. Both share one streaming chain, defined in
`frontend/src/lib/ai-providers.ts`:

```
1. Gemini   (GEMINI_API_KEY)      — gemini-2.0-flash
2. Groq     (GROQ_API_KEY)        — llama-3.3-70b-versatile
3. OpenRouter (OPENROUTER_API_KEY) — meta-llama/llama-3.3-70b-instruct:free
```

Each provider is tried **only if its key is set**, in that order. If a
configured provider errors out before sending any text, the chain silently
falls through to the next one — the assistant's personality lives in a
shared system prompt (`frontend/src/content/ai-knowledge.ts`), so the voice
doesn't change between providers. You only need **one** of the three keys
for the assistant to work; all three is just extra redundancy.

If none are set, `isAiConfigured` (in `ai-providers.ts`) is `false` and the
chat UI shows a friendly "the assistant isn't configured yet" message
instead of erroring.

---

## 1. Gemini (`GEMINI_API_KEY`) — try this one first

**What it is:** Google's Gemini API, called directly via REST (no SDK). This
app uses `gemini-2.0-flash`.
**Free:** Yes — Google AI Studio issues API keys on a free tier with no
credit card required.
**Free tier limits (subject to change — verify current numbers at the link
below):** a per-minute request cap, a per-minute token cap, and a per-day
request cap, all scoped per model. For `gemini-2.0-flash` this is generous
enough for a portfolio's traffic. Check current numbers:
[ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits).

**Create an account:**
1. Go to [aistudio.google.com](https://aistudio.google.com).
2. Sign in with any Google account (no separate signup).

**Generate the key:**
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Click **Create API key**.
3. Choose an existing Google Cloud project or let it create one for you.
4. Copy the key immediately — it starts with `AIza`.

**Where to paste it:** `frontend/.env.local` →
```
GEMINI_API_KEY=AIza...your-key
```

**Verify it works** (replace `YOUR_KEY`, run from any terminal with `curl`):
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Reply with the single word: ok"}]}]}'
```
A working key returns a JSON body with `candidates[0].content.parts[0].text`.
A bad key returns `{"error": {"code": 400, "status": "API_KEY_INVALID", ...}}`.

**Common mistakes:**
- Copying the key with a trailing space or newline (common when copying
  from a browser) — paste into a plain text editor first if the test fails.
- Using a key from a Google Cloud **service account** instead of an AI
  Studio key — this app expects the simple `AIza...` API-key style, not
  OAuth service-account credentials.
- Forgetting to restart `npm run dev` after editing `.env.local` — Next.js
  only reads env files at process start.

---

## 2. Groq (`GROQ_API_KEY`) — fast fallback

**What it is:** Groq's OpenAI-compatible chat completions API, running
`llama-3.3-70b-versatile` on their custom LPU hardware (very low latency).
**Free:** Yes — Groq's developer tier is free with generous rate limits and
no credit card at signup.
**Free tier limits:** requests-per-minute and tokens-per-minute caps that
vary by model. Check current numbers for `llama-3.3-70b-versatile` at
[console.groq.com/docs/rate-limits](https://console.groq.com/docs/rate-limits).

**Create an account:**
1. Go to [console.groq.com](https://console.groq.com).
2. Sign up (Google/GitHub SSO or email).

**Generate the key:**
1. Left sidebar → **API Keys**.
2. **Create API Key** → give it a name (e.g. `portfolio`).
3. Copy it immediately — Groq shows it **once**; if you navigate away
   before copying, you'll have to create a new one.

**Where to paste it:** `frontend/.env.local` →
```
GROQ_API_KEY=gsk_...your-key
```

**Verify it works:**
```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Reply with the single word: ok"}]}'
```
A working key returns `choices[0].message.content`. An invalid key returns
`{"error": {"message": "Invalid API Key", ...}}`.

**Common mistakes:**
- Losing the key after creation (see above) — just delete it in the
  dashboard and create a new one, they're free and instant.
- Assuming Groq is "the same as Grok" (xAI's chatbot) — different company,
  different product, easy to mistype when searching.

---

## 3. OpenRouter (`OPENROUTER_API_KEY`) — optional second fallback

**What it is:** A router in front of many models from many providers. This
app pins `meta-llama/llama-3.3-70b-instruct:free` — the `:free` suffix
means it costs nothing and needs no billing setup.
**Free:** Yes, specifically for `:free`-suffixed models.
**Free tier limits:** OpenRouter rate-limits free models per-minute and
per-day; the exact numbers depend on your account state (verified accounts
without any credit get a lower daily cap than accounts that have ever added
credit, even $1). Check current numbers at
[openrouter.ai/docs/api-reference/limits](https://openrouter.ai/docs/api-reference/limits).

**Create an account:**
1. Go to [openrouter.ai](https://openrouter.ai).
2. Sign in with Google/GitHub or email.

**Generate the key:**
1. Click your avatar (top right) → **Keys**.
2. **Create Key** → name it → copy it. Starts with `sk-or-v1-`.

**Where to paste it:** `frontend/.env.local` →
```
OPENROUTER_API_KEY=sk-or-v1-...your-key
```

**Verify it works:**
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"meta-llama/llama-3.3-70b-instruct:free","messages":[{"role":"user","content":"Reply with the single word: ok"}]}'
```
A working key returns `choices[0].message.content`. An invalid key returns
a `401` with `{"error": {"message": "No auth credentials found", ...}}`.

**Common mistakes:**
- Testing with a model name that isn't `:free` — OpenRouter will try to
  bill your account (and fail, or charge you) if you swap in a paid model
  without meaning to. This app's code hardcodes the free model; only change
  it in `ai-providers.ts` deliberately.
- Expecting `X-Title`/`HTTP-Referer` headers to affect billing — they're
  purely for OpenRouter's public leaderboard/analytics, not required for
  the request to succeed.

---

## Changing models

All three model names are constants at the top of
`frontend/src/lib/ai-providers.ts`:

```ts
const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
```

Swap any of them for another model id from that provider's docs. Keep the
OpenRouter model `:free`-suffixed unless you intend to add billing.

## The assistant's knowledge and personality

Both the system prompt and the portfolio-specific knowledge the assistant
draws on live in `frontend/src/content/ai-knowledge.ts` — no provider
config there, purely content. Edit that file to change what the assistant
knows or how it talks; it's compiled from the rest of `src/content/`
automatically.
