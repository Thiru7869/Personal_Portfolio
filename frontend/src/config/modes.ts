import type { ModeDefinition } from "@shared/types";

/**
 * src/config/modes.ts
 * ------------------------------------------------------------
 * Registry of the five experience modes. Structural tokens
 * (fonts, radii, spacing, accents) live in src/app/globals.css
 * under [data-mode] blocks; takeover modes render their own
 * shells via components/layout/ThemeShell.tsx.
 *
 * Light/dark is a separate axis — every mode supports both.
 */
export const modes: ModeDefinition[] = [
  {
    id: "professional",
    label: "Professional",
    tagline: "The premium portfolio — default",
    icon: "sparkles",
    takeover: false,
  },
  {
    id: "terminal",
    label: "Terminal",
    tagline: "A Parrot-inspired desktop with a working shell",
    icon: "terminal",
    takeover: true,
  },
  {
    id: "ai",
    label: "AI Workspace",
    tagline: "The whole site becomes an AI assistant",
    icon: "bot",
    takeover: true,
  },
  {
    id: "developer",
    label: "Developer Dashboard",
    tagline: "Widgets, stats, and activity — editor style",
    icon: "code",
    takeover: true,
  },
  {
    id: "executive",
    label: "Executive",
    tagline: "Minimal, recruiter-friendly, print-ready",
    icon: "briefcase",
    takeover: false,
  },
];

export const DEFAULT_MODE = "professional" as const;
export const DEFAULT_APPEARANCE = "light" as const;
