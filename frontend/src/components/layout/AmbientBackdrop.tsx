/**
 * AmbientBackdrop — a quiet, static global wash sitting behind
 * every section (`.ambient-host`, z-index -1 in globals.css). Each
 * section now carries its own subtle identity via SectionBackdrop;
 * this just ties them together with a barely-there top glow and
 * bottom vignette so the page doesn't feel like flat panels
 * stacked on top of each other. Pure CSS — no canvas, no
 * randomness, effectively free at runtime.
 */
export function AmbientBackdrop() {
  return (
    <div className="ambient-host" aria-hidden="true">
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
    </div>
  );
}
