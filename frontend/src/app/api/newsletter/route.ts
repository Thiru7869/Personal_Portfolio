import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * POST /api/newsletter — footer signup. Stores the address in
 * Supabase (newsletter_subscribers, unique on email). 503 when
 * the database isn't configured so the form can degrade.
 */

const schema = z.object({ email: z.string().trim().email().max(150) });

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Newsletter not configured." }, { status: 503 });
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit("newsletter", ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts — try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email.toLowerCase() }, { onConflict: "email" });

  if (error) {
    console.error("POST /api/newsletter — Supabase write failed:", error);
    return NextResponse.json({ error: "Couldn't save that — try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
