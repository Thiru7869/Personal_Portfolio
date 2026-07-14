"use client";

/* eslint-disable @next/next/no-img-element -- external SVG stat
   cards are already optimized; next/image adds only a proxy hop. */
import { useState } from "react";

/**
 * StatImage — an external stat-card image (GitHub chart, LeetCode
 * card, streak badge) with a `.skeleton` shimmer shown until it
 * loads, fading in once ready. Shared by Activity.tsx and
 * DevDashboard.tsx so both surfaces get the same loading feel.
 */
export function StatImage({
  src,
  alt,
  height,
  minWidth,
  bordered = true,
  onFail,
}: {
  src: string;
  alt: string;
  height: number;
  minWidth?: number;
  /** Set false when the caller already wraps this in a bordered card. */
  bordered?: boolean;
  onFail: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative" style={{ minHeight: loaded ? undefined : height }}>
      {!loaded && <div className="skeleton absolute inset-0" style={{ height }} />}
      <img
        src={src}
        alt={alt}
        className={minWidth ? undefined : "w-full"}
        style={{
          minWidth,
          borderRadius: bordered ? "var(--r-md)" : undefined,
          border: bordered ? "1px solid rgb(var(--c-line) / 0.6)" : undefined,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={onFail}
      />
    </div>
  );
}
