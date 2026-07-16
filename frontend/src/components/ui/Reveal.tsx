"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useExperience } from "@/lib/theme-context";
import { EASE_OUT } from "@/lib/motion";

/** Per-mode reveal personality — duration/ease/scale only; the base
 *  `y` offset passed by each caller is still respected. */
const MODE_TRANSITION: Record<
  string,
  { duration: number; ease: [number, number, number, number] | "easeOut" | "easeInOut"; scale?: number }
> = {
  professional: { duration: 0.6, ease: EASE_OUT },
  terminal: { duration: 0.32, ease: "easeOut" },
  ai: { duration: 0.85, ease: [0.16, 1, 0.3, 1], scale: 0.98 },
  developer: { duration: 0.4, ease: "easeOut" },
};

type RevealVariant = "rise" | "blur" | "fade";

/**
 * Reveal — scroll-triggered entrance used across every section.
 * Respects prefers-reduced-motion (content appears instantly).
 * Timing/easing shift subtly per experience mode — snappy in
 * Terminal, unhurried in AI Workspace.
 *
 * Variants:
 *   rise (default) — opacity + y drift, the workhorse.
 *   blur           — rise plus a blur-to-sharp settle; reserved for
 *                    section headings and story moments.
 *   fade           — opacity only.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  variant = "rise",
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { mode } = useExperience();
  const cfg = MODE_TRANSITION[mode] ?? MODE_TRANSITION.professional;

  const offsetY = variant === "fade" ? 0 : y;
  const initial =
    variant === "blur"
      ? { opacity: 0, y: offsetY, scale: cfg.scale ?? 1, filter: "blur(8px)" }
      : { opacity: 0, y: offsetY, scale: cfg.scale ?? 1 };
  const target =
    variant === "blur"
      ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      : { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      className={className}
      initial={reduce ? false : initial}
      whileInView={target}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: cfg.duration, delay, ease: cfg.ease }}
    >
      {children}
    </motion.div>
  );
}
