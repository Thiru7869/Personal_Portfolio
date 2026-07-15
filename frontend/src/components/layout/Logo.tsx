"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

/** Morse code for T-H-I-R-U, one entry per letter. */
const MORSE_LETTERS = [
  { letter: "T", code: "-" },
  { letter: "H", code: "...." },
  { letter: "I", code: ".." },
  { letter: "R", code: ".-." },
  { letter: "U", code: "..-" },
] as const;

const LETTER_STEP_MS = 260;
const SYMBOL_STEP_MS = 90;
const HOLD_BEFORE_WORDMARK_MS = 450;

interface LogoProps {
  /** "compact" — the persistent navbar wordmark. "animated" — the
   *  full morse-to-wordmark reveal used once in the boot sequence. */
  variant?: "compact" | "animated";
  /** Fires once the animated reveal has finished (compact is a no-op). */
  onComplete?: () => void;
  className?: string;
}

/**
 * Logo — the site's identity mark. Morse code for THIRU
 * (- .... .. .-. ..-) decodes into the wordmark once, in the
 * boot sequence; everywhere else (navbar) it's just the
 * wordmark, with the morse spelled out in a title tooltip.
 */
export function Logo({ variant = "compact", onComplete, className = "" }: LogoProps) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(variant === "compact");

  useEffect(() => {
    if (variant !== "animated") return;
    if (reduce) {
      setRevealed(true);
      onComplete?.();
      return;
    }
    const morseDuration = MORSE_LETTERS.length * LETTER_STEP_MS;
    const t1 = setTimeout(() => setRevealed(true), morseDuration + HOLD_BEFORE_WORDMARK_MS);
    const t2 = setTimeout(
      () => onComplete?.(),
      morseDuration + HOLD_BEFORE_WORDMARK_MS + 900
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [variant, reduce, onComplete]);

  if (variant === "compact") {
    return (
      <span
        className={`group flex items-center gap-0.5 font-mono text-sm font-bold tracking-widest text-ink ${className}`}
        title={`${MORSE_LETTERS.map((m) => m.code).join(" ")} — morse for ${site.logo}`}
      >
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {site.logo}
        </motion.span>
        <span
          className="h-4 w-[7px] animate-logo-signal bg-brand transition-transform group-hover:scale-y-125"
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <div
      className={`flex flex-col items-center text-center ${className}`}
      aria-label={`${site.logo} — ${site.roles[0]}`}
    >
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="morse"
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 font-mono text-2xl tracking-[0.3em] text-term-accent sm:text-3xl"
          >
            {MORSE_LETTERS.map((m, li) => (
              <span key={m.letter} className="flex gap-1.5">
                {m.code.split("").map((symbol, si) => (
                  <motion.span
                    key={`${m.letter}-${si}`}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: (li * LETTER_STEP_MS + si * SYMBOL_STEP_MS) / 1000,
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    className="boot-text-glow inline-block"
                  >
                    {symbol}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="wordmark"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="boot-text-glow font-display text-4xl font-bold tracking-tight text-term-ink sm:text-5xl">
              {site.logo}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-term-accent/80">
              {site.roles[0]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
