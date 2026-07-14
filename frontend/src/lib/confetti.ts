"use client";

/**
 * src/lib/confetti.ts — dependency-free canvas confetti burst.
 * Used for celebration moments (5-star ratings, `sudo hire
 * thiru`). Respects prefers-reduced-motion by doing nothing.
 */

export function fireConfetti(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:130;pointer-events:none";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const styles = getComputedStyle(document.documentElement);
  const brand = `rgb(${styles.getPropertyValue("--c-brand").trim().split(" ").join(",")})`;
  const brand2 = `rgb(${styles.getPropertyValue("--c-brand2").trim().split(" ").join(",")})`;
  const ink = `rgb(${styles.getPropertyValue("--c-ink").trim().split(" ").join(",")})`;
  const colors = [brand, brand2, ink];

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    spin: number;
  }

  const particles: Particle[] = Array.from({ length: 120 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 200,
    y: canvas.height * 0.55,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 15 - 6,
    size: Math.random() * 7 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
  }));

  const start = performance.now();
  const DURATION = 1800;

  function frame(now: number) {
    const elapsed = now - start;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.99;
      p.rotation += p.spin;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = Math.max(0, 1 - elapsed / DURATION);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx!.restore();
    }

    if (elapsed < DURATION) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}
