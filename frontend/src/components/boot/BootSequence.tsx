"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { POPUP_STORAGE_KEY } from "@shared/constants";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { Logo } from "@/components/layout/Logo";
import { AbstractMesh } from "@/components/illustrations/AbstractMesh";
import {
  BOOT_LINES,
  BOOT_LINE_INTERVAL_MS,
  BOOT_HOLD_MS,
  BOOT_GLITCH_MS,
  BOOT_POWER_ON_MS,
} from "@/lib/boot-sequence";

/**
 * BootSequence — the cinematic startup: power-on flicker → terminal
 * boot log → glitch → morse-code logo reveal → on-brand welcome
 * card → Hero. Plays once per browser SESSION (sessionStorage), not
 * on every reload — a "Replay intro" action (footer, command
 * palette) dispatches `replay-boot` to run it again on demand.
 */

type Stage = "hidden" | "power-on" | "lines" | "glitch" | "logo" | "welcome";

export function BootSequence() {
  const [stage, setStage] = useState<Stage>("hidden");
  const [lineCount, setLineCount] = useState(0);
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
    setLineCount(0);
    setStage(reduce ? "welcome" : "power-on");
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

  // Stage auto-advance.
  useEffect(() => {
    if (reduce) return;
    if (stage === "power-on") {
      const t = setTimeout(() => setStage("lines"), BOOT_POWER_ON_MS);
      return () => clearTimeout(t);
    }
    if (stage === "lines") {
      if (lineCount < BOOT_LINES.length) {
        const t = setTimeout(() => setLineCount((c) => c + 1), BOOT_LINE_INTERVAL_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setStage("glitch"), BOOT_HOLD_MS);
      return () => clearTimeout(t);
    }
    if (stage === "glitch") {
      const t = setTimeout(() => setStage("logo"), BOOT_GLITCH_MS);
      return () => clearTimeout(t);
    }
  }, [stage, lineCount, reduce]);

  const skipToWelcome = useCallback(() => setStage("welcome"), []);

  function startTour() {
    dismiss();
    setTimeout(() => window.dispatchEvent(new CustomEvent("start-tour")), 350);
  }

  // Lock scroll for the whole sequence, not just the welcome card.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Escape skips the animated boot straight to the welcome card.
  useEffect(() => {
    if (!active || stage === "welcome") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") skipToWelcome();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, stage, skipToWelcome]);

  const dialogRef = useFocusTrap<HTMLDivElement>(stage === "welcome", dismiss);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio boot sequence"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-term p-6"
        onClick={stage !== "welcome" ? skipToWelcome : undefined}
      >
        {(stage === "power-on" || stage === "lines" || stage === "glitch") && (
          <div
            className={`w-full max-w-xl font-mono text-sm ${
              stage === "glitch" ? "animate-glitch" : ""
            }`}
          >
            <p className="boot-text-glow mb-4 animate-boot-glow text-term-accent">
              THIRU/OS v3.0 — booting…
            </p>
            <div aria-live="polite">
              {BOOT_LINES.slice(0, lineCount).map((line) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-term-ink"
                >
                  <span className="text-brand2">[ OK ]</span> {line}
                </motion.p>
              ))}
            </div>
            <p className="mt-6 text-xs text-term-ink/40">click anywhere to skip · esc</p>
          </div>
        )}

        {stage === "logo" && (
          <Logo variant="animated" onComplete={() => setStage("welcome")} />
        )}

        {stage === "welcome" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden border border-term-accent/40 bg-term p-6 font-mono text-sm sm:p-7"
          >
            <AbstractMesh className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-30" />
            <div className="relative">
              <p className="text-term-accent">$ session --ready</p>
              <p className="mt-3 text-base font-semibold text-term-ink">
                Session ready — welcome aboard.
              </p>
              <p className="mt-2 leading-relaxed text-term-ink/80">
                THIRU/OS is fully interactive: a working terminal, an AI
                assistant, five experience modes, and a live developer
                dashboard. Estimated exploration: 3–5 minutes.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={dismiss}
                  className="border border-term-accent bg-term-accent/10 px-4 py-2 text-xs font-bold text-term-accent transition-all duration-200 hover:bg-term-accent/20 active:scale-[0.98]"
                >
                  Start Exploring
                </button>
                <button
                  type="button"
                  onClick={startTour}
                  className="border border-line px-4 py-2 text-xs text-term-ink/80 transition-all duration-200 hover:text-term-ink active:scale-[0.98]"
                >
                  Quick Tour
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="px-2 py-2 text-xs text-term-ink/50 underline-offset-2 transition-all duration-200 hover:text-term-ink/80 hover:underline active:scale-[0.98]"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
