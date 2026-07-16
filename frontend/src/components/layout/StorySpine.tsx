"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

/**
 * StorySpine — the single device that makes the homepage read as
 * one journey: a thin fixed line on the left edge (xl screens only)
 * that fills with scroll progress, lighting an act node as each
 * chapter of the story is reached. Purely decorative (aria-hidden,
 * non-interactive); mobile relies on the StoryBridges instead.
 */

/** Act anchors — the section that OPENS each act. */
const ACT_ANCHORS = [
  { id: "home", label: "Arrival" },
  { id: "about", label: "Who I am" },
  { id: "skills", label: "What I can do" },
  { id: "research", label: "Depth" },
  { id: "testimonials", label: "Connect" },
] as const;

export function StorySpine() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const [fractions, setFractions] = useState<number[]>([]);
  const [reached, setReached] = useState(0);

  // Measure each act anchor's position as a fraction of total scroll.
  useEffect(() => {
    function measure() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setFractions(
        ACT_ANCHORS.map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return 1;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return Math.min(Math.max((top - window.innerHeight * 0.4) / scrollable, 0), 1);
        })
      );
    }
    measure();
    window.addEventListener("resize", measure);
    // Content below (images, lazy widgets) can shift heights — re-measure once settled.
    const t = setTimeout(measure, 1500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let count = 0;
    for (const f of fractions) if (v >= f) count += 1;
    setReached(count);
  });

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-6 z-30 hidden items-center xl:flex"
    >
      <div className="relative h-[62vh]">
        {/* Rail + fill */}
        <span className="absolute inset-y-0 left-0 w-px bg-line/70" />
        <motion.span
          style={{ scaleY: fill }}
          className="absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-brand to-brand2"
        />
        {/* Act nodes, evenly spaced along the visible rail */}
        {ACT_ANCHORS.map((act, i) => {
          const lit = i < reached;
          return (
            <span
              key={act.id}
              style={{ top: `${(i / (ACT_ANCHORS.length - 1)) * 100}%` }}
              className="absolute -left-[3.5px] flex items-center gap-2"
            >
              <span
                className={`h-2 w-2 rounded-full border transition-all duration-500 ${
                  lit
                    ? "border-brand bg-brand shadow-glow"
                    : "border-line bg-bg"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-widest transition-all duration-500 ${
                  lit ? "text-brand opacity-100" : "text-mute opacity-0"
                }`}
              >
                {act.label}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
