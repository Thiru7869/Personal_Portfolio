import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * /api/admin/ratings — rating moderation for the admin CMS.
 *   GET    — list ratings with feedback (newest first)
 *   DELETE — { id } remove spam/abuse
 */

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = getServiceSupabase()!;
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("GET /api/admin/ratings — Supabase read failed:", error);
    return NextResponse.json({ error: "Failed to load ratings." }, { status: 500 });
  }
  return NextResponse.json({ ratings: data });
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const supabase = getServiceSupabase()!;
  const { error } = await supabase.from("ratings").delete().eq("id", parsed.data.id);

  if (error) {
    console.error("DELETE /api/admin/ratings — Supabase delete failed:", error);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
