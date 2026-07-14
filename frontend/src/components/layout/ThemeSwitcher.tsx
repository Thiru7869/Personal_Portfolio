"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  Check,
  Code2,
  LayoutGrid,
  Moon,
  Sparkles,
  Sun,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { modes } from "@/config/modes";
import { useExperience } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

const modeIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  terminal: TerminalSquare,
  bot: Bot,
  code: Code2,
  briefcase: Briefcase,
};

/**
 * AppearanceToggle — the sun/moon light-dark switch.
 * Independent from modes; every mode supports both.
 */
export function AppearanceToggle() {
  const { appearance, toggleAppearance } = useExperience();
  const isDark = appearance === "dark";

  return (
    <button
      type="button"
      onClick={toggleAppearance}
      aria-label={isDark ? "Switch to light appearance" : "Switch to dark appearance"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card/70 text-mute transition-all duration-200 hover:border-brand/60 hover:text-brand active:scale-[0.98]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={appearance}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/**
 * ModeSwitcher — dropdown over the five experience modes.
 * Modes transform the entire site (terminal desktop, AI
 * workspace, developer dashboard, executive presentation).
 */
export function ModeSwitcher() {
  const { mode, setMode } = useExperience();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change experience mode"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card/70 text-mute transition-all duration-200 hover:border-brand/60 hover:text-brand active:scale-[0.98]"
      >
        <LayoutGrid size={15} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Experience modes"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-line bg-card p-1.5 shadow-card"
          >
            <li className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-mute">
              experience modes
            </li>
            {modes.map((m) => {
              const Icon = modeIcons[m.icon] ?? Sparkles;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={mode === m.id}
                    onClick={() => {
                      setMode(m.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface",
                      mode === m.id && "bg-surface"
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">
                        {m.label}
                      </span>
                      <span className="block truncate text-xs text-mute">
                        {m.tagline}
                      </span>
                    </span>
                    {mode === m.id && (
                      <Check size={14} className="shrink-0 text-brand" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
