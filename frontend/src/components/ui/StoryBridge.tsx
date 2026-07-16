"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * StoryBridge — a short connective line between the page's "acts"
 * so seventeen sections read as one continuous story instead of
 * stacked panels. A thin thread draws downward, then the line of
 * narration blur-fades in. Real content (screen readers get it),
 * deliberately quiet.
 */
export function StoryBridge({ text }: { text: string }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative z-[1] mx-auto flex max-w-6xl flex-col items-center px-5 py-6 text-center sm:py-8">
      <motion.span
        aria-hidden="true"
        initial={reduce ? false : { scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-10 w-px origin-top bg-gradient-to-b from-transparent via-brand/60 to-transparent"
      />
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
        className="mt-3 max-w-md font-display text-lg font-medium text-ink/75 sm:text-xl"
      >
        {text}
      </motion.p>
    </div>
  );
}
