/**
 * AbstractMesh — a small, generative line-art / gradient-mesh
 * illustration: two soft gradient blobs behind a sparse node
 * network. Pure inline SVG (no raster assets, no image-gen API),
 * theme-reactive via the existing --c-brand/--c-brand2 tokens.
 * Used sparingly as a decorative accent — boot welcome card, AI
 * Workspace intro, blog list header.
 */
export function AbstractMesh({
  className = "",
  id = "mesh",
}: {
  className?: string;
  id?: string;
}) {
  const gradientId = `abstract-mesh-${id}`;
  return (
    <svg
      viewBox="0 0 400 140"
      className={className}
      aria-hidden="true"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(var(--c-brand2))" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="45" r="65" fill={`url(#${gradientId})`} opacity="0.35" />
      <circle cx="345" cy="95" r="85" fill={`url(#${gradientId})`} opacity="0.22" />
      <g stroke="rgb(var(--c-brand) / 0.3)" strokeWidth="1">
        <line x1="40" y1="35" x2="118" y2="65" />
        <line x1="118" y1="65" x2="196" y2="28" />
        <line x1="196" y1="28" x2="272" y2="82" />
        <line x1="118" y1="65" x2="176" y2="112" />
        <line x1="272" y1="82" x2="348" y2="55" />
      </g>
      <g fill="rgb(var(--c-brand))">
        <circle cx="40" cy="35" r="2.5" />
        <circle cx="118" cy="65" r="3" />
        <circle cx="196" cy="28" r="2" />
        <circle cx="272" cy="82" r="2.5" />
        <circle cx="176" cy="112" r="2" />
        <circle cx="348" cy="55" r="2.5" />
      </g>
    </svg>
  );
}
