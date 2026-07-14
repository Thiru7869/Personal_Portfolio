"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems } from "@/config/navigation";
import { site } from "@/config/site";
import { cn, scrollToSection } from "@/lib/utils";
import { AppearanceToggle, ModeSwitcher } from "@/components/layout/ThemeSwitcher";
import { Logo } from "@/components/layout/Logo";

/**
 * Navbar — minimal sticky navigation: THIRU logo left, links
 * centered, appearance toggle + mode switcher + resume right.
 * Gains a glass blur once scrolled.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function handleSectionClick(target: string) {
    setMobileOpen(false);
    if (pathname === "/") {
      scrollToSection(target);
    } else {
      router.push(`/#${target}`);
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "glass border-b border-line/70" : "bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8"
      >
        {/* Logo — the only place the name is shortened */}
        <Link href="/" aria-label={`${site.name} — home`} className="w-fit">
          <Logo variant="compact" />
        </Link>

        {/* Center links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.target.startsWith("/") ? (
                <Link
                  href={item.target}
                  className="rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSectionClick(item.target)}
                  className="rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:text-brand"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Right: appearance, mode, resume */}
        <div className="flex items-center justify-end gap-2">
          <AppearanceToggle />
          <ModeSwitcher />
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden !px-4 !py-2 text-xs sm:inline-flex"
          >
            <Download size={13} aria-hidden="true" />
            Resume
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card/70 text-mute transition-all duration-200 hover:border-brand/60 hover:text-brand active:scale-[0.98] lg:hidden"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="glass overflow-hidden border-b border-line/70 lg:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.target.startsWith("/") ? (
                    <Link
                      href={item.target}
                      className="block rounded-lg px-3 py-2.5 text-sm text-mute hover:bg-surface hover:text-brand"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSectionClick(item.target)}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-mute hover:bg-surface hover:text-brand"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
              <li>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand"
                >
                  <Download size={14} aria-hidden="true" /> Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
