"use client";

import { useEffect, useRef, useState } from "react";

/**
 * src/lib/use-typewriter.ts
 * ------------------------------------------------------------
 * Reveals `text` progressively while `active` is true, once only
 * — the same frame-by-frame mental model as the terminal's ASCII
 * animations (src/lib/terminal-animations.ts), just applied to
 * text instead of pre-baked frames. Under prefers-reduced-motion,
 * or once already revealed, returns the full text immediately.
 */
export function useTypewriter(text: string, active: boolean): string {
  const [shown, setShown] = useState("");
  const revealedRef = useRef(false);

  useEffect(() => {
    if (revealedRef.current) {
      setShown(text);
      return;
    }
    if (!active) return;

    revealedRef.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || text.length === 0) {
      setShown(text);
      return;
    }

    let i = 0;
    // Cap total ticks so long comments don't take forever to type out.
    const step = Math.max(1, Math.round(text.length / 40));
    const timer = setInterval(() => {
      i += step;
      if (i >= text.length) {
        setShown(text);
        clearInterval(timer);
      } else {
        setShown(text.slice(0, i));
      }
    }, 18);
    return () => clearInterval(timer);
  }, [active, text]);

  return shown;
}
