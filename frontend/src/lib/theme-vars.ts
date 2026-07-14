"use client";

/**
 * src/lib/theme-vars.ts
 * ------------------------------------------------------------
 * Cached reader for the CSS design-token variables that canvas
 * animations need (they can't use Tailwind classes). Reading
 * getComputedStyle every animation frame is expensive, so the
 * values are cached and only re-read when the theme actually
 * changes — i.e. when `data-mode` or `data-appearance` flips on
 * <html> (watched via a single shared MutationObserver).
 *
 * Returns colors as "r,g,b" strings ready for `rgba(${v},a)`.
 */

const TRACKED = [
  "--c-brand",
  "--c-brand2",
  "--c-mute",
  "--c-ink",
  "--c-bg",
  "--c-term-accent",
] as const;
type TrackedVar = (typeof TRACKED)[number];

let cache: Record<TrackedVar, string> | null = null;
let observer: MutationObserver | null = null;

function readAll(): Record<TrackedVar, string> {
  const styles = getComputedStyle(document.documentElement);
  const out = {} as Record<TrackedVar, string>;
  for (const name of TRACKED) {
    out[name] = styles.getPropertyValue(name).trim().split(/\s+/).join(",");
  }
  return out;
}

function ensureObserver() {
  if (observer || typeof window === "undefined") return;
  observer = new MutationObserver(() => {
    // Theme changed — invalidate so the next read refreshes.
    cache = null;
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-mode", "data-appearance"],
  });
}

/** Get a tracked token as an "r,g,b" string (cached across frames). */
export function themeVar(name: TrackedVar): string {
  ensureObserver();
  if (!cache) cache = readAll();
  return cache[name] ?? "0,0,0";
}
