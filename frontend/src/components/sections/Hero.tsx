"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { heroCards, heroTypingLines } from "@/content/profile";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TechConstellation } from "@/components/hero/TechConstellation";
import { ActionDock } from "@/components/hero/ActionDock";
import { TiltCard } from "@/components/ui/TiltCard";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/** Typing animation cycling through roles. */
function useTypewriter(lines: string[], speed = 65, pause = 1600) {
  const [text, setText] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setText(lines[0]);
      return;
    }
    const current = lines[lineIdx % lines.length];
    let delay = deleting ? speed / 2 : speed;
    if (!deleting && text === current) delay = pause;
    if (deleting && text === "") delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setLineIdx((i) => (i + 1) % lines.length);
      } else {
        setText(current.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, lineIdx, lines, speed, pause, reduce]);

  return text;
}

/**
 * Hero — centered premium landing per the home spec: full name
 * large, floating tech cards, a live constellation of skills
 * behind, an identity card with depth, and a glass action dock.
 * No text-left/image-right anywhere in sight.
 */
export function Hero() {
  const typed = useTypewriter(heroTypingLines);
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8"
    >
      <SectionBackdrop kind="aurora" />

      {/* Skill constellation — the hero's living background */}
      <div aria-hidden="true" className="absolute inset-0">
        <TechConstellation className="h-full w-full opacity-80" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 42%, rgb(var(--c-bg) / 0.88), rgb(var(--c-bg) / 0.35) 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Availability */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="chip mx-auto w-fit !border-brand2/40"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand2 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand2" />
          </span>
          {site.availabilityText}
        </motion.p>

        {/* Introduction */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
          className="mt-8 text-lg text-mute"
        >
          Hi, I&apos;m
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE_OUT }}
          className="mx-auto mt-2 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
        >
          Poluru Thirumala{" "}
          <span className="gradient-text">Narasimha</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE_OUT }}
          className="mt-4 h-7 font-mono text-base text-brand sm:text-lg"
          aria-label={`Roles: ${heroTypingLines.join(", ")}`}
        >
          <span aria-hidden="true">
            {typed}
            <span className="term-caret" />
          </span>
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42, ease: EASE_OUT }}
          className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-mute"
        >
          {site.tagline}
        </motion.p>

        {/* Floating tech cards — independent entrances and drifts */}
        <div className="mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
          {heroCards.map((card, i) => (
            <motion.span
              key={card.label}
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.07, ease: EASE_OUT }}
              whileHover={{ y: -4 }}
              className={cn(
                "card-shell px-4 py-2 text-sm font-medium",
                card.accent ? "!border-brand/40 text-brand" : "text-ink/85"
              )}
            >
              {card.label}
            </motion.span>
          ))}
        </div>

        {/* Action dock */}
        <div className="mt-10">
          <ActionDock />
        </div>

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => window.dispatchEvent(new CustomEvent("start-tour"))}
          className="mx-auto mt-5 flex items-center gap-1.5 text-xs text-mute transition-colors hover:text-brand"
        >
          <Compass size={13} aria-hidden="true" />
          New here? Take the tour
        </motion.button>
      </div>

      {/* Identity card — floats beside the content on wide screens */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
        className="relative z-10 mx-auto mt-12 w-full max-w-xs xl:absolute xl:right-10 xl:top-1/2 xl:mt-0 xl:-translate-y-1/2 2xl:right-24"
      >
        <TiltCard maxTilt={6}>
          <div className="card-shell overflow-hidden">
            <div className="flex items-center justify-between border-b border-line/70 bg-surface/70 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                identity card
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-brand2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand2" aria-hidden="true" />
                available
              </span>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <p className="font-display text-base font-bold leading-tight">
                  {site.name}
                </p>
                <p className="text-xs text-mute">{site.roles[0]}</p>
              </div>
              <dl className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-mute">location</dt>
                  <dd className="flex items-center gap-1 text-ink/90">
                    <MapPin size={10} aria-hidden="true" /> {site.location}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-mute">education</dt>
                  <dd className="text-ink/90">B.Tech CSE</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-mute">experience</dt>
                  <dd className="text-ink/90">SME · Freelance · Research</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-mute">publications</dt>
                  <dd className="text-brand">1 paper (IJNRD)</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-1 border-t border-line/60 pt-3">
                {["Python", "FastAPI", "React", "Docker"].map((t) => (
                  <span key={t} className="chip !px-2 !py-0.5 !text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </section>
  );
}
