const PARTICLES = [
  { top: "14%", left: "8%", size: 5, duration: "10s", delay: "0s", color: "--c-brand" },
  { top: "22%", left: "82%", size: 7, duration: "13s", delay: "1s", color: "--c-brand2" },
  { top: "68%", left: "18%", size: 4, duration: "9s", delay: "2.5s", color: "--c-brand2" },
  { top: "78%", left: "70%", size: 6, duration: "15s", delay: "0.5s", color: "--c-brand" },
  { top: "40%", left: "45%", size: 3, duration: "11s", delay: "3s", color: "--c-mute" },
  { top: "10%", left: "55%", size: 4, duration: "12s", delay: "1.5s", color: "--c-brand" },
  { top: "85%", left: "35%", size: 5, duration: "14s", delay: "4s", color: "--c-brand2" },
  { top: "55%", left: "12%", size: 3, duration: "9.5s", delay: "2s", color: "--c-mute" },
] as const;

/** CSS-only drifting dots — no canvas, no JS beyond a static loop — Services. */
export function Particles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-float rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: `rgb(var(${p.color}) / 0.4)`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
}
