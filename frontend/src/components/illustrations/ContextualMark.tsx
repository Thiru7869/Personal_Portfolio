/**
 * ContextualMark — small, low-opacity line-art watermarks used as
 * decorative corner accents (About, Now/Uses, Footer, Terminal
 * desktop wallpaper). Pure inline SVG, self-authored (no external
 * art, no AI-generated assets), stroke-only to match the existing
 * lucide-react icon language, theme-reactive via currentColor.
 * Always aria-hidden and pointer-events-none — decoration only.
 */
export type ContextualMarkKind = "penguin" | "branch" | "brackets" | "mug";

export function ContextualMark({
  kind,
  className = "",
}: {
  kind: ContextualMarkKind;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };

  switch (kind) {
    // A friendly, abstracted penguin silhouette — a nod to Linux/Parrot
    // OS without reproducing either project's actual logo.
    case "penguin":
      return (
        <svg {...common}>
          <path d="M32 8c9 0 15 8 15 18 0 11-4 20-4 26 0 4-4 4-4 0 0-4 1-9-2-9s-2 5-2 9c0 4-4 4-4 0 0-4 1-9-2-9s-2 5-2 9c0 4-4 4-4 0 0-6-4-15-4-26 0-10 6-18 15-18Z" />
          <circle cx="27" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="37" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <path d="M29 25c1.5 1 4.5 1 6 0" />
        </svg>
      );

    // Three linked nodes — an open-source branch/fork network.
    case "branch":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="5" />
          <circle cx="16" cy="48" r="5" />
          <circle cx="46" cy="32" r="5" />
          <path d="M16 21v16a11 11 0 0 0 11 11" />
          <path d="M27 48h8" />
          <path d="M16 21c0 8 6 8 6 8" />
          <path d="M22 29c8 0 8 3 8 3" />
        </svg>
      );

    // Oversized angle brackets — the plain "coding" reference.
    case "brackets":
      return (
        <svg {...common}>
          <path d="M24 14 10 32l14 18" />
          <path d="M40 14l14 18-14 18" />
        </svg>
      );

    // A mug with a couple of steam curls — the "survival" reference
    // (running on caffeine), used sparingly near current-focus copy.
    case "mug":
      return (
        <svg {...common}>
          <path d="M14 26h26v14a9 9 0 0 1-9 9h-8a9 9 0 0 1-9-9V26Z" />
          <path d="M40 30h4a5 5 0 0 1 0 10h-4" />
          <path d="M22 20c-1-2 1-3 0-5" />
          <path d="M29 20c-1-2 1-3 0-5" />
        </svg>
      );

    default:
      return null;
  }
}
