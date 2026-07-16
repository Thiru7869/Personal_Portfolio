"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Monitor, Square, X } from "lucide-react";
import { site } from "@/config/site";
import { useExperience } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { getTerminalWelcome } from "@/lib/terminal-commands";
import { useTerminalTheme } from "@/lib/use-terminal-theme";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { TerminalThemeToggle } from "@/components/terminal/TerminalThemeToggle";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { ResumeViewer } from "@/components/modes/ResumeViewer";
import { Game2048 } from "@/components/game/Game2048";
import { AppearanceToggle } from "@/components/layout/ThemeSwitcher";
import { WINDOW_KINDS, type WindowKind } from "@/components/modes/window-kinds";
import { ContextualMark } from "@/components/illustrations/ContextualMark";

const DESKTOP_WELCOME = getTerminalWelcome("desktop");
const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

interface WindowInstance {
  instanceId: number;
  kind: WindowKind;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
}

/** Small viewports (phones) can't fit a 900×560 desktop-sized window —
 *  clamp to what's actually on screen and center it, rather than
 *  spawning a window whose edge is clipped off the visible area. */
function makeWindow(kind: WindowKind, instanceId: number, z: number): WindowInstance {
  const cfg = WINDOW_KINDS[kind];
  const vw = typeof window !== "undefined" ? window.innerWidth : cfg.defaultWidth + 160;
  const vh = typeof window !== "undefined" ? window.innerHeight : cfg.defaultHeight + 150;
  const width = Math.min(cfg.defaultWidth, Math.max(MIN_WIDTH, vw - 24));
  const height = Math.min(cfg.defaultHeight, Math.max(MIN_HEIGHT, vh - 130));
  const small = vw < 640;
  return {
    instanceId,
    kind,
    open: true,
    minimized: false,
    maximized: small,
    x: small ? 0 : Math.max(24, (vw - width) / 2 + ((instanceId * 24) % 100 - 50)),
    y: small ? 36 : Math.max(48, (vh - height) / 2 + ((instanceId * 24) % 80 - 40)),
    width,
    height,
    z,
  };
}

/**
 * TerminalDesktop — Terminal mode's takeover: a Parrot-inspired
 * desktop with a top panel, taskbar, desktop icons, and a small
 * multi-window manager (drag, resize, minimize/maximize/close,
 * spawn any number of terminals). Light/dark still applies.
 */
export function TerminalDesktop() {
  const { setMode } = useExperience();
  const { theme: terminalTheme, cycle: cycleTerminalTheme } = useTerminalTheme();
  const [clock, setClock] = useState("");
  const [windows, setWindows] = useState<WindowInstance[]>(() => [makeWindow("terminal", 1, 1)]);
  const [activeInstanceId, setActiveInstanceId] = useState<number>(1);

  const instanceCounter = useRef(1);
  const zCounter = useRef(1);
  const dragRef = useRef<{ instanceId: number; dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ instanceId: number; startW: number; startH: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
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

  // Center the initial terminal window against the real viewport, sized to
  // cover most of the page while leaving the desktop icons (top-left) and
  // taskbar/top-panel chrome visible.
  useEffect(() => {
    const width = Math.min(1000, window.innerWidth - (window.innerWidth < 640 ? 24 : 160));
    const height = Math.min(680, window.innerHeight - 150);
    setWindows((prev) =>
      prev.map((w) =>
        w.kind === "terminal"
          ? {
              ...w,
              width,
              height,
              x: Math.max(24, (window.innerWidth - width) / 2),
              y: Math.max(48, (window.innerHeight - height) / 2 - 6),
            }
          : w
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback((instanceId: number, patch: Partial<WindowInstance>) => {
    setWindows((prev) => prev.map((w) => (w.instanceId === instanceId ? { ...w, ...patch } : w)));
  }, []);

  const focus = useCallback(
    (instanceId: number) => {
      zCounter.current += 1;
      setActiveInstanceId(instanceId);
      update(instanceId, { z: zCounter.current, minimized: false, open: true });
    },
    [update]
  );

  const spawnWindow = useCallback(
    (kind: WindowKind) => {
      const cfg = WINDOW_KINDS[kind];
      if (!cfg.multiInstance) {
        const existing = windows.find((w) => w.kind === kind);
        if (existing) {
          focus(existing.instanceId);
          return;
        }
      }
      instanceCounter.current += 1;
      zCounter.current += 1;
      const id = instanceCounter.current;
      const z = zCounter.current;
      setWindows((prev) => [...prev, makeWindow(kind, id, z)]);
      setActiveInstanceId(id);
    },
    [windows, focus]
  );

  function startDrag(e: React.PointerEvent, win: WindowInstance) {
    if (win.maximized) return;
    dragRef.current = { instanceId: win.instanceId, dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function startResize(e: React.PointerEvent, win: WindowInstance) {
    if (win.maximized) return;
    e.stopPropagation();
    resizeRef.current = {
      instanceId: win.instanceId,
      startW: win.width,
      startH: win.height,
      startX: e.clientX,
      startY: e.clientY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (drag) {
      update(drag.instanceId, {
        x: Math.max(0, Math.min(e.clientX - drag.dx, window.innerWidth - 200)),
        y: Math.max(36, Math.min(e.clientY - drag.dy, window.innerHeight - 120)),
      });
    }
    const resize = resizeRef.current;
    if (resize) {
      update(resize.instanceId, {
        width: Math.max(MIN_WIDTH, resize.startW + (e.clientX - resize.startX)),
        height: Math.max(MIN_HEIGHT, resize.startH + (e.clientY - resize.startY)),
      });
    }
  }
  function endPointer() {
    dragRef.current = null;
    resizeRef.current = null;
  }

  const desktopIcons: { label: string; icon: typeof WINDOW_KINDS.terminal.icon; action: () => void }[] = [
    { label: "Terminal", icon: WINDOW_KINDS.terminal.icon, action: () => spawnWindow("terminal") },
    { label: "Projects", icon: WINDOW_KINDS.files.icon, action: () => spawnWindow("files") },
    { label: "Resume", icon: WINDOW_KINDS.resume.icon, action: () => spawnWindow("resume") },
    { label: "2048", icon: WINDOW_KINDS.game.icon, action: () => spawnWindow("game") },
    { label: "Exit to Site", icon: Monitor, action: () => setMode("professional") },
  ];

  const terminalWindows = windows.filter((w) => w.kind === "terminal");
  const windowLabel = (win: WindowInstance) =>
    win.kind === "terminal" && terminalWindows.length > 1
      ? `Terminal ${terminalWindows.findIndex((w) => w.instanceId === win.instanceId) + 1}`
      : WINDOW_KINDS[win.kind].defaultTitle;

  return (
    <div
      role="application"
      aria-label="Terminal mode — Parrot-inspired desktop"
      className="fixed inset-0 z-[60] overflow-hidden bg-bg font-mono"
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
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
      <ContextualMark
        kind="penguin"
        className="pointer-events-none absolute bottom-20 right-8 h-32 w-32 text-brand/[0.08]"
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
            onClick={() => spawnWindow("terminal")}
            className="-my-2 px-1 py-2 text-mute transition-colors hover:text-brand"
          >
            Terminal
          </button>
          <button
            type="button"
            onClick={() => spawnWindow("files")}
            className="-my-2 px-1 py-2 text-mute transition-colors hover:text-brand"
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
            onClick={item.action}
            onKeyDown={(e) => e.key === "Enter" && item.action()}
            title={item.label}
            className="flex w-20 flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors hover:bg-surface/70 focus:bg-surface/70 active:bg-surface"
          >
            <item.icon size={30} className="text-brand" strokeWidth={1.4} aria-hidden="true" />
            <span className="text-[11px] leading-tight text-ink/90">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => {
        if (!win.open || win.minimized) return null;
        const label = windowLabel(win);
        const Icon = WINDOW_KINDS[win.kind].icon;
        const isActive = win.instanceId === activeInstanceId;
        return (
          <div
            key={win.instanceId}
            role="dialog"
            aria-label={label}
            data-terminal-theme={win.kind === "terminal" ? terminalTheme : undefined}
            style={
              win.maximized
                ? { left: 0, top: 36, width: "100%", height: "calc(100% - 84px)", zIndex: win.z }
                : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.z }
            }
            className={cn(
              "absolute flex flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-shadow",
              win.kind === "terminal" ? "terminal-chrome" : isActive ? "border-brand/40" : "border-line/80"
            )}
            onPointerDown={() => focus(win.instanceId)}
          >
            {/* Title bar */}
            <div
              onPointerDown={(e) => startDrag(e, win)}
              className="flex shrink-0 touch-none cursor-grab select-none items-center justify-between border-b border-line/70 bg-surface/90 px-3 py-1.5 active:cursor-grabbing"
            >
              <span className="flex items-center gap-2 text-xs font-semibold">
                <Icon size={13} className="text-brand" aria-hidden="true" />
                {label}
              </span>
              <span className="flex items-center gap-1">
                {win.kind === "terminal" && (
                  <TerminalThemeToggle theme={terminalTheme} onCycle={cycleTerminalTheme} />
                )}
                <button
                  type="button"
                  aria-label={`Minimize ${label}`}
                  onClick={() => update(win.instanceId, { minimized: true })}
                  className="flex h-9 w-9 items-center justify-center rounded hover:bg-surface sm:h-6 sm:w-6"
                >
                  <Minus size={12} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={win.maximized ? "Restore window" : "Maximize window"}
                  onClick={() => update(win.instanceId, { maximized: !win.maximized })}
                  className="flex h-9 w-9 items-center justify-center rounded hover:bg-surface sm:h-6 sm:w-6"
                >
                  <Square size={10} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Close ${label}`}
                  onClick={() => update(win.instanceId, { open: false })}
                  className="flex h-9 w-9 items-center justify-center rounded text-mute hover:bg-red-500/20 hover:text-red-400 sm:h-6 sm:w-6"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            </div>

            {/* Content */}
            <div className={cn("min-h-0 flex-1 overflow-hidden", win.maximized && "p-2")}>
              {win.kind === "terminal" ? (
                <TerminalShell
                  welcome={DESKTOP_WELCOME}
                  focusSignal={isActive ? win.z : 0}
                  onOpenWindow={spawnWindow}
                  className="h-full"
                />
              ) : win.kind === "files" ? (
                <div className="h-full overflow-y-auto">
                  <ProjectExplorer />
                </div>
              ) : win.kind === "game" ? (
                <div className="h-full overflow-y-auto p-4">
                  <Game2048 />
                </div>
              ) : (
                <ResumeViewer className="h-full" />
              )}
            </div>

            {/* Resize handle */}
            {!win.maximized && (
              <div
                onPointerDown={(e) => startResize(e, win)}
                aria-hidden="true"
                className="absolute bottom-0 right-0 h-8 w-8 touch-none cursor-nwse-resize sm:h-4 sm:w-4"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 50%, rgb(var(--c-line)) 50%, rgb(var(--c-line)) 60%, transparent 60%, transparent 70%, rgb(var(--c-line)) 70%, rgb(var(--c-line)) 80%, transparent 80%)",
                }}
              />
            )}
          </div>
        );
      })}

      {/* Taskbar */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-12 items-center gap-2 border-t border-line/70 bg-surface/95 px-3">
        {windows.map((win) => {
          const label = windowLabel(win);
          const Icon = WINDOW_KINDS[win.kind].icon;
          const isActive = win.instanceId === activeInstanceId;
          return (
            <button
              key={win.instanceId}
              type="button"
              onClick={() => {
                if (isActive && win.open && !win.minimized) {
                  update(win.instanceId, { minimized: true });
                } else {
                  focus(win.instanceId);
                }
              }}
              aria-label={`${label}${win.minimized ? " (minimized)" : ""}`}
              className={cn(
                "flex items-center gap-2 rounded border px-3 py-1.5 text-xs transition-colors",
                win.open && !win.minimized
                  ? "border-brand/50 bg-brand/10 text-brand"
                  : "border-line/70 text-mute hover:text-ink"
              )}
            >
              <Icon size={13} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
        <p className="ml-auto hidden font-mono text-[11px] text-mute sm:block">
          {site.email} · open to opportunities
        </p>
      </div>
    </div>
  );
}
