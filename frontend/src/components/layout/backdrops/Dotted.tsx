/** Dot-grid texture, masked to a soft ellipse — Certificates, FAQ. */
export function Dotted() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(rgb(var(--c-line)) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maskImage: "radial-gradient(ellipse 75% 60% at 50% 40%, black 25%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 60% at 50% 40%, black 25%, transparent 78%)",
      }}
    />
  );
}
