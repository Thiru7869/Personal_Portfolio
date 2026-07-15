"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Clock,
  ExternalLink,
  Folder,
  FolderGit2,
  FolderOpen,
  Github,
  Home,
  PanelLeft,
  Search,
  Star,
} from "lucide-react";
import type { Project } from "@shared/types";
import { projects } from "@/content/projects";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { cn } from "@/lib/utils";

type SortKey = "name" | "year" | "recent";

interface ContextMenuState {
  x: number;
  y: number;
  project: Project;
}

/**
 * ProjectExplorer — the Parrot-file-manager-inspired projects
 * interface. Projects are folders: single click selects,
 * double-click (or Enter) opens the case study, right-click
 * opens a context menu (Open / Live Demo / GitHub / Docs).
 * Toolbar has breadcrumbs, search, sort, and a sidebar toggle; the
 * sidebar lists Recent and Favorites. Used on the homepage and
 * inside the terminal desktop's Files window.
 */
export function ProjectExplorer({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [selected, setSelected] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Homepage shows at most six folders; search filters within them.
  const folders = useMemo(() => {
    const base = projects.slice(0, 6);
    const q = query.trim().toLowerCase();
    const filtered = q
      ? base.filter((p) =>
          `${p.title} ${p.tagline} ${p.techStack.join(" ")}`.toLowerCase().includes(q)
        )
      : base;
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "year") return a.year - b.year;
      return b.year - a.year;
    });
  }, [query, sort]);

  const selectedProject = projects.find((p) => p.slug === selected) ?? null;
  const favorites = projects.filter((p) => p.featured).slice(0, 3);
  const recent = [...projects].sort((a, b) => b.year - a.year).slice(0, 3);

  useEffect(() => {
    if (!menu) return;
    function dismiss() {
      setMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }
    window.addEventListener("click", dismiss);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", dismiss, { passive: true });
    return () => {
      window.removeEventListener("click", dismiss);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", dismiss);
    };
  }, [menu]);

  function onContextMenu(e: React.MouseEvent, project: Project) {
    e.preventDefault();
    setSelected(project.slug);
    const rect = rootRef.current?.getBoundingClientRect();
    setMenu({
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
      project,
    });
  }

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-2xl border border-line/80 bg-card shadow-card"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-line/60 bg-surface/80 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="font-mono text-xs text-mute">files — ~/projects</p>
        <span className="w-12" aria-hidden="true" />
      </div>

      {/* Toolbar: breadcrumbs + search + sort */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line/60 px-4 py-2.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 font-mono text-xs text-mute">
          <Home size={12} aria-hidden="true" />
          <span>home</span>
          <ChevronRight size={11} aria-hidden="true" />
          <span>thiru</span>
          <ChevronRight size={11} aria-hidden="true" />
          <span className="font-semibold text-brand">projects</span>
        </nav>
        <button
          type="button"
          onClick={() => setShowSidebar((v) => !v)}
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
          aria-pressed={showSidebar}
          title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          className={cn(
            "hidden items-center justify-center rounded-lg border p-1.5 transition-colors sm:flex",
            showSidebar
              ? "border-brand/50 text-brand"
              : "border-line text-mute hover:border-brand/50 hover:text-brand"
          )}
        >
          <PanelLeft size={14} aria-hidden="true" />
        </button>
        <div className="relative ml-auto">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search projects"
            className="w-36 rounded-lg border border-line bg-bg py-1.5 pl-8 pr-2 text-xs text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none sm:w-44"
          />
        </div>
        <label className="flex items-center gap-1.5 text-xs text-mute">
          <span className="sr-only sm:not-sr-only">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort projects"
            className="rounded-lg border border-line bg-bg px-2 py-1.5 text-xs text-ink focus:border-brand/60 focus:outline-none"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="year">Oldest</option>
          </select>
        </label>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="hidden w-44 shrink-0 border-r border-line/60 bg-surface/50 p-3 sm:block">
            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-mute">
              places
            </p>
            <p className="flex items-center gap-2 rounded-lg bg-brand/10 px-2 py-1.5 text-xs font-semibold text-brand">
              <FolderOpen size={13} aria-hidden="true" /> Projects
            </p>
            <p className="mt-4 mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-mute">
              recent
            </p>
            {recent.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setOpenProject(p)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-mute transition-colors hover:bg-surface hover:text-ink"
              >
                <Clock size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{p.title}</span>
              </button>
            ))}
            <p className="mt-4 mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-mute">
              favorites
            </p>
            {favorites.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setOpenProject(p)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-mute transition-colors hover:bg-surface hover:text-ink"
              >
                <Star size={12} className="shrink-0 text-brand" aria-hidden="true" />
                <span className="truncate">{p.title}</span>
              </button>
            ))}
          </aside>
        )}

        {/* Folder grid */}
        <div className="min-h-[280px] flex-1 p-4">
          {folders.length === 0 ? (
            <p className="p-8 text-center font-mono text-sm text-mute">
              No folders match “{query}”.
            </p>
          ) : (
            <ul
              role="listbox"
              aria-label="Project folders — select, then click again (or double-click, or press Enter) to open"
              className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}
            >
              {folders.map((project) => {
                const isSelected = selected === project.slug;
                return (
                  <li key={project.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => (isSelected ? setOpenProject(project) : setSelected(project.slug))}
                      onDoubleClick={() => setOpenProject(project)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setOpenProject(project);
                      }}
                      onContextMenu={(e) => onContextMenu(e, project)}
                      title={`${project.description} — click again to open`}
                      className={cn(
                        "flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-4 text-center transition-all",
                        isSelected
                          ? "border-brand/50 bg-brand/10"
                          : "border-transparent hover:border-line hover:bg-surface/70"
                      )}
                    >
                      {project.featured ? (
                        <FolderGit2 size={38} className="text-brand" strokeWidth={1.4} aria-hidden="true" />
                      ) : (
                        <Folder size={38} className="text-brand/80" strokeWidth={1.4} aria-hidden="true" />
                      )}
                      <span className="line-clamp-2 text-xs font-semibold leading-tight">
                        {project.title}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-brand/15 px-1.5 py-0.5 font-mono text-[9px] text-brand">
                          open ↵
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-mute">
                        modified {project.year}
                      </span>
                      <span className="line-clamp-1 font-mono text-[10px] text-mute/80">
                        {project.techStack.slice(0, 3).join(" · ")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 border-t border-line/60 bg-surface/60 px-4 py-2">
        <p className="min-w-0 truncate font-mono text-[11px] text-mute" aria-live="polite">
          {selectedProject
            ? `${selectedProject.description} — click again to open`
            : `${folders.length} folders · select, then click again to open · right-click for options`}
        </p>
        <Link
          href="/projects"
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand hover:underline"
        >
          View All Projects <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
      </div>

      {/* Context menu */}
      {menu && (
        <div
          role="menu"
          aria-label={`Options for ${menu.project.title}`}
          style={{ left: Math.min(menu.x, 640), top: menu.y }}
          className="absolute z-30 w-48 rounded-xl border border-line bg-card p-1.5 shadow-card"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpenProject(menu.project);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-surface"
          >
            <FolderOpen size={13} className="text-brand" aria-hidden="true" /> Open
          </button>
          {menu.project.liveDemo && (
            <a
              role="menuitem"
              href={menu.project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-surface"
            >
              <ExternalLink size={13} className="text-brand2" aria-hidden="true" /> Live Demo
            </a>
          )}
          {menu.project.github && (
            <a
              role="menuitem"
              href={menu.project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-surface"
            >
              <Github size={13} aria-hidden="true" /> GitHub
            </a>
          )}
          <Link
            role="menuitem"
            href={menu.project.caseStudy ?? "/projects"}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium hover:bg-surface"
          >
            <BookOpen size={13} className="text-mute" aria-hidden="true" /> Documentation
          </Link>
        </div>
      )}

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}
