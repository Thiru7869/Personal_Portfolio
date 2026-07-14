/** Layered wave silhouettes resting at the bottom of a section. */
export function Waves() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-[40vh] w-full opacity-40"
      viewBox="0 0 1200 300"
      preserveAspectRatio="none"
    >
      <path
        d="M0,160 C300,110 500,210 720,160 C940,110 1080,190 1200,150 L1200,300 L0,300 Z"
        fill="rgb(var(--c-brand) / 0.05)"
      />
      <path
        d="M0,210 C260,170 520,250 780,205 C1000,168 1120,225 1200,200 L1200,300 L0,300 Z"
        fill="rgb(var(--c-brand2) / 0.05)"
      />
      <path
        d="M0,250 C320,225 620,280 900,245 C1060,226 1150,255 1200,245 L1200,300 L0,300 Z"
        fill="rgb(var(--c-mute) / 0.06)"
      />
    </svg>
  );
}
