"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useExperience } from "@/lib/theme-context";

/** Per-mode reveal personality — duration/ease/scale only; the base
 *  `y` offset passed by each caller is still respected (except
 *  Executive, which always settles for a plain fade — no movement,
 *  matching its "no playful chrome" presentation style). */
const MODE_TRANSITION: Record<
  string,
  { duration: number; ease: [number, number, number, number] | "easeOut" | "easeInOut"; scale?: number }
> = {
  professional: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  terminal: { duration: 0.32, ease: "easeOut" },
  ai: { duration: 0.85, ease: [0.16, 1, 0.3, 1], scale: 0.98 },
  developer: { duration: 0.4, ease: "easeOut" },
  executive: { duration: 0.7, ease: "easeInOut" },
};

/**
 * Reveal — scroll-triggered entrance used across every section.
 * Respects prefers-reduced-motion (content appears instantly).
 * Timing/easing shift subtly per experience mode — snappy in
 * Terminal, unhurried in AI Workspace, a plain fade in Executive.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { mode } = useExperience();
  const cfg = MODE_TRANSITION[mode] ?? MODE_TRANSITION.professional;
  const offsetY = mode === "executive" ? 0 : y;

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: offsetY, scale: cfg.scale ?? 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: cfg.duration, delay, ease: cfg.ease }}
    >
      {children}
    </motion.div>
  );
}
