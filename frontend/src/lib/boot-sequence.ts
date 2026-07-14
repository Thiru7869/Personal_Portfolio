/**
 * src/lib/boot-sequence.ts
 * ------------------------------------------------------------
 * Content + timing for the cinematic boot sequence
 * (components/boot/BootSequence.tsx). Kept separate so the copy
 * and pacing can be tuned without touching animation logic.
 */

export const BOOT_LINES = [
  "Initializing Portfolio…",
  "Loading Components…",
  "Loading Experience Engine…",
  "Loading Projects…",
  "Loading Developer Dashboard…",
  "Connecting to GitHub…",
  "Loading AI Assistant…",
  "Loading Blogs…",
  "Loading Animations…",
  "Optimizing UI…",
  "Portfolio Ready ✓",
] as const;

/** ms between each boot line appearing. */
export const BOOT_LINE_INTERVAL_MS = 220;
/** ms the completed log holds before the glitch transition. */
export const BOOT_HOLD_MS = 450;
/** ms the glitch flash plays before the logo reveal. */
export const BOOT_GLITCH_MS = 380;
/** ms the "power on" flicker plays before lines start. */
export const BOOT_POWER_ON_MS = 350;
