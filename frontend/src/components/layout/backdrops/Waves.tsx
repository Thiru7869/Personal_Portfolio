"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Layered wave silhouettes resting at the bottom of a section,
 *  with a gentle scroll-linked settle (±14px). */
export function Waves() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [14, -14]);

  return (
    <div ref={ref} className="absolute inset-x-0 bottom-0 h-[40vh]">
      <motion.svg
        style={{ y: reduce ? 0 : y }}
        className="h-full w-full opacity-40"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        <path
          d="M0,160 C300,110 500,210 720,160 C940,110 1080,190 1200,150 L1200,300 L0,300 Z"
          fill="rgb(var(--c-brand) / 0.05)"
        />
        <path
          d="M0,210 C260,170 520,250 780,205 C1000,168 1120,225 1200,200 L1200,300 L0,300 Z"
          fill="rgb(var(--c-brand2) / 0.05)"
        />
        <path
          d="M0,250 C320,225 620,280 900,245 C1060,226 1150,255 1200,245 L1200,300 L0,300 Z"
          fill="rgb(var(--c-mute) / 0.06)"
        />
      </motion.svg>
    </div>
  );
}
