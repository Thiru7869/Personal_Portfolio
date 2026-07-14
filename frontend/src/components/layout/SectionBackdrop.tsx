"use client";

import { useEffect, useRef, useState } from "react";
import { Aurora } from "@/components/layout/backdrops/Aurora";
import { Grid } from "@/components/layout/backdrops/Grid";
import { Blueprint } from "@/components/layout/backdrops/Blueprint";
import { Waves } from "@/components/layout/backdrops/Waves";
import { TimelineLighting } from "@/components/layout/backdrops/TimelineLighting";
import { NodeCanvas } from "@/components/layout/backdrops/NodeCanvas";

export type SectionBackdropKind =
  | "aurora"
  | "grid"
  | "blueprint"
  | "waves"
  | "timeline"
  | "mesh"
  | "constellation"
  | "matrix";

/**
 * SectionBackdrop — gives one section its own subtle visual
 * identity (spec: Hero=aurora, Projects=blueprint, Skills=neural
 * mesh, Experience=timeline lighting, Contact=constellation; the
 * remaining sections cycle the calmer static primitives so no two
 * adjacent sections repeat). Mounts only while the section is near
 * the viewport (IntersectionObserver) so off-screen sections cost
 * nothing. Drop as the first child of a `position: relative`
 * section — pairs with the global `.section-pad` / `.section-shell`
 * stacking order in globals.css.
 */
export function SectionBackdrop({ kind }: { kind: SectionBackdropKind }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="section-backdrop-host" aria-hidden="true">
      {visible && (
        <>
          {kind === "aurora" && <Aurora />}
          {kind === "grid" && <Grid />}
          {kind === "blueprint" && <Blueprint />}
          {kind === "waves" && <Waves />}
          {kind === "timeline" && <TimelineLighting />}
          {kind === "mesh" && <NodeCanvas variant="mesh" />}
          {kind === "constellation" && <NodeCanvas variant="constellation" />}
          {kind === "matrix" && <NodeCanvas variant="matrix" />}
        </>
      )}
    </div>
  );
}
