"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** ScrollProgress — hairline reading-progress bar under the navbar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="scroll-progress-bar fixed inset-x-0 top-0 z-50 origin-left bg-gradient-to-r from-brand to-brand2"
    />
  );
}
