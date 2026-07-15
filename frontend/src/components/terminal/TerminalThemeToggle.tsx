"use client";

import { Palette } from "lucide-react";
import { TERMINAL_THEME_LABEL, type TerminalTheme } from "@/lib/use-terminal-theme";

/**
 * One button, one job: cycle the terminal's color theme. No picker —
 * click again to see the next one.
 */
export function TerminalThemeToggle({
  theme,
  onCycle,
}: {
  theme: TerminalTheme;
  onCycle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`Terminal color theme: ${TERMINAL_THEME_LABEL[theme]}. Click to cycle.`}
      title={`Theme: ${TERMINAL_THEME_LABEL[theme]} (click to cycle)`}
      className="flex h-6 w-6 items-center justify-center rounded text-mute transition-colors hover:bg-surface hover:text-term-accent"
    >
      <Palette size={13} aria-hidden="true" />
    </button>
  );
}
