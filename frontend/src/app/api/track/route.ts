import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * POST /api/track — first-party analytics events feeding the
 * "Portfolio Insights" section. No cookies, no identifiers:
 * only the event, coarse country (from Vercel's geo header),
 * and a device class derived from the user agent.
 * Always returns 204 — analytics must never surface errors.
 */

const eventSchema = z.object({
  type: z.enum([
    "page_view",
    "resume_download",
    "project_view",
    "contact_submit",
    "rating_submit",
    "chat_opened",
    "terminal_command",
  ]),
  path: z.string().max(200).optional(),
  slug: z.string().max(100).optional(),
  command: z.string().max(50).optional(),
});

function deviceFromUserAgent(ua: string): string {
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/bot|crawler|spider/i.test(ua)) return "Bot";
  return "Desktop";
}

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabase();
  if (!supabase) return new NextResponse(null, { status: 204 });

  try {
    const parsed = eventSchema.safeParse(await req.json());
    if (!parsed.success) return new NextResponse(null, { status: 204 });

    const country =
      req.headers.get("x-vercel-ip-country") ?? "Unknown";
    const device = deviceFromUserAgent(req.headers.get("user-agent") ?? "");

    await supabase.from("analytics_events").insert({
      event_type: parsed.data.type,
      path: parsed.data.path ?? null,
      slug: parsed.data.slug ?? parsed.data.command ?? null,
      country,
      device,
    });
  } catch {
    // Swallow everything — tracking is strictly best-effort.
  }

  return new NextResponse(null, { status: 204 });
}
