"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useExperience } from "@/lib/theme-context";
import { ModeLoadingFallback } from "@/components/layout/ModeLoadingFallback";

const TerminalDesktop = dynamic(
  () => import("@/components/modes/TerminalDesktop").then((m) => m.TerminalDesktop),
  { ssr: false, loading: ModeLoadingFallback }
);
const AiWorkspace = dynamic(
  () => import("@/components/modes/AiWorkspace").then((m) => m.AiWorkspace),
  { ssr: false, loading: ModeLoadingFallback }
);
const DevDashboard = dynamic(
  () => import("@/components/modes/DevDashboard").then((m) => m.DevDashboard),
  { ssr: false, loading: ModeLoadingFallback }
);

/**
 * ThemeShell — takeover modes replace the visual site with
 * their own shells (Parrot desktop, AI workspace, developer
 * dashboard). The regular DOM stays mounted (hidden) so
 * switching back is instant and server-rendered content remains
 * intact for SEO. Professional renders normally.
 */
export function ThemeShell({ children }: { children: ReactNode }) {
  const { mode } = useExperience();
  const takeover = mode === "terminal" || mode === "ai" || mode === "developer";

  return (
    <>
      <div hidden={takeover}>{children}</div>
      {mode === "terminal" && <TerminalDesktop />}
      {mode === "ai" && <AiWorkspace />}
      {mode === "developer" && <DevDashboard />}
    </>
  );
}
