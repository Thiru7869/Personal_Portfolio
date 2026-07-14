import { NextResponse, type NextRequest } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { deliverContactMessage, isEmailConfigured } from "@/lib/email";
import { getServiceSupabase } from "@/lib/supabase";
import { contactSchema } from "@/lib/validation";

/**
 * POST /api/contact — the contact form.
 * Validation (zod) → honeypot → rate limit → email (SMTP with
 * Web3Forms fallback) → best-effort archive to Supabase.
 * The schema lives in lib/validation.ts (shared + testable).
 */

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit("contact", ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many messages — try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    // A filled honeypot means a bot — pretend success, deliver nothing.
    if (first?.path[0] === "company") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: first?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const payload = parsed.data;

  let delivered: "smtp" | "web3forms" | "none" = "none";
  let deliveryFailed = false;
  try {
    delivered = await deliverContactMessage(payload);
  } catch (err) {
    deliveryFailed = true;
    console.error("POST /api/contact — email delivery failed:", err);
  }

  // Archive in Supabase regardless of email outcome (best effort).
  let stored = false;
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      delivered_via: deliveryFailed ? "failed" : delivered,
    });
    stored = !error;
    if (error) {
      console.error("POST /api/contact — Supabase archive failed:", error);
    }
  }

  if ((deliveryFailed || delivered === "none") && !stored) {
    return NextResponse.json(
      {
        error: isEmailConfigured
          ? "Delivery failed on our side — please email me directly."
          : "The contact backend isn't configured yet — please email me directly.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
