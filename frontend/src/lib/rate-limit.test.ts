import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "./rate-limit";
import { RATE_LIMITS } from "@shared/constants";

describe("rateLimit", () => {
  it("allows requests up to the configured limit, then blocks", () => {
    const ip = `test-${Math.random()}`;
    const { limit } = RATE_LIMITS.contact;

    for (let i = 0; i < limit; i++) {
      expect(rateLimit("contact", ip).ok).toBe(true);
    }
    const blocked = rateLimit("contact", ip);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("tracks separate windows per IP", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    const { limit } = RATE_LIMITS.rating;

    for (let i = 0; i < limit; i++) rateLimit("rating", a);
    // a is now exhausted; b must still be fresh.
    expect(rateLimit("rating", a).ok).toBe(false);
    expect(rateLimit("rating", b).ok).toBe(true);
  });

  it("keys are namespaced per limiter kind", () => {
    const ip = `kind-${Math.random()}`;
    for (let i = 0; i < RATE_LIMITS.contact.limit; i++) rateLimit("contact", ip);
    expect(rateLimit("contact", ip).ok).toBe(false);
    // Same IP under a different limiter is independent.
    expect(rateLimit("chat", ip).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(h)).toBe("1.2.3.4");
  });
  it("falls back to x-real-ip", () => {
    const h = new Headers({ "x-real-ip": "9.9.9.9" });
    expect(getClientIp(h)).toBe("9.9.9.9");
  });
  it("returns 'unknown' when no IP headers are present", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
