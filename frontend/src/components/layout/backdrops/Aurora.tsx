"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Aurora — two soft radial blobs (Hero and Services). Their drift is
 * scroll-linked (±20px, opposite directions) so the light responds
 * to the visitor instead of wandering on a loop. Transform-only;
 * still under reduced motion.
 */
export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const y2 = useTransform(scrollYProgress, [0, 1], [18, -18]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div
        style={{
          y: reduce ? 0 : y1,
          background: "radial-gradient(ellipse, rgb(var(--c-brand) / 0.08), transparent 65%)",
        }}
        className="absolute -top-1/4 left-1/4 h-[60vh] w-[70vw] rounded-full"
      />
      <motion.div
        style={{
          y: reduce ? 0 : y2,
          background: "radial-gradient(ellipse, rgb(var(--c-brand2) / 0.06), transparent 65%)",
        }}
        className="absolute -bottom-1/4 right-1/4 h-[55vh] w-[60vw] rounded-full"
      />
    </div>
  );
}
