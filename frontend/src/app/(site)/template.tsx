"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * (site) template — Next.js remounts this on every navigation
 * (unlike layout, which persists), so it's the right place for a
 * page-transition smoothing fade. Deliberately opacity-only and
 * short: page content already has its own Reveal entrances, so
 * this just softens the "flash of new page" cut rather than
 * adding a second, competing motion on top.
 */
export default function SiteTemplate({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
