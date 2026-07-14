/** Layered blueprint grid — Projects. */
export function Blueprint() {
  return (
    <div
      className="absolute inset-0 opacity-[0.55]"
      style={{
        backgroundImage:
          "linear-gradient(rgb(var(--c-brand) / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-brand) / 0.12) 1px, transparent 1px), linear-gradient(rgb(var(--c-brand) / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-brand) / 0.05) 1px, transparent 1px)",
        backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        maskImage: "linear-gradient(180deg, black, transparent 85%)",
        WebkitMaskImage: "linear-gradient(180deg, black, transparent 85%)",
      }}
    />
  );
}
