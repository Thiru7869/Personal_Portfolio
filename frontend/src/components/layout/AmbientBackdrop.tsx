"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS, type SectionId } from "@shared/constants";

/**
 * AmbientBackdrop — the global wash behind every section. The base
 * layers (a barely-there top glow + bottom vignette) tie the page
 * together; on top of them, an "act glow" crossfades position and
 * hue as the visitor moves through the story's five acts, so the
 * page's mood shifts with the narrative. Pure CSS layers — the only
 * JS is one IntersectionObserver; transitions are opacity-only.
 */

type Act = 0 | 1 | 2 | 3 | 4;

/** Which act each section belongs to. */
const SECTION_ACT: Record<SectionId, Act> = {
  home: 0,
  about: 1,
  experience: 1,
  education: 1,
  skills: 2,
  projects: 2,
  terminal: 2,
  activity: 2,
  research: 3,
  certificates: 3,
  services: 3,
  now: 3,
  testimonials: 4,
  faq: 4,
  rating: 4,
  insights: 4,
  contact: 4,
  outro: 4,
};

/** Per-act glow: accent token + where the light sits. */
const ACT_GLOW: { color: "--c-brand" | "--c-brand2"; at: string }[] = [
  { color: "--c-brand", at: "50% 0%" }, // arrival — light from above
  { color: "--c-brand2", at: "15% 30%" }, // who I am — warm left
  { color: "--c-brand", at: "85% 40%" }, // what I can do — active right
  { color: "--c-brand2", at: "20% 70%" }, // depth — low left
  { color: "--c-brand", at: "50% 95%" }, // connect — settles below
];

export function AmbientBackdrop() {
  const [act, setAct] = useState<Act>(0);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setAct(SECTION_ACT[visible.target.id as SectionId] ?? 0);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ambient-host" aria-hidden="true">
      {/* Base wash — constant */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgb(var(--c-brand) / 0.05), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgb(var(--c-brand2) / 0.04), transparent 70%)",
        }}
      />
      {/* Act glows — one per act, opacity crossfade only (GPU-cheap) */}
      {ACT_GLOW.map((glow, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: act === i ? 1 : 0,
            background: `radial-gradient(ellipse 55% 45% at ${glow.at}, rgb(var(${glow.color}) / 0.06), transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
