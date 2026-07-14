/**
 * shared/constants.ts
 * ------------------------------------------------------------
 * Cross-cutting constants used by the frontend UI, the terminal,
 * the command palette, and the API layer.
 */

/** Section ids on the single-page homepage — used by the navbar,
 *  command palette, terminal `ls` command, and scroll-spy. */
export const SECTION_IDS = [
  "home",
  "about",
  "terminal",
  "skills",
  "projects",
  "activity",
  "experience",
  "education",
  "research",
  "certificates",
  "services",
  "now",
  "testimonials",
  "faq",
  "rating",
  "insights",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/**
 * The experience system has two independent axes:
 *  - MODE: what the site IS (portfolio, OS desktop, AI workspace…)
 *  - APPEARANCE: light or dark rendering of the active mode
 */
export const MODE_IDS = [
  "professional",
  "terminal",
  "ai",
  "developer",
  "executive",
] as const;

export const APPEARANCE_IDS = ["light", "dark"] as const;

export const MODE_STORAGE_KEY = "thiru-portfolio-mode";
export const APPEARANCE_STORAGE_KEY = "thiru-portfolio-appearance";
export const POPUP_STORAGE_KEY = "thiru-portfolio-initialized";

/** API rate limits (requests per window). */
export const RATE_LIMITS = {
  contact: { limit: 3, windowMs: 10 * 60 * 1000 },
  rating: { limit: 5, windowMs: 60 * 60 * 1000 },
  chat: { limit: 20, windowMs: 10 * 60 * 1000 },
  newsletter: { limit: 3, windowMs: 60 * 60 * 1000 },
} as const;
