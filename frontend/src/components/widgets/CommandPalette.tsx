"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  BookOpen,
  Compass,
  Copy,
  CornerDownLeft,
  Download,
  Eye,
  FolderKanban,
  MessageCircleQuestion,
  Palette,
  RotateCcw,
  Search,
  Share2,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { SECTION_IDS } from "@shared/constants";
import { modes } from "@/config/modes";
import { site } from "@/config/site";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { useExperience } from "@/lib/theme-context";
import { cn, scrollToSection } from "@/lib/utils";

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  group: string;
  icon: LucideIcon;
  keywords: string;
  perform: () => void;
}

const sectionLabels: Record<string, string> = {
  home: "Hero",
  about: "About",
  terminal: "Terminal",
  skills: "Skills",
  projects: "Projects",
  activity: "Latest Activity (GitHub · LeetCode)",
  experience: "Experience",
  education: "Education",
  research: "Research Paper",
  certificates: "Achievements & Certifications",
  services: "What I Build",
  now: "Now / Learning / Uses",
  testimonials: "Testimonials",
  faq: "FAQ",
  rating: "Ship Readiness Review (rate this portfolio)",
  insights: "Portfolio Insights",
  contact: "Contact",
};

/**
 * CommandPalette — Ctrl+K launcher. Searches sections, themes,
 * projects, skills, experience, education, and actions (resume,
 * AI assistant, blog, Q&A). Full keyboard navigation.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const { setMode, toggleAppearance } = useExperience();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIdx(0);
  }, []);

  const items = useMemo<PaletteItem[]>(() => {
    const goHomeSection = (id: string) => {
      close();
      if (window.location.pathname === "/") scrollToSection(id);
      else router.push(`/#${id}`);
    };

    const nav: PaletteItem[] = SECTION_IDS.map((id) => ({
      id: `section-${id}`,
      label: sectionLabels[id] ?? id,
      hint: "Jump to section",
      group: "Navigate",
      icon: Compass,
      keywords: `go section ${id}`,
      perform: () => goHomeSection(id),
    }));

    const pages: PaletteItem[] = [
      {
        id: "page-blog",
        label: "Blog",
        hint: "Open /blog",
        group: "Navigate",
        icon: BookOpen,
        keywords: "blog articles posts writing",
        perform: () => {
          close();
          router.push("/blog");
        },
      },
      {
        id: "page-qa",
        label: "Q&A",
        hint: "Open /qa",
        group: "Navigate",
        icon: MessageCircleQuestion,
        keywords: "questions answers interview faq",
        perform: () => {
          close();
          router.push("/qa");
        },
      },
    ];

    const actions: PaletteItem[] = [
      {
        id: "action-resume",
        label: "Download Resume",
        hint: "Opens the PDF",
        group: "Actions",
        icon: Download,
        keywords: "cv resume download pdf hire",
        perform: () => {
          close();
          window.open(site.resumeUrl, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "action-ai",
        label: "Ask Thiru Assistant",
        hint: "Open the AI chat",
        group: "Actions",
        icon: Bot,
        keywords: "ai chat assistant bot ask question",
        perform: () => {
          close();
          window.dispatchEvent(new CustomEvent("open-ai-assistant"));
        },
      },
      {
        id: "action-terminal",
        label: "Open Terminal",
        hint: "Jump to the shell",
        group: "Actions",
        icon: TerminalSquare,
        keywords: "terminal shell console commands",
        perform: () => goHomeSection("terminal"),
      },
      {
        id: "action-tour",
        label: "Take a Tour",
        hint: "Guided spotlight walkthrough",
        group: "Actions",
        icon: Compass,
        keywords: "tour guide walkthrough onboarding help",
        perform: () => {
          close();
          if (window.location.pathname !== "/") router.push("/");
          setTimeout(
            () => window.dispatchEvent(new CustomEvent("start-tour")),
            window.location.pathname === "/" ? 0 : 700
          );
        },
      },
      {
        id: "action-copy-email",
        label: "Copy Email",
        hint: site.email,
        group: "Actions",
        icon: Copy,
        keywords: "copy email contact clipboard",
        perform: () => {
          void navigator.clipboard?.writeText(site.email);
          close();
        },
      },
      {
        id: "action-copy-github",
        label: "Copy GitHub URL",
        hint: site.github,
        group: "Actions",
        icon: Copy,
        keywords: "copy github profile clipboard",
        perform: () => {
          void navigator.clipboard?.writeText(site.github);
          close();
        },
      },
      {
        id: "action-copy-phone",
        label: "Copy Phone",
        hint: site.phone,
        group: "Actions",
        icon: Copy,
        keywords: "copy phone number contact clipboard",
        perform: () => {
          void navigator.clipboard?.writeText(site.phone);
          close();
        },
      },
      {
        id: "action-share",
        label: "Share Portfolio",
        hint: "Native share, or copies the URL",
        group: "Actions",
        icon: Share2,
        keywords: "share send link native",
        perform: () => {
          close();
          const url = window.location.origin;
          if (navigator.share) {
            void navigator
              .share({ title: `${site.name} — Portfolio`, url })
              .catch(() => undefined);
          } else {
            void navigator.clipboard?.writeText(url);
          }
        },
      },
      {
        id: "action-focus",
        label: "Toggle Focus Mode",
        hint: "Hush backdrops and ambient effects",
        group: "Actions",
        icon: Eye,
        keywords: "focus reading mode calm distraction free",
        perform: () => {
          const root = document.documentElement;
          root.setAttribute(
            "data-focus",
            root.getAttribute("data-focus") === "true" ? "false" : "true"
          );
          close();
        },
      },
      {
        id: "action-replay-boot",
        label: "Replay Intro",
        hint: "Watch the boot sequence again",
        group: "Actions",
        icon: RotateCcw,
        keywords: "replay boot intro startup animation welcome",
        perform: () => {
          close();
          window.dispatchEvent(new CustomEvent("replay-boot"));
        },
      },
    ];

    const modeItems: PaletteItem[] = [
      {
        id: "appearance-toggle",
        label: "Toggle Light / Dark",
        hint: "Sun and moon, one keystroke",
        group: "Modes",
        icon: Palette,
        keywords: "theme appearance light dark toggle sun moon",
        perform: () => {
          toggleAppearance();
          close();
        },
      },
      ...modes.map((m) => ({
        id: `mode-${m.id}`,
        label: `Mode: ${m.label}`,
        hint: m.tagline,
        group: "Modes",
        icon: Palette,
        keywords: `mode experience ${m.id} ${m.label} ${m.takeover ? "takeover" : ""}`,
        perform: () => {
          setMode(m.id);
          close();
        },
      })),
    ];

    const projectItems: PaletteItem[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      hint: p.tagline,
      group: "Projects",
      icon: FolderKanban,
      keywords: `project ${p.techStack.join(" ")} ${p.tagline}`,
      perform: () => goHomeSection("projects"),
    }));

    const skillItems: PaletteItem[] = skillGroups.flatMap((g) =>
      g.skills.map((s) => ({
        id: `skill-${g.id}-${s.name}`,
        label: s.name,
        hint: `${g.label} · ${s.level}`,
        group: "Skills",
        icon: Search,
        keywords: `skill ${g.label} ${s.name}`,
        perform: () => goHomeSection("skills"),
      }))
    );

    const expItems: PaletteItem[] = experience.map((e) => ({
      id: `exp-${e.id}`,
      label: `${e.role} @ ${e.company}`,
      hint: `${e.start} – ${e.end}`,
      group: "Experience & Education",
      icon: Compass,
      keywords: `experience work job ${e.company} ${e.role}`,
      perform: () => goHomeSection("experience"),
    }));

    const eduItems: PaletteItem[] = education.map((e) => ({
      id: `edu-${e.id}`,
      label: e.institution,
      hint: e.degree,
      group: "Experience & Education",
      icon: Compass,
      keywords: `education study college ${e.institution} ${e.degree}`,
      perform: () => goHomeSection("education"),
    }));

    return [...actions, ...nav, ...pages, ...modeItems, ...projectItems, ...skillItems, ...expItems, ...eduItems];
  }, [close, router, setMode, toggleAppearance]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default view: actions + navigation + themes.
      return items.filter((i) =>
        ["Actions", "Navigate", "Modes"].includes(i.group)
      );
    }
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.keywords.toLowerCase().includes(q) ||
        i.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  // Global shortcut + custom event from navbar.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, [close]);

  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      // Remember where focus was so we can restore it on close.
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Trap Tab within the palette so focus can't reach the page behind it.
  function onDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusables = e.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    // Keep the active row in view while arrowing through results.
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${activeIdx}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIdx]?.perform();
    }
  }

  let runningIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] bg-black/60 p-4 pt-[12vh]"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onDialogKeyDown}
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-line bg-card shadow-card"
          >
            <div className="flex items-center gap-3 border-b border-line/60 px-4 transition-colors duration-200 focus-within:border-brand/60">
              <Search size={16} className="shrink-0 text-mute" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search sections, projects, skills, themes…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                className="w-full bg-transparent py-4 text-sm text-ink placeholder:text-mute/60 focus:outline-none"
              />
              <kbd className="shrink-0 rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-mute">
                ESC
              </kbd>
            </div>

            <ul
              id="palette-results"
              ref={listRef}
              role="listbox"
              aria-label="Results"
              className="max-h-[50vh] overflow-y-auto p-2"
            >
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-mute">
                  Nothing matches “{query}”. Try “projects”, “terminal”, or “resume”.
                </li>
              )}
              {grouped.map(([group, groupItems]) => (
                <li key={group}>
                  <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-mute">
                    {group}
                  </p>
                  <ul>
                    {groupItems.map((item) => {
                      runningIdx += 1;
                      const idx = runningIdx;
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={idx === activeIdx}
                            data-idx={idx}
                            onClick={item.perform}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                              idx === activeIdx ? "bg-brand/12 text-brand" : "text-ink"
                            )}
                          >
                            <Icon
                              size={15}
                              className={idx === activeIdx ? "text-brand" : "text-mute"}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {item.label}
                              </span>
                              <span className="block truncate text-xs text-mute">
                                {item.hint}
                              </span>
                            </span>
                            {idx === activeIdx && (
                              <CornerDownLeft size={13} className="text-mute" aria-hidden="true" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 border-t border-line/60 bg-surface/50 px-4 py-2.5 font-mono text-[10px] text-mute">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
              <span className="ml-auto">{filtered.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
