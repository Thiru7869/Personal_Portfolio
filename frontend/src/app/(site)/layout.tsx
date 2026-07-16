import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeShell } from "@/components/layout/ThemeShell";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CardSpotlight } from "@/components/layout/CardSpotlight";
import { AmbientBackdrop } from "@/components/layout/AmbientBackdrop";
import { SiteWidgets } from "@/components/widgets/SiteWidgets";

/**
 * (site) layout — the public site chrome. ThemeShell swaps the
 * whole tree for takeover modes (terminal/ai/developer).
 * The /admin area lives outside this group and gets none of it.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeShell>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>
      <AmbientBackdrop />
      <ScrollProgress />
      <CardSpotlight />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <SiteWidgets />
    </ThemeShell>
  );
}
