/** Soft, slow-drifting radial blobs — Hero and Services. */
export function Aurora() {
  return (
    <>
      <div
        className="absolute -top-1/4 left-1/4 h-[60vh] w-[70vw] animate-float rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgb(var(--c-brand) / 0.08), transparent 65%)",
          animationDuration: "16s",
        }}
      />
      <div
        className="absolute -bottom-1/4 right-1/4 h-[55vh] w-[60vw] animate-float rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgb(var(--c-brand2) / 0.06), transparent 65%)",
          animationDuration: "22s",
          animationDelay: "4s",
        }}
      />
    </>
  );
}
