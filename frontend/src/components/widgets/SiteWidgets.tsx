"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { BootSequence } from "@/components/boot/BootSequence";
import { BackToTop } from "@/components/layout/BackToTop";

/**
 * SiteWidgets — floating layer shared by all public pages.
 * The AI assistant and command palette are code-split and
 * client-only, so they never block first paint or hydration.
 * Also records first-party page views.
 */
const AiAssistant = dynamic(
  () => import("@/components/widgets/AiAssistant").then((m) => m.AiAssistant),
  { ssr: false }
);

const CommandPalette = dynamic(
  () =>
    import("@/components/widgets/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

const QuickTour = dynamic(
  () => import("@/components/widgets/QuickTour").then((m) => m.QuickTour),
  { ssr: false }
);

const GameDialog = dynamic(
  () => import("@/components/game/GameDialog").then((m) => m.GameDialog),
  { ssr: false }
);

export function SiteWidgets() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent({ type: "page_view", path: pathname });
  }, [pathname]);

  return (
    <>
      <BootSequence />
      <BackToTop />
      <AiAssistant />
      <CommandPalette />
      <QuickTour />
      <GameDialog />
    </>
  );
}
