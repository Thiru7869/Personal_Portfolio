"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { POPUP_STORAGE_KEY } from "@shared/constants";
import { Logo } from "@/components/layout/Logo";
import { NodeCanvas } from "@/components/layout/backdrops/NodeCanvas";
import {
  BOOT_STATUS_LINES,
  BOOT_STATUS_INTERVAL_MS,
  BOOT_TOTAL_MS,
  WELCOME_WORDS,
  WELCOME_WORD_MS,
} from "@/lib/boot-sequence";

/**
 * BootSequence — the cinematic intro. Two stages, then a dissolve:
 *
 *   boot     — the logo draws itself over a live node mesh while
 *              engineering status lines cycle above a progress bar.
 *   welcome  — large type crossfades: "Welcome" → "I'm Thiru" →
 *              role → "Let's explore".
 *
 * Plays once per browser SESSION (sessionStorage); "Replay intro"
 * (footer, command palette) dispatches `replay-boot` to run it
 * again. Click advances a stage, Esc skips everything, and
 * prefers-reduced-motion skips the intro entirely — the settled
 * hero is the reduced-motion experience.
 */

type Stage = "hidden" | "boot" | "welcome";

export function BootSequence() {
  const [stage, setStage] = useState<Stage>("hidden");
  const [statusIndex, setStatusIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const reduce = useReducedMotion();
  const active = stage !== "hidden";

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(POPUP_STORAGE_KEY, "1");
    } catch {
      // storage unavailable — dismiss anyway
    }
    setStage("hidden");
  }, []);

  const start = useCallback(() => {
    if (reduce) {
      // Reduced motion: no intro — mark seen and show the page.
      try {
        sessionStorage.setItem(POPUP_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      return;
    }
    setStatusIndex(0);
    setWordIndex(0);
    setStage("boot");
  }, [reduce]);

  // First mount: play once per session.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(POPUP_STORAGE_KEY)) start();
    } catch {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual replay, from the footer or command palette.
  useEffect(() => {
    function onReplay() {
      start();
    }
    window.addEventListener("replay-boot", onReplay);
    return () => window.removeEventListener("replay-boot", onReplay);
  }, [start]);

  // Boot stage: cycle status lines, then hand off to the welcome type.
  useEffect(() => {
    if (stage !== "boot") return;
    if (statusIndex < BOOT_STATUS_LINES.length - 1) {
      const t = setTimeout(() => setStatusIndex((i) => i + 1), BOOT_STATUS_INTERVAL_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage("welcome"), BOOT_STATUS_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [stage, statusIndex]);

  // Welcome stage: crossfade through the phrases, then dissolve out.
  useEffect(() => {
    if (stage !== "welcome") return;
    if (wordIndex < WELCOME_WORDS.length - 1) {
      const t = setTimeout(() => setWordIndex((i) => i + 1), WELCOME_WORD_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(dismiss, WELCOME_WORD_MS);
    return () => clearTimeout(t);
  }, [stage, wordIndex, dismiss]);

  // Click advances; Esc skips everything.
  const advance = useCallback(() => {
    if (stage === "boot") setStage("welcome");
    else if (stage === "welcome") dismiss();
  }, [stage, dismiss]);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, dismiss]);

  // Lock scroll while the intro is on screen.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-term p-6"
          onClick={advance}
        >
          {/* Living neural-mesh backdrop, dimmed under the content */}
          <div className="absolute inset-0 opacity-35" aria-hidden="true">
            <NodeCanvas variant="mesh" />
          </div>

          {stage === "boot" && (
            <div className="relative flex w-full max-w-sm flex-col items-center">
              <Logo variant="hero" />

              {/* Progress bar — paced to the whole boot stage */}
              <div
                className="mt-10 h-px w-56 overflow-hidden bg-term-ink/15"
                role="progressbar"
                aria-label="Loading portfolio"
              >
                <motion.div
                  className="h-full origin-left bg-term-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: BOOT_TOTAL_MS / 1000, ease: "linear" }}
                />
              </div>

              {/* One status line at a time, crossfading */}
              <div className="mt-4 h-5 font-mono text-xs text-term-ink/70" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={statusIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {BOOT_STATUS_LINES[statusIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          )}

          {stage === "welcome" && (
            <div className="relative flex h-24 items-center justify-center" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={wordIndex}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="boot-text-glow px-4 text-center font-display text-4xl font-bold tracking-tight text-term-ink sm:text-5xl"
                >
                  {WELCOME_WORDS[wordIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          )}

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-term-ink/35">
            click to skip · esc
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
