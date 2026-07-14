"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  APPEARANCE_IDS,
  APPEARANCE_STORAGE_KEY,
  MODE_IDS,
  MODE_STORAGE_KEY,
} from "@shared/constants";
import type { Appearance, ModeId } from "@shared/types";
import { DEFAULT_APPEARANCE, DEFAULT_MODE } from "@/config/modes";

/**
 * src/lib/theme-context.tsx
 * ------------------------------------------------------------
 * Owns the two experience axes:
 *   data-mode        — professional | terminal | ai | developer | executive
 *   data-appearance  — light | dark
 * Both persist to localStorage; an inline script (below) applies
 * them before first paint so there is never a flash.
 */

interface ExperienceContextValue {
  mode: ModeId;
  appearance: Appearance;
  setMode: (mode: ModeId) => void;
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function isMode(v: string | null): v is ModeId {
  return !!v && (MODE_IDS as readonly string[]).includes(v);
}
function isAppearance(v: string | null): v is Appearance {
  return !!v && (APPEARANCE_IDS as readonly string[]).includes(v);
}

let switchTimer: ReturnType<typeof setTimeout> | undefined;

/** Apply an attribute with a brief whole-page morph transition. */
function applyAttr(attr: "data-mode" | "data-appearance", value: string, key: string) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.setAttribute(attr, value);
  localStorage.setItem(key, value);
  clearTimeout(switchTimer);
  switchTimer = setTimeout(() => root.classList.remove("theme-switching"), 600);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ModeId>(DEFAULT_MODE);
  const [appearance, setAppearanceState] = useState<Appearance>(DEFAULT_APPEARANCE);

  useEffect(() => {
    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    if (isMode(storedMode)) setModeState(storedMode);
    const storedAppearance = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (isAppearance(storedAppearance)) setAppearanceState(storedAppearance);
  }, []);

  const setMode = useCallback((next: ModeId) => {
    setModeState(next);
    applyAttr("data-mode", next, MODE_STORAGE_KEY);
  }, []);

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next);
    applyAttr("data-appearance", next, APPEARANCE_STORAGE_KEY);
  }, []);

  const toggleAppearance = useCallback(() => {
    setAppearanceState((current) => {
      const next = current === "light" ? "dark" : "light";
      applyAttr("data-appearance", next, APPEARANCE_STORAGE_KEY);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, appearance, setMode, setAppearance, toggleAppearance }),
    [mode, appearance, setMode, setAppearance, toggleAppearance]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ThemeProvider>");
  return ctx;
}

/** Inline script that restores saved mode + appearance before paint. */
export const themeInitScript = `(function(){try{
var m=localStorage.getItem("${MODE_STORAGE_KEY}");
var a=localStorage.getItem("${APPEARANCE_STORAGE_KEY}");
document.documentElement.setAttribute("data-mode",${JSON.stringify([...MODE_IDS])}.indexOf(m)>-1?m:"${DEFAULT_MODE}");
document.documentElement.setAttribute("data-appearance",${JSON.stringify([...APPEARANCE_IDS])}.indexOf(a)>-1?a:"${DEFAULT_APPEARANCE}");
}catch(e){
document.documentElement.setAttribute("data-mode","${DEFAULT_MODE}");
document.documentElement.setAttribute("data-appearance","${DEFAULT_APPEARANCE}");
}})();`;
