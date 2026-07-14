"use client";

import { useEffect, useRef } from "react";
import { SECTION_IDS, type SectionId } from "@shared/constants";

/** Subtle per-section cursor accent — alternates between the active
 *  mode's two accent tokens, so the glow never clashes with a
 *  theme's palette, it just nudges hue as you scroll between
 *  sections. No new cursor shapes, ever — just a color shift. */
const SECTION_ACCENT: Record<SectionId, "brand" | "brand2"> = {
  home: "brand",
  about: "brand2",
  terminal: "brand",
  skills: "brand2",
  projects: "brand",
  activity: "brand2",
  experience: "brand",
  education: "brand2",
  research: "brand",
  certificates: "brand2",
  services: "brand",
  now: "brand2",
  testimonials: "brand",
  faq: "brand2",
  rating: "brand",
  insights: "brand2",
  contact: "brand",
};

/**
 * CustomCursor — one elegant magnetic cursor: a small dot plus a
 * soft, slower-trailing glow halo. The native cursor stays visible
 * (accessibility first). Fine-pointer devices only; hidden for
 * reduced-motion via CSS. The glow's hue nudges per active section
 * via --c-cursor-accent (globals.css), watched with an
 * IntersectionObserver — never a different cursor per section.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!dot || !halo) return;

    let dotRaf = 0;
    let haloRaf = 0;
    let hasMoved = false;
    const target = { x: -9999, y: -9999 };
    const haloPos = { x: -9999, y: -9999 };

    function onMove(e: MouseEvent) {
      const t = e.target as HTMLElement;
      const interactive = !!t.closest(
        "a, button, input, textarea, select, summary, [role='button'], [role='option']"
      );
      hasMoved = true;
      target.x = e.clientX;
      target.y = e.clientY;
      cancelAnimationFrame(dotRaf);
      dotRaf = requestAnimationFrame(() => {
        dot!.style.transform = `translate(${target.x}px, ${target.y}px) scale(${interactive ? 2.4 : 1})`;
        dot!.style.opacity = interactive ? "0.45" : "0.8";
      });
    }
    function onLeave() {
      dot!.style.opacity = "0";
      halo!.style.opacity = "0";
    }

    function haloFrame() {
      haloPos.x += (target.x - haloPos.x) * 0.12;
      haloPos.y += (target.y - haloPos.y) * 0.12;
      halo!.style.transform = `translate(${haloPos.x}px, ${haloPos.y}px)`;
      halo!.style.opacity = hasMoved ? "0.5" : "0";
      haloRaf = requestAnimationFrame(haloFrame);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    haloRaf = requestAnimationFrame(haloFrame);

    return () => {
      cancelAnimationFrame(dotRaf);
      cancelAnimationFrame(haloRaf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Section-aware accent: whichever section is most centered wins.
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
        const accent = SECTION_ACCENT[visible.target.id as SectionId] ?? "brand";
        document.documentElement.style.setProperty(
          "--c-cursor-accent",
          `var(--c-${accent})`
        );
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={haloRef} className="cursor-halo hidden opacity-0 md:block" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot hidden opacity-0 md:block" aria-hidden="true" />
    </>
  );
}
