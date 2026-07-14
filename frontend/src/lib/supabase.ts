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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
