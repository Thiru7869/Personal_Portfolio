import { site } from "@/config/site";

/**
 * src/lib/boot-sequence.ts
 * ------------------------------------------------------------
 * Content + timing for the cinematic intro loader
 * (components/boot/BootSequence.tsx). Kept separate so the copy
 * and pacing can be tuned without touching animation logic.
 *
 * Structure: a "boot" stage (the logo draws itself over a live
 * node mesh while status lines cycle above a progress bar), then
 * a "welcome" stage (large type crossfades through a short
 * greeting) that dissolves into the hero.
 */

/** Engineering-flavoured status lines cycled during the boot stage. */
export const BOOT_STATUS_LINES = [
  "compiling experience…",
  "hydrating components…",
  "linking neural pathways…",
  "ready.",
] as const;

/** ms each status line holds before the next crossfades in. */
export const BOOT_STATUS_INTERVAL_MS = 520;

/** Total boot-stage length — drives the progress bar too. */
export const BOOT_TOTAL_MS = BOOT_STATUS_LINES.length * BOOT_STATUS_INTERVAL_MS;

/** The welcome sequence — large type, one phrase at a time. */
export const WELCOME_WORDS = [
  "Welcome",
  `I'm ${site.shortName}`,
  site.roles[0],
  "Let's explore",
] as const;

/** ms each welcome phrase holds on screen. */
export const WELCOME_WORD_MS = 850;
