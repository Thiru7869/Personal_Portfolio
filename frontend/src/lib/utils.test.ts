import { describe, it, expect } from "vitest";
import { cn, clamp, formatDate } from "./utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });
  it("skips falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("clamp", () => {
  it("returns the value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it("clamps below the minimum", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });
  it("clamps above the maximum", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });
  it("handles boundary values", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("formatDate", () => {
  it("formats an ISO date without timezone drift", () => {
    // Parsed as local midnight, so the day never rolls backward.
    expect(formatDate("2026-06-20")).toBe("June 20, 2026");
  });
  it("formats January dates correctly", () => {
    expect(formatDate("2025-01-01")).toBe("January 1, 2025");
  });
});
