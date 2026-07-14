import type { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * src/lib/admin-auth.ts
 * ------------------------------------------------------------
 * Server-side guard for /api/admin/* routes. The admin UI signs
 * in with Supabase Auth and sends its access token as a Bearer
 * header; this verifies the token AND that the signed-in email
 * matches ADMIN_EMAIL. Two locks: a valid Supabase user who
 * isn't the admin still gets a 403.
 */

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 503; error: string };

export async function requireAdmin(req: NextRequest): Promise<AdminAuthResult> {
  const supabase = getServiceSupabase();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!supabase || !adminEmail) {
    return { ok: false, status: 503, error: "Admin backend not configured." };
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return { ok: false, status: 401, error: "Not signed in." };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Session expired — sign in again." };
  }

  if (data.user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return { ok: false, status: 403, error: "This account is not the admin." };
  }

  return { ok: true };
}
