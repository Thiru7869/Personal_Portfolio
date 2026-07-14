"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  FolderOpen,
  Minus,
  Monitor,
  Square,
  TerminalSquare,
  X,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/config/site";
import { useExperience } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { AppearanceToggle } from "@/components/layout/ThemeSwitcher";

type WindowId = "terminal" | "files";

interface WindowState {
  id: WindowId;
  title: string;
  icon: LucideIcon;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  z: number;
}

const DESKTOP_WELCOME = [
  "ThiruOS 3.0 LTS — Parrot-inspired desktop · tty1",
  `${site.name} · ${site.roles.join(" · ")}`,
  "─".repeat(52),
  'Type "help" for 30+ commands. "exit" returns to the site.',
  'Fun ones: "donut", "matrix", "train", "parrot", "clock".',
  "",
];

/**
 * TerminalDesktop — Terminal mode's takeover: a Parrot-inspired
 * desktop with a top panel, taskbar, desktop icons, and
 * draggable windows (Terminal runs the real shell; Files runs
 * the project explorer). Light/dark still applies.
 */
export function TerminalDesktop() {
  const { setMode } = useExperience();
  const [clock, setClock] = useState("");
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "terminal",
      title: "Terminal — visitor@thiru",
      icon: TerminalSquare,
      open: true,
      minimized: false,
      maximized: false,
      x: 80,
      y: 60,
      z: 2,
    },
    {
      id: "files",
      title: "Files — ~/projects",
      icon: FolderOpen,
      open: false,
      minimized: false,
      maximized: false,
      x: 160,
      y: 110,
      z: 1,
    },
  ]);
  const zCounter = useRef(2);
  const dragRef = useRef<{ id: WindowId; dx: number; dy: number } | null>(null);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const update = useCallback((id: WindowId, patch: Partial<WindowState>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const focus = useCallback(
    (id: WindowId) => {
      zCounter.current += 1;
      update(id, { z: zCounter.current, minimized: false, open: true });
    },
    [update]
  );

  function startDrag(e: React.PointerEvent, win: WindowState) {
    if (win.maximized) return;
    dragRef.current = { id: win.id, dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onDrag(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    update(drag.id, {
      x: Math.max(0, Math.min(e.clientX - drag.dx, window.innerWidth - 240)),
      y: Math.max(36, Math.min(e.clientY - drag.dy, window.innerHeight - 120)),
    });
  }
  function endDrag() {
    dragRef.current = null;
  }

  const desktopIcons: { label: string; icon: LucideIcon; action: () => void }[] = [
    { label: "Terminal", icon: TerminalSquare, action: () => focus("terminal") },
    { label: "Projects", icon: FolderOpen, action: () => focus("files") },
    {
      label: "Resume",
      icon: FileText,
      action: () => window.open(site.resumeUrl, "_blank", "noopener,noreferrer"),
    },
    { label: "Exit to Site", icon: Monitor, action: () => setMode("professional") },
  ];

  return (
    <div
      role="application"
      aria-label="Terminal mode — Parrot-inspired desktop"
      className="fixed inset-0 z-[60] overflow-hidden bg-bg font-mono"
      onPointerMove={onDrag}
      onPointerUp={endDrag}
    >
      {/* Wallpaper */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 600px at 70% 20%, rgb(var(--c-brand) / 0.10), transparent 60%), radial-gradient(700px 500px at 15% 85%, rgb(var(--c-brand2) / 0.07), transparent 60%)",
        }}
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 right-6 select-none text-right font-mono text-xs text-mute/50"
      >
        THIRU/OS · Parrot-inspired
        <br />
        {site.name}
      </p>

      {/* Top panel */}
      <div className="relative z-10 flex h-9 items-center justify-between border-b border-line/70 bg-surface/90 px-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-brand">⬢ THIRU/OS</span>
          <button
            type="button"
            onClick={() => focus("terminal")}
            className="text-mute transition-colors hover:text-brand"
          >
            Terminal
          </button>
          <button
            type="button"
            onClick={() => focus("files")}
            className="text-mute transition-colors hover:text-brand"
          >
            Files
          </button>
        </div>
        <span className="text-mute" aria-label="Clock">
          {clock}
        </span>
        <div className="flex items-center gap-2">
          <AppearanceToggle />
          <button
            type="button"
            onClick={() => setMode("professional")}
            className="rounded border border-line/70 px-2.5 py-1 text-mute transition-colors hover:border-brand hover:text-brand"
          >
            exit → site
          </button>
        </div>
      </div>

      {/* Desktop icons */}
      <div className="absolute left-4 top-14 z-10 flex flex-col gap-4">
        {desktopIcons.map((item) => (
          <button
            key={item.label}
            type="button"
            onDoubleClick={item.action}
            onKeyDown={(e) => e.key === "Enter" && item.action()}
            title={`${item.label} (double-click)`}
            className="flex w-20 flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors hover:bg-surface/70 focus:bg-surface/70"
          >
            <item.icon size={30} className="text-brand" strokeWidth={1.4} aria-hidden="true" />
            <span className="text-[11px] leading-tight text-ink/90">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => {
        if (!win.open || win.minimized) return null;
        const isTerminal = win.id === "terminal";
        return (
          <div
            key={win.id}
            role="dialog"
            aria-label={win.title}
            style={
              win.maximized
                ? { left: 0, top: 36, width: "100%", height: "calc(100% - 84px)", zIndex: win.z }
                : {
                    left: win.x,
                    top: win.y,
                    zIndex: win.z,
                    width: "min(720px, calc(100vw - 2rem))",
                  }
            }
            className="absolute overflow-hidden rounded-lg border border-line/80 bg-card shadow-card"
            onPointerDown={() => focus(win.id)}
          >
            {/* Title bar */}
            <div
              onPointerDown={(e) => startDrag(e, win)}
              className="flex cursor-grab select-none items-center justify-between border-b border-line/70 bg-surface/90 px-3 py-1.5 active:cursor-grabbing"
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <win.icon size={13} className="text-brand" aria-hidden="true" />
                {win.title}
              </span>
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Minimize ${win.title}`}
                  onClick={() => update(win.id, { minimized: true })}
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-surface"
                >
                  <Minus size={12} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={win.maximized ? "Restore window" : "Maximize window"}
                  onClick={() => update(win.id, { maximized: !win.maximized })}
                  className="flex h-6 w-6 items-center justify-center rounded hover:bg-surface"
                >
                  <Square size={10} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Close ${win.title}`}
                  onClick={() => update(win.id, { open: false })}
                  className="flex h-6 w-6 items-center justify-center rounded text-mute hover:bg-red-500/20 hover:text-red-400"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            </div>

            {/* Content */}
            {isTerminal ? (
              <TerminalShell
                welcome={DESKTOP_WELCOME}
                className={win.maximized ? "h-[calc(100vh-160px)]" : "h-[380px]"}
              />
            ) : (
              <div className={win.maximized ? "h-[calc(100vh-160px)] overflow-y-auto" : "max-h-[440px] overflow-y-auto"}>
                <ProjectExplorer compact />
              </div>
            )}
          </div>
        );
      })}

      {/* Taskbar */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-12 items-center gap-2 border-t border-line/70 bg-surface/95 px-3">
        {windows.map((win) => (
          <button
            key={win.id}
            type="button"
            onClick={() =>
              win.open && !win.minimized && win.z === zCounter.current
                ? update(win.id, { minimized: true })
                : focus(win.id)
            }
            aria-label={`${win.title}${win.minimized ? " (minimized)" : ""}`}
            className={cn(
              "flex items-center gap-2 rounded border px-3 py-1.5 text-xs transition-colors",
              win.open && !win.minimized
                ? "border-brand/50 bg-brand/10 text-brand"
                : "border-line/70 text-mute hover:text-ink"
            )}
          >
            <win.icon size={13} aria-hidden="true" />
            <span className="hidden sm:inline">{win.id === "terminal" ? "Terminal" : "Files"}</span>
          </button>
        ))}
        <p className="ml-auto hidden font-mono text-[11px] text-mute sm:block">
          {site.email} · open to opportunities
        </p>
      </div>
    </div>
  );
}
