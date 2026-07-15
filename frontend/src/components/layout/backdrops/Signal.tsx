/** Two overlapping sparkline traces with a moving-dash pulse — Activity, Insights. */
export function Signal() {
  return (
    <svg
      className="absolute inset-x-0 top-1/3 h-28 w-full opacity-35"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0,60 L90,60 L110,25 L130,95 L150,45 L170,60 L340,60 L360,20 L380,100 L400,60 L600,60 L620,30 L640,90 L660,60 L860,60 L880,15 L900,105 L920,60 L1200,60"
        stroke="rgb(var(--c-brand))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="10 6"
        className="signal-flow"
      />
      <path
        d="M0,80 L150,80 L170,55 L190,100 L210,80 L500,80 L520,50 L540,100 L560,80 L900,80 L920,55 L940,100 L960,80 L1200,80"
        stroke="rgb(var(--c-brand2))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="8 8"
        style={{ animationDelay: "0.8s" }}
        className="signal-flow"
      />
    </svg>
  );
}
