import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * src/lib/supabase.ts
 * ------------------------------------------------------------
 * Supabase clients. Every feature that uses Supabase checks
 * `isSupabaseConfigured` first and degrades gracefully when the
 * env vars are missing, so the site builds and runs without a
 * database (ratings/insights simply hide, contact falls back to
 * email-only).
 *
 * Table schema lives in backend/supabase/schema.sql.
 */

/**
 * The Supabase client wants the bare project URL (e.g.
 * https://xxxx.supabase.co) — it appends /rest/v1/... itself. A
 * common copy-paste mistake is pasting the REST endpoint shown in
 * the dashboard's API docs (which already has /rest/v1 on it),
 * which silently doubles the path and makes every request fail
 * with PostgREST's "Invalid path specified" error. Stripping any
 * trailing /rest/v1 (and trailing slashes) here means that mistake
 * can't take the ratings/insights/contact-archive features down.
 */
function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  return raw.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

/**
 * Server-side client with the service role key (bypasses RLS).
 * ONLY import from API routes / server code — never from
 * components. Returns null when not configured.
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  serviceClient ??= createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

/**
 * Anonymous client (respects RLS). Safe on server or browser.
 * Used for public reads and the admin login flow.
 */
export function getAnonSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  anonClient ??= createClient(url, anonKey);
  return anonClient;
}
