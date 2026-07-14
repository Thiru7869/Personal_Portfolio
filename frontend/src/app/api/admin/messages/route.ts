import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * /api/admin/messages — contact-form inbox for the admin CMS.
 *   GET    — list messages (newest first)
 *   PATCH  — { id, read } toggle read state
 *   DELETE — { id } remove a message
 * All verbs require a valid admin session (see lib/admin-auth).
 */

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = getServiceSupabase()!;
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("GET /api/admin/messages — Supabase read failed:", error);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
  return NextResponse.json({ messages: data });
}

const patchSchema = z.object({ id: z.string().uuid(), read: z.boolean() });

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const supabase = getServiceSupabase()!;
  const { error } = await supabase
    .from("contact_messages")
    .update({ read: parsed.data.read })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("PATCH /api/admin/messages — Supabase update failed:", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const supabase = getServiceSupabase()!;
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    console.error("DELETE /api/admin/messages — Supabase delete failed:", error);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
