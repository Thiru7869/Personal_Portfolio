/** A soft light beam that drifts down the section — Experience. */
export function TimelineLighting() {
  return (
    <>
      <div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgb(var(--c-brand) / 0.16) 45%, rgb(var(--c-brand) / 0.16) 55%, transparent)",
        }}
      />
      <div
        className="timeline-sweep absolute left-1/2 h-[38%] w-[65%] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(ellipse, rgb(var(--c-brand) / 0.09), transparent 70%)",
        }}
      />
    </>
  );
}
