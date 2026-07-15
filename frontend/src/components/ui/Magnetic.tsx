"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Magnetic — wraps a primary call-to-action so it drifts a few
 * pixels toward the cursor, like it's being pulled in. Transform-only
 * (GPU-composited), capped at `strength` px, and a no-op under
 * prefers-reduced-motion or on touch (no mousemove ⇒ motion values
 * never leave 0).
 */
export function Magnetic({
  children,
  strength = 10,
  className = "inline-block",
}: {
  children: ReactNode;
  /** Maximum pull distance in px — keep this small (8–12px). */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-strength, Math.min(strength, relX * 0.35)));
    y.set(Math.max(-strength, Math.min(strength, relY * 0.35)));
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduce ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
