"use client";

import { useEffect, useRef } from "react";
import { themeVar } from "@/lib/theme-vars";

/**
 * TechConstellation — the hero's calm living background: a small,
 * curated set of core-skill nodes drifting slowly along fixed
 * elliptical orbits around generously-spaced anchor points. Motion
 * is deterministic ("predefined paths"), low-opacity, and never
 * overlaps. On top of that base drift, nodes within a small radius
 * of the cursor get a gentle pull toward it — capped, decaying with
 * distance, and drawn with a faint connecting thread — like a soft
 * web reacting to a hand nearby, not a chase. Canvas-based,
 * DPR-aware, pauses when hidden, static (and non-interactive) for
 * reduced-motion.
 */

const TECH_NODES = ["Python", "React", "Next.js", "TypeScript", "Docker", "AWS", "PostgreSQL"];

// Anchor layout as fractions of the canvas, spaced so each node's
// small orbit never reaches its neighbors' orbits.
const ANCHORS = [
  { x: 0.14, y: 0.22 },
  { x: 0.44, y: 0.1 },
  { x: 0.74, y: 0.2 },
  { x: 0.88, y: 0.56 },
  { x: 0.6, y: 0.84 },
  { x: 0.28, y: 0.88 },
  { x: 0.08, y: 0.58 },
];

interface Node {
  anchorX: number;
  anchorY: number;
  orbitRx: number;
  orbitRy: number;
  phase: number;
  speed: number;
  label: string;
  r: number;
}

export function TechConstellation({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let nodes: Node[] = [];
    let running = true;
    let t = 0;
    const PULL_RADIUS = 130;
    const MAX_PULL = 16;
    const mouse = { x: -9999, y: -9999, active: false };

    // Cached theme lookup — refreshed only on mode/appearance change.
    function tokens() {
      return { brand: themeVar("--c-brand"), mute: themeVar("--c-mute") };
    }

    function size() {
      const parent = canvas!.parentElement;
      if (!parent) return { w: 0, h: 0 };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    }

    function seed() {
      const { w, h } = size();
      nodes = TECH_NODES.map((label, i) => {
        const a = ANCHORS[i % ANCHORS.length];
        return {
          anchorX: a.x * w,
          anchorY: a.y * h,
          orbitRx: 16 + (i % 3) * 4,
          orbitRy: 10 + (i % 2) * 4,
          phase: (i / TECH_NODES.length) * Math.PI * 2,
          speed: 0.00022 + (i % 3) * 0.00004,
          r: 2 + (i % 2) * 0.6,
          label,
        };
      });
    }

    function frame() {
      if (!running) return;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      const { brand, mute } = tokens();
      ctx!.clearRect(0, 0, w, h);
      t += 1;

      const positions = nodes.map((n) => {
        const baseX = n.anchorX + Math.cos(t * n.speed + n.phase) * n.orbitRx;
        const baseY = n.anchorY + Math.sin(t * n.speed + n.phase) * n.orbitRy;
        if (!mouse.active) return { x: baseX, y: baseY, pull: 0 };
        const dx = mouse.x - baseX;
        const dy = mouse.y - baseY;
        const dist = Math.hypot(dx, dy);
        if (dist >= PULL_RADIUS || dist < 0.01) return { x: baseX, y: baseY, pull: 0 };
        const pull = (1 - dist / PULL_RADIUS) * MAX_PULL;
        return { x: baseX + (dx / dist) * pull, y: baseY + (dy / dist) * pull, pull: pull / MAX_PULL };
      });

      // Faint links between nearby nodes only — sparse, low opacity.
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dist = Math.hypot(positions[i].x - positions[j].x, positions[i].y - positions[j].y);
          if (dist < 190) {
            ctx!.strokeStyle = `rgba(${brand},${(0.08 * (1 - dist / 190)).toFixed(3)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(positions[i].x, positions[i].y);
            ctx!.lineTo(positions[j].x, positions[j].y);
            ctx!.stroke();
          }
        }
      }

      // A faint thread from the cursor to any node it's currently pulling —
      // the "web reacting to a nearby hand" read.
      if (mouse.active) {
        positions.forEach((p) => {
          if (p.pull <= 0) return;
          ctx!.strokeStyle = `rgba(${brand},${(0.16 * p.pull).toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(mouse.x, mouse.y);
          ctx!.lineTo(p.x, p.y);
          ctx!.stroke();
        });
      }

      nodes.forEach((node, i) => {
        const p = positions[i];
        ctx!.fillStyle = `rgba(${brand},0.42)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, node.r, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.font = "10px ui-monospace, monospace";
        ctx!.fillStyle = `rgba(${mute},0.38)`;
        ctx!.fillText(node.label, p.x + 7, p.y + 3);
      });

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    function onResize() {
      seed();
      frame();
    }
    function onVisibility() {
      running = document.visibilityState === "visible";
      if (running && !reduce) raf = requestAnimationFrame(frame);
    }
    function onMouseMove(e: globalThis.MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onMouseLeave() {
      mouse.active = false;
    }

    seed();
    frame();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    // Reduced-motion users get the calm static frame only — no cursor pull.
    if (!reduce) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onMouseLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
