"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

/** Morse for T-H-I-R-U — the mark's crossbar IS the "T" dash; the
 *  full word survives as a tooltip on the persistent logo. */
const MORSE_TITLE = `- .... .. .-. ..- — morse for ${site.logo}`;

interface LogoProps {
  /** "mark" — the monogram alone (tight spots). "compact" — monogram
   *  + wordmark (navbar, footer). "hero" — large self-drawing mark
   *  with the wordmark beneath, used by the intro loader; fires
   *  onComplete once settled. */
  variant?: "mark" | "compact" | "hero";
  /** Fires when the hero reveal has finished (other variants: no-op). */
  onComplete?: () => void;
  className?: string;
}

/**
 * Mark — the monogram: a "T" drawn from a morse dash (crossbar) and
 * a stem, finished by a terminal caret that keeps blinking under the
 * baseline. Strokes draw themselves in via pathLength; inherits
 * currentColor so each surface (navbar ink, loader green) tints it.
 */
function Mark({ size, draw, delay = 0 }: { size: number; draw: boolean; delay?: number }) {
  return (
    <svg
      viewBox="0 0 48 56"
      width={size}
      height={Math.round((size * 56) / 48)}
      fill="none"
      aria-hidden="true"
    >
      {/* Crossbar — the morse dash for "T" */}
      <motion.path
        d="M7 9 H41"
        stroke="currentColor"
        strokeWidth={6.5}
        strokeLinecap="round"
        initial={draw ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay, ease: "easeInOut" }}
      />
      {/* Stem */}
      <motion.path
        d="M24 9 V38"
        stroke="currentColor"
        strokeWidth={6.5}
        strokeLinecap="round"
        initial={draw ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.45, delay: delay + 0.35, ease: "easeInOut" }}
      />
      {/* Terminal caret finishing the letter */}
      <motion.rect
        x={19}
        y={45}
        width={10}
        height={9}
        rx={1.5}
        fill="currentColor"
        className="animate-blink"
        initial={draw ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.8 }}
      />
    </svg>
  );
}

/**
 * Logo — the site's identity mark, shared by the navbar, footer,
 * intro loader, and outro. The monogram nods to the old morse
 * identity (crossbar = the "T" dash) and ends in a blinking caret —
 * a developer's letterform.
 */
export function Logo({ variant = "compact", onComplete, className = "" }: LogoProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (variant !== "hero") return;
    if (reduce) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => onComplete?.(), 1900);
    return () => clearTimeout(t);
  }, [variant, reduce, onComplete]);

  if (variant !== "hero") {
    return (
      <span
        className={`group flex items-center gap-2 text-ink ${className}`}
        title={MORSE_TITLE}
      >
        <span className="text-brand transition-transform duration-200 group-hover:scale-110">
          <Mark size={variant === "mark" ? 22 : 18} draw={false} />
        </span>
        {variant === "compact" && (
          <span className="font-mono text-sm font-bold tracking-widest">{site.logo}</span>
        )}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-col items-center text-center ${className}`}
      aria-label={`${site.logo} — ${site.roles[0]}`}
    >
      <span className="mark-glow text-term-accent">
        <Mark size={64} draw={!reduce} />
      </span>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 1.05, duration: 0.5 }}
        className="boot-text-glow mt-5 font-mono text-2xl font-bold tracking-[0.3em] text-term-ink sm:text-3xl"
      >
        {site.logo}
      </motion.p>
    </div>
  );
}
