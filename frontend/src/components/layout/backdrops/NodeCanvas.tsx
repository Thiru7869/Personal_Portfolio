"use client";

import { useEffect, useRef } from "react";
import { themeVar } from "@/lib/theme-vars";

type Variant = "mesh" | "constellation" | "matrix";

interface NodeConfig {
  count: number;
  maxDist: number;
  speed: number;
  colorVar: "--c-brand" | "--c-brand2";
  dotAlpha: number;
  linkAlpha: number;
  minR: number;
  maxR: number;
}

/** mesh = Skills / AI workspace. constellation = Contact. */
const CONFIG: Record<Exclude<Variant, "matrix">, NodeConfig> = {
  mesh: {
    count: 20,
    maxDist: 105,
    speed: 0.045,
    colorVar: "--c-brand",
    dotAlpha: 0.5,
    linkAlpha: 0.13,
    minR: 1.4,
    maxR: 2.6,
  },
  constellation: {
    count: 15,
    maxDist: 150,
    speed: 0.035,
    colorVar: "--c-brand2",
    dotAlpha: 0.6,
    linkAlpha: 0.16,
    minR: 1.6,
    maxR: 3,
  },
};

const GLYPHS = "01+-<>[]{}/\\".split("");

/**
 * NodeCanvas — one canvas primitive, three looks: a slow linked
 * node "mesh" (Skills, AI workspace), a sparser "constellation"
 * (Contact), and a restrained falling-glyph "matrix" (Developer
 * Dashboard takeover). DPR-aware, pauses off-tab, static for
 * reduced-motion. Sized to its positioned parent — drop it inside
 * a `position: relative` host.
 */
export function NodeCanvas({ variant, className = "" }: { variant: Variant; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function size() {
      const parent = canvas!.parentElement;
      w = parent?.clientWidth ?? window.innerWidth;
      h = parent?.clientHeight ?? window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onVisibility(drawFn: () => void) {
      return () => {
        running = document.visibilityState === "visible";
        cancelAnimationFrame(raf);
        if (running && !reduce) raf = requestAnimationFrame(drawFn);
      };
    }

    if (variant === "matrix") {
      const colWidth = 16;
      let columns: { y: number; speed: number; char: string }[] = [];

      function seed() {
        size();
        const count = Math.ceil(w / colWidth);
        columns = Array.from({ length: count }, () => ({
          y: Math.random() * -h,
          speed: 1.1 + Math.random() * 1.5,
          char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        }));
      }

      function draw() {
        if (!running) return;
        const accent = themeVar("--c-term-accent");
        ctx!.clearRect(0, 0, w, h);
        ctx!.font = "13px ui-monospace, monospace";
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          ctx!.fillStyle = `rgba(${accent},0.2)`;
          ctx!.fillText(col.char, i * colWidth, col.y);
          if (!reduce) {
            col.y += col.speed;
            if (Math.random() < 0.02) col.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            if (col.y > h + 20) col.y = Math.random() * -h * 0.5;
          }
        }
        if (!reduce) raf = requestAnimationFrame(draw);
      }

      seed();
      draw();
      const onResize = () => {
        seed();
        if (reduce) draw();
      };
      const onVis = onVisibility(draw);
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVis);
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    const cfg = CONFIG[variant];
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    function seed() {
      size();
      nodes = Array.from({ length: cfg.count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        r: cfg.minR + Math.random() * (cfg.maxR - cfg.minR),
      }));
    }

    function draw() {
      if (!running) return;
      const color = themeVar(cfg.colorVar);
      ctx!.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < cfg.maxDist) {
            ctx!.strokeStyle = `rgba(${color},${(cfg.linkAlpha * (1 - dist / cfg.maxDist)).toFixed(3)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx!.fillStyle = `rgba(${color},${cfg.dotAlpha})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    seed();
    draw();
    const onResize = () => {
      seed();
      if (reduce) draw();
    };
    const onVis = onVisibility(draw);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
}
