"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * src/lib/use-terminal-theme.ts
 * ------------------------------------------------------------
 * The terminal's own color scheme — independent of the site-wide
 * light/dark appearance. One button cycles green → white → black
 * → parrot → green…; there's deliberately no picker (per the
 * design brief: cycle automatically, don't ask).
 */
export const TERMINAL_THEMES = ["green", "white", "black", "parrot"] as const;
export type TerminalTheme = (typeof TERMINAL_THEMES)[number];

export const TERMINAL_THEME_LABEL: Record<TerminalTheme, string> = {
  green: "Green",
  white: "White",
  black: "Black",
  parrot: "Parrot Blue",
};

const STORAGE_KEY = "thiru-portfolio-terminal-theme";

export function useTerminalTheme() {
  const [theme, setTheme] = useState<TerminalTheme>("green");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (TERMINAL_THEMES as readonly string[]).includes(stored)) {
      setTheme(stored as TerminalTheme);
    }
  }, []);

  const cycle = useCallback(() => {
    setTheme((prev) => {
      const next = TERMINAL_THEMES[(TERMINAL_THEMES.indexOf(prev) + 1) % TERMINAL_THEMES.length];
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, cycle };
}
