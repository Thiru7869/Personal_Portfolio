import type { ChatMessage } from "@shared/types";
import { assistantSystemPrompt } from "@/content/ai-knowledge";

/**
 * src/lib/ai-providers.ts
 * ------------------------------------------------------------
 * The AI fallback chain for Thiru Assistant:
 *
 *   1. Gemini Flash   (GEMINI_API_KEY)
 *   2. Groq           (GROQ_API_KEY)
 *   3. OpenRouter     (OPENROUTER_API_KEY)
 *
 * Providers with no key are skipped. If one fails (rate limit,
 * outage), the next takes over — the personality lives in the
 * system prompt, so the voice survives a failover.
 *
 * To change models, edit the MODEL constants below.
 */

const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

const MAX_OUTPUT_TOKENS = 600;
const REQUEST_TIMEOUT_MS = 25_000;

/** Keep only the most recent turns so context stays small and cheap. */
function trimHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages.slice(-10).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 2000),
  }));
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const isAiConfigured = Boolean(
  process.env.GEMINI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY
);

/* ============================================================
   STREAMING — same provider chain, token-by-token.
   Each provider yields text deltas; the route re-emits them as
   a plain text stream. If a provider fails BEFORE yielding any
   text, the chain falls through to the next one.
   ============================================================ */

async function* sseTextEvents(res: Response): AsyncGenerator<string> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      yield data;
    }
  }
}

async function* streamGemini(messages: ChatMessage[]): AsyncGenerator<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini not configured");
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: assistantSystemPrompt }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.6 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  for await (const data of sseTextEvents(res)) {
    try {
      const text = JSON.parse(data)?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === "string" && text) yield text;
    } catch {
      // Skip malformed keep-alive chunks.
    }
  }
}

async function* streamOpenAICompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  extraHeaders: Record<string, string> = {}
): AsyncGenerator<string> {
  const res = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.6,
      stream: true,
      messages: [{ role: "system", content: assistantSystemPrompt }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`Provider error ${res.status}`);
  for await (const data of sseTextEvents(res)) {
    try {
      const text = JSON.parse(data)?.choices?.[0]?.delta?.content;
      if (typeof text === "string" && text) yield text;
    } catch {
      // Skip malformed chunks.
    }
  }
}

function streamGroq(messages: ChatMessage[]) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Groq not configured");
  return streamOpenAICompatible(
    "https://api.groq.com/openai/v1/chat/completions",
    key,
    GROQ_MODEL,
    messages
  );
}

function streamOpenRouter(messages: ChatMessage[]) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OpenRouter not configured");
  return streamOpenAICompatible(
    "https://openrouter.ai/api/v1/chat/completions",
    key,
    OPENROUTER_MODEL,
    messages,
    {
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "Thiru Portfolio Assistant",
    }
  );
}

/**
 * Stream the assistant's reply, walking the provider chain.
 * Providers that fail before yielding any text fall through;
 * once text has been sent, the stream simply ends on error.
 */
export async function* streamAssistant(
  messages: ChatMessage[]
): AsyncGenerator<string> {
  const history = trimHistory(messages);
  const chain = [
    () => streamGemini(history),
    () => streamGroq(history),
    () => streamOpenRouter(history),
  ];

  let lastError: unknown = new Error("No AI provider configured");
  for (const start of chain) {
    let yielded = false;
    try {
      for await (const delta of start()) {
        yielded = true;
        yield delta;
      }
      if (yielded) return;
    } catch (err) {
      lastError = err;
      if (yielded) return; // partial answer already delivered — stop cleanly
    }
  }
  throw lastError;
}
