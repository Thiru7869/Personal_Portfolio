import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isAiConfigured, streamAssistant } from "@/lib/ai-providers";

/**
 * POST /api/chat — Thiru Assistant, streaming.
 * Validates the conversation, rate-limits per IP, then streams
 * plain-text deltas from the Gemini → Groq → OpenRouter chain.
 * API keys never leave the server.
 */

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .min(1)
    .max(30),
});

export async function POST(req: NextRequest) {
  if (!isAiConfigured) {
    return NextResponse.json(
      { error: "No AI provider is configured for this deployment." },
      { status: 503 }
    );
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit("chat", ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit reached — give me a minute to catch my breath." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const last = parsed.data.messages[parsed.data.messages.length - 1];
  if (last.role !== "user") {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const generator = streamAssistant(parsed.data.messages);

  // Pull the first delta BEFORE responding, so provider failures
  // become clean JSON errors instead of empty 200 streams.
  let first: IteratorResult<string>;
  try {
    first = await generator.next();
  } catch (err) {
    console.error("POST /api/chat — every AI provider failed:", err);
    return NextResponse.json(
      { error: "All AI providers are unavailable right now — try again shortly." },
      { status: 502 }
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done && first.value) {
          controller.enqueue(encoder.encode(first.value));
        }
        for await (const delta of generator) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch {
        // Partial answer already sent — end quietly.
      } finally {
        controller.close();
      }
    },
    cancel() {
      void generator.return?.(undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
