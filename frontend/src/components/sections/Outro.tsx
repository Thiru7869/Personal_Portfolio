"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, RotateCcw, Send } from "lucide-react";
import { site } from "@/config/site";
import { scrollToSection } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Outro — the story's ending. After Contact, a quiet thank-you
 * sign-off: the mark pulses once, a closing line lands, and three
 * gentle exits (back to top, replay the intro, say hello). The
 * page ends on purpose instead of just running out of sections.
 */
export function Outro() {
  const reduce = useReducedMotion();

  return (
    <section id="outro" aria-label="Thank you" className="section-pad">
      <div className="section-shell flex flex-col items-center pb-10 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="text-brand"
        >
          <Logo variant="mark" className="scale-150" />
        </motion.div>

        <Reveal delay={0.1} className="mt-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Thanks for scrolling this far.
          </h2>
        </Reveal>

        <Reveal delay={0.2} className="mt-4 max-w-lg">
          <p className="text-mute">
            This site is one of my projects — every mode, animation, and API
            behind it is hand-built. If it made you curious about working
            together, that was the point.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="btn-primary"
            >
              <Send size={14} aria-hidden="true" />
              Say hello
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("replay-boot"))}
              className="btn-ghost"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Replay intro
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
              className="btn-ghost"
            >
              <ArrowUp size={14} aria-hidden="true" />
              Back to top
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.4} className="mt-10">
          <p className="font-mono text-xs text-mute">
            — {site.shortName}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
