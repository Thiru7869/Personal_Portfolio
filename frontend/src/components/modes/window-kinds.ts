import { FileText, FolderOpen, Gamepad2, TerminalSquare, type LucideIcon } from "lucide-react";

/**
 * src/components/modes/window-kinds.ts
 * ------------------------------------------------------------
 * The registry TerminalDesktop's window manager spawns from. Add
 * a kind here (icon + default size + multi-instance policy) and
 * TerminalDesktop's spawnWindow/render switch pick it up.
 */
export type WindowKind = "terminal" | "files" | "resume" | "game";

export interface WindowKindConfig {
  kind: WindowKind;
  defaultTitle: string;
  icon: LucideIcon;
  defaultWidth: number;
  defaultHeight: number;
  /** true = every spawn creates a new instance (Terminal); false = an
   *  existing instance is refocused instead of duplicated. */
  multiInstance: boolean;
}

export const WINDOW_KINDS: Record<WindowKind, WindowKindConfig> = {
  terminal: {
    kind: "terminal",
    defaultTitle: "Terminal",
    icon: TerminalSquare,
    defaultWidth: 900,
    defaultHeight: 560,
    multiInstance: true,
  },
  files: {
    kind: "files",
    defaultTitle: "Files — ~/projects",
    icon: FolderOpen,
    defaultWidth: 760,
    defaultHeight: 500,
    multiInstance: false,
  },
  resume: {
    kind: "resume",
    defaultTitle: "Resume.pdf",
    icon: FileText,
    defaultWidth: 620,
    defaultHeight: 720,
    multiInstance: false,
  },
  game: {
    kind: "game",
    defaultTitle: "2048 — byte edition",
    icon: Gamepad2,
    defaultWidth: 460,
    defaultHeight: 620,
    multiInstance: false,
  },
};
