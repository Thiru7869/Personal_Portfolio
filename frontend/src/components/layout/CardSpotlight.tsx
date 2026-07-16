"use client";

import { useEffect } from "react";

/**
 * CardSpotlight — one delegated pointermove listener that feeds the
 * `.card-shell::after` spotlight (globals.css) by setting
 * --spot-x/--spot-y on whichever card the pointer is over. No React
 * state, one rAF, direct style writes — effectively free. Fine
 * pointers only; touch devices never attach the listener.
 */
export function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    function onMove(e: PointerEvent) {
      const card = (e.target as HTMLElement).closest?.(".card-shell");
      if (!(card instanceof HTMLElement)) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      });
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
