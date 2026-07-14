import { RATE_LIMITS } from "@shared/constants";

/**
 * src/lib/rate-limit.ts
 * ------------------------------------------------------------
 * In-memory sliding-window rate limiter for API routes.
 *
 * On Vercel each serverless instance keeps its own window,
 * which is fine for abuse protection on a portfolio (bursts hit
 * the same warm instance). If you ever need strict global
 * limits, swap the Map for Upstash Redis — the interface below
 * stays the same.
 */

type LimiterKey = keyof typeof RATE_LIMITS;

const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the client may retry (only when blocked). */
  retryAfter: number;
}

export function rateLimit(kind: LimiterKey, ip: string): RateLimitResult {
  const { limit, windowMs } = RATE_LIMITS[kind];
  const now = Date.now();
  const key = `${kind}:${ip}`;

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0];
    return { ok: false, retryAfter: Math.ceil((oldest + windowMs - now) / 1000) };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t > windowMs)) buckets.delete(k);
    }
  }

  return { ok: true, retryAfter: 0 };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
