"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * DeveloperAtDesk — a small, self-authored vector illustration (plain
 * SVG shapes + Framer Motion loops, no external art, no Lottie/AI-art
 * dependency) for Developer Dashboard mode's About widget: a developer
 * at a desk with a laptop, coffee, glasses, and a short beard. Idle
 * loops (blink, typing bounce, coffee steam, monitor glow, floating
 * motes) all pause under prefers-reduced-motion, leaving a static
 * scene instead of stopping mid-animation.
 */
export function DeveloperAtDesk({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const loop = (duration: number, repeatDelay = 0) =>
    reduce ? undefined : { duration, repeat: Infinity, repeatDelay, ease: "easeInOut" as const };

  return (
    <svg
      viewBox="0 0 320 210"
      className={className}
      role="img"
      aria-label="Illustration of a developer coding at a desk with a laptop and a cup of coffee"
    >
      {/* Ambient floating motes */}
      {[
        { cx: 46, cy: 40, r: 2.4, dur: 5.5 },
        { cx: 270, cy: 60, r: 2, dur: 6.5 },
        { cx: 288, cy: 110, r: 1.8, dur: 4.8 },
        { cx: 34, cy: 100, r: 1.6, dur: 5.8 },
      ].map((m, i) => (
        <motion.circle
          key={i}
          cx={m.cx}
          cy={m.cy}
          r={m.r}
          fill="rgb(var(--c-brand) / 0.35)"
          animate={reduce ? undefined : { y: [0, -8, 0], opacity: [0.25, 0.6, 0.25] }}
          transition={loop(m.dur)}
        />
      ))}

      {/* Desk */}
      <rect x="18" y="172" width="284" height="9" rx="3" fill="rgb(var(--c-line))" />
      <rect x="30" y="181" width="7" height="24" fill="rgb(var(--c-line))" />
      <rect x="283" y="181" width="7" height="24" fill="rgb(var(--c-line))" />

      {/* Potted plant, desk-left */}
      <path d="M78 172c-3-10-3-18 4-24 7 6 7 14 4 24Z" fill="rgb(var(--c-brand2) / 0.55)" />
      <path d="M83 172c-2-8-1-15 3-20 4 5 5 12 3 20Z" fill="rgb(var(--c-brand2) / 0.4)" />
      <rect x="75" y="172" width="16" height="12" rx="2" fill="rgb(var(--c-mute) / 0.5)" />

      {/* Book stack, desk-right */}
      <rect x="238" y="163" width="34" height="7" rx="1.5" fill="rgb(var(--c-brand) / 0.45)" />
      <rect x="240" y="156" width="30" height="7" rx="1.5" fill="rgb(var(--c-brand2) / 0.45)" />
      <rect x="238" y="149" width="26" height="7" rx="1.5" fill="rgb(var(--c-mute) / 0.5)" />

      {/* Monitor glow — a soft ambient bloom behind the laptop screen */}
      <motion.ellipse
        cx="160"
        cy="118"
        rx="66"
        ry="36"
        fill="rgb(var(--c-brand) / 0.16)"
        animate={reduce ? undefined : { opacity: [0.35, 0.65, 0.35] }}
        transition={loop(3.2)}
      />

      {/* Laptop */}
      <rect x="118" y="118" width="88" height="54" rx="4" fill="rgb(var(--c-card))" stroke="rgb(var(--c-line))" strokeWidth="2" />
      <rect x="126" y="126" width="72" height="38" rx="2" fill="rgb(var(--c-brand) / 0.1)" />
      <rect x="132" y="132" width="28" height="3" rx="1.5" fill="rgb(var(--c-brand))" opacity="0.75" />
      <rect x="132" y="139" width="44" height="3" rx="1.5" fill="rgb(var(--c-brand2))" opacity="0.6" />
      <rect x="132" y="146" width="19" height="3" rx="1.5" fill="rgb(var(--c-brand))" opacity="0.5" />
      <rect x="132" y="153" width="36" height="3" rx="1.5" fill="rgb(var(--c-mute))" opacity="0.6" />
      <path d="M108 172h116l6 9H102l6-9Z" fill="rgb(var(--c-line))" />

      {/* Torso, behind the laptop base */}
      <rect x="138" y="108" width="44" height="46" rx="14" fill="rgb(var(--c-brand) / 0.28)" />

      {/* Head */}
      <circle cx="160" cy="86" r="17" fill="rgb(226 189 148)" />
      {/* Short beard */}
      <path d="M147 90c2 8 7 13 13 13s11-5 13-13c-3 3-8 5-13 5s-10-2-13-5Z" fill="rgb(90 68 50)" />
      {/* Glasses */}
      <circle cx="153" cy="83" r="6.5" fill="none" stroke="rgb(var(--c-ink))" strokeWidth="1.6" />
      <circle cx="167" cy="83" r="6.5" fill="none" stroke="rgb(var(--c-ink))" strokeWidth="1.6" />
      <path d="M159.5 83h1" stroke="rgb(var(--c-ink))" strokeWidth="1.6" />
      {/* Eyes — blink by squashing vertically every few seconds */}
      <motion.g
        style={{ transformOrigin: "153px 83px" }}
        animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 0.28, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
      >
        <circle cx="153" cy="83" r="1.4" fill="rgb(var(--c-ink))" />
      </motion.g>
      <motion.g
        style={{ transformOrigin: "167px 83px" }}
        animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 0.28, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }}
      >
        <circle cx="167" cy="83" r="1.4" fill="rgb(var(--c-ink))" />
      </motion.g>

      {/* Hands — a tiny bounce near the keyboard reads as typing */}
      <motion.rect
        x="141"
        y="163"
        width="11"
        height="7"
        rx="3"
        fill="rgb(226 189 148)"
        animate={reduce ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="176"
        y="163"
        width="11"
        height="7"
        rx="3"
        fill="rgb(226 189 148)"
        animate={reduce ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
      />

      {/* Coffee mug + steam, desk-right of the laptop */}
      <path d="M214 148h22v14a11 11 0 0 1-11 11 11 11 0 0 1-11-11Z" fill="rgb(var(--c-card))" stroke="rgb(var(--c-line))" strokeWidth="1.6" />
      <path d="M236 152h4a5 5 0 0 1 0 10h-4" fill="none" stroke="rgb(var(--c-line))" strokeWidth="1.6" />
      <motion.path
        d="M219 145c-1-2 1-3 0-5"
        fill="none"
        stroke="rgb(var(--c-mute))"
        strokeWidth="1.4"
        strokeLinecap="round"
        animate={reduce ? undefined : { opacity: [0.15, 0.6, 0.15], y: [0, -3, 0] }}
        transition={loop(2.4)}
      />
      <motion.path
        d="M227 145c-1-2 1-3 0-5"
        fill="none"
        stroke="rgb(var(--c-mute))"
        strokeWidth="1.4"
        strokeLinecap="round"
        animate={reduce ? undefined : { opacity: [0.15, 0.6, 0.15], y: [0, -3, 0] }}
        transition={{ ...loop(2.4), delay: 0.8 }}
      />
    </svg>
  );
}
