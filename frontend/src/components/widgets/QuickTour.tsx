"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

/**
 * QuickTour — "Take a Tour" spotlight walkthrough. A dimmed
 * overlay with a moving cut-out highlights each section while a
 * card explains it. Fully keyboard driven (←/→/Esc). Started
 * via the hero button or the command palette ("start-tour"
 * event).
 */

interface TourStep {
  target: string;
  title: string;
  body: string;
}

const STEPS: TourStep[] = [
  {
    target: "home",
    title: "This portfolio is interactive",
    body: "Scroll to explore, or let this tour walk you through. The dock below holds my resume and every profile; top right switches light/dark and swaps between four complete experience modes.",
  },
  {
    target: "about",
    title: "The story",
    body: "Who I am, how I work, and where I'm headed — in my own words. Everything after this section is the proof.",
  },
  {
    target: "projects",
    title: "Proof of work",
    body: "Projects presented as a file manager. Double-click any folder for the full case study; right-click for demo and source.",
  },
  {
    target: "terminal",
    title: "A real terminal",
    body: "30+ working commands — try `help`, `donut`, or `sudo hire thiru`. Type `mode terminal` and the entire site becomes a desktop with draggable windows.",
  },
  {
    target: "activity",
    title: "Live, not claimed",
    body: "GitHub contributions and LeetCode stats, pulled live. The write-ups behind the work live at /blog.",
  },
  {
    target: "faq",
    title: "Ask anything",
    body: "The floating assistant (bottom right) streams answers grounded in this portfolio. The questions people actually ask are answered here — the full set lives at /qa.",
  },
  {
    target: "contact",
    title: "Say hello",
    body: "A working contact form, direct channels, and my availability. Messages land in my inbox — I reply within a day.",
  },
];

export function QuickTour() {
  const [stepIdx, setStepIdx] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const stop = useCallback(() => setStepIdx(null), []);

  const goTo = useCallback((idx: number) => {
    const step = STEPS[idx];
    const el = document.getElementById(step.target);
    if (!el) return;
    setStepIdx(idx);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // Measure after the scroll settles.
    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    const t = setTimeout(measure, 550);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onStart() {
      goTo(0);
    }
    window.addEventListener("start-tour", onStart);
    return () => window.removeEventListener("start-tour", onStart);
  }, [goTo]);

  useEffect(() => {
    if (stepIdx === null) return;
    cardRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") stop();
      if (e.key === "ArrowRight" && stepIdx! < STEPS.length - 1) goTo(stepIdx! + 1);
      if (e.key === "ArrowLeft" && stepIdx! > 0) goTo(stepIdx! - 1);
    }
    function onRecalc() {
      const el = document.getElementById(STEPS[stepIdx!].target);
      if (el) setRect(el.getBoundingClientRect());
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onRecalc, { passive: true });
    window.addEventListener("resize", onRecalc);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onRecalc);
      window.removeEventListener("resize", onRecalc);
    };
  }, [stepIdx, goTo, stop]);

  if (stepIdx === null) return null;
  const step = STEPS[stepIdx];

  const pad = 12;
  const spot = rect
    ? {
        top: Math.max(rect.top - pad, 8),
        left: Math.max(rect.left - pad, 8),
        width: Math.min(rect.width + pad * 2, window.innerWidth - 16),
        height: rect.height + pad * 2,
      }
    : null;

  return (
    <AnimatePresence>
      <motion.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[95]"
        aria-live="polite"
      >
        {/* Spotlight: a rounded rectangle whose massive shadow dims everything else */}
        {spot && (
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{
              top: spot.top,
              left: spot.left,
              width: spot.width,
              height: spot.height,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            style={{ boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.72)" }}
            className="pointer-events-none absolute rounded-2xl border-2 border-brand/70"
          />
        )}

        {/* Explainer card */}
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Tour step ${stepIdx + 1} of ${STEPS.length}: ${step.title}`}
          tabIndex={-1}
          className="card-shell fixed bottom-6 left-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 p-5 outline-none"
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-brand">
              tour · {stepIdx + 1}/{STEPS.length}
            </p>
            <button
              type="button"
              onClick={stop}
              aria-label="End tour"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-mute hover:text-brand"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>
          <h3 className="font-display text-base font-bold">{step.title}</h3>
          <p className="mt-1.5 text-sm text-mute">{step.body}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1" aria-hidden="true">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === stepIdx ? "w-5 bg-brand" : "w-2 bg-line"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(stepIdx - 1)}
                disabled={stepIdx === 0}
                className="btn-ghost !px-3 !py-1.5 text-xs disabled:opacity-40"
                aria-label="Previous step"
              >
                <ArrowLeft size={13} aria-hidden="true" />
              </button>
              {stepIdx < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goTo(stepIdx + 1)}
                  className="btn-primary !px-4 !py-1.5 text-xs"
                >
                  Next <ArrowRight size={13} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stop}
                  className="btn-primary !px-4 !py-1.5 text-xs"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
