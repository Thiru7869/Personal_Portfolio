import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import type { RatingSummary } from "@shared/types";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * /api/rating
 *   GET  — average, count, and 1–5 distribution
 *   POST — submit a rating { score: 1–5, feedback? }
 * Returns 503 when Supabase isn't configured so the UI can show
 * its offline state.
 */

const ratingSchema = z.object({
  score: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(300).optional(),
});

export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Ratings not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("ratings")
    .select("score, feedback, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("GET /api/rating — Supabase read failed:", error);
    return NextResponse.json({ error: "Failed to load ratings" }, { status: 500 });
  }

  const distribution: RatingSummary["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  for (const row of data) {
    const s = row.score as 1 | 2 | 3 | 4 | 5;
    distribution[s] += 1;
    total += s;
  }

  const recentComments: RatingSummary["recentComments"] = data
    .filter((row): row is typeof row & { feedback: string } => !!row.feedback?.trim())
    .slice(0, 6)
    .map((row) => ({ score: row.score as 1 | 2 | 3 | 4 | 5, feedback: row.feedback.trim() }));

  const summary: RatingSummary = {
    count: data.length,
    average: data.length ? total / data.length : 0,
    distribution,
    recentComments,
  };

  return NextResponse.json(summary, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Ratings not configured" }, { status: 503 });
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit("rating", ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rating limit reached — thanks for the enthusiasm!" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
  }

  const { error } = await supabase.from("ratings").insert({
    score: parsed.data.score,
    feedback: parsed.data.feedback ?? null,
  });

  if (error) {
    console.error("POST /api/rating — Supabase write failed:", error);
    return NextResponse.json({ error: "Failed to save rating." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
