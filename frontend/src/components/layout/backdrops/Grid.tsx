/** Faint graph-paper grid, masked to a soft ellipse — calm, static. */
export function Grid() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgb(var(--c-line) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-line) / 0.5) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, black 20%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 60% at 50% 35%, black 20%, transparent 75%)",
      }}
    />
  );
}
