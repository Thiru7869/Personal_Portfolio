/** Faint notebook rule lines + a margin rule, masked to a soft ellipse — About. */
export function Paper() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgb(var(--c-line) / 0.55) 27px, rgb(var(--c-line) / 0.55) 28px)",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 40%, black 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 40%, black 20%, transparent 78%)",
        }}
      />
      <div
        className="absolute inset-y-0 left-[9%] w-px"
        style={{
          background: "rgb(var(--c-brand2) / 0.18)",
          maskImage: "linear-gradient(180deg, transparent, black 25%, black 75%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 25%, black 75%, transparent)",
        }}
      />
    </>
  );
}
