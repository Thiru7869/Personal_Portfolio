"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems } from "@/config/navigation";
import { site } from "@/config/site";
import { EASE_OUT } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";
import { AppearanceToggle, ModeSwitcher } from "@/components/layout/ThemeSwitcher";
import { Logo } from "@/components/layout/Logo";

/**
 * Navbar — minimal sticky navigation: THIRU logo left, links
 * centered, appearance toggle + mode switcher + resume right.
 * Gains a glass blur once scrolled. A scroll-spy highlights the
 * link whose section is currently centered in the viewport, with
 * a shared-layout pill gliding between links.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Scroll-spy: whichever nav-target section is most centered wins.
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    const ids = navItems.filter((i) => !i.target.startsWith("/")).map((i) => i.target);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  /** Active state: section links via scroll-spy, page links via path. */
  function isActive(target: string): boolean {
    if (target.startsWith("/")) return pathname.startsWith(target);
    return pathname === "/" && activeSection === target;
  }

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
          {navItems.map((item) => {
            const active = isActive(item.target);
            const linkClass = cn(
              "relative rounded-lg px-3 py-2 text-sm transition-colors hover:text-brand",
              active ? "text-brand" : "text-mute"
            );
            const pill = active && (
              <motion.span
                layoutId="nav-active-pill"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
                className="absolute inset-0 -z-10 rounded-lg bg-brand/10"
                aria-hidden="true"
              />
            );
            return (
              <li key={item.label}>
                {item.target.startsWith("/") ? (
                  <Link
                    href={item.target}
                    aria-current={active ? "page" : undefined}
                    className={linkClass}
                  >
                    {pill}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSectionClick(item.target)}
                    aria-current={active ? "true" : undefined}
                    className={linkClass}
                  >
                    {pill}
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
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
            transition={{ duration: 0.28, ease: EASE_OUT }}
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
