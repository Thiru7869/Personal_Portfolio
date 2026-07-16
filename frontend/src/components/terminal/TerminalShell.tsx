"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/lib/theme-context";
import { scrollToSection } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  ARG_COMPLETIONS,
  COMMAND_NAMES,
  findCommand,
  normalizeSlashInput,
  suggestCommand,
  type TerminalContext,
} from "@/lib/terminal-commands";
import {
  createAnimation,
  type AnimationKind,
} from "@/lib/terminal-animations";

interface OutputLine {
  id: number;
  kind: "input" | "output" | "error";
  text: string;
}

let lineId = 0;
const nextId = () => ++lineId;

const ANIMATION_KINDS: readonly string[] = ["matrix", "donut", "train", "clock", "parrot"];

/** A rotating handful of the ~40 available commands — shown as a
 *  faint hint under the prompt so first-time visitors know slash
 *  navigation exists, without listing every command at once. */
const HINT_COMMANDS = ["/home", "/about", "/projects", "/blog", "/contact", "/skills", "/help", "/theme", "/research", "/resume"];

/**
 * TerminalShell — the reusable working shell: command execution
 * (registry in lib/terminal-commands), ↑/↓ history, Tab
 * completion (double-Tab lists), Ctrl+L clear, and ASCII
 * animations. Used by the homepage terminal section and the
 * terminal window inside Terminal mode's desktop.
 */
export function TerminalShell({
  welcome,
  prompt = "visitor@thiru:~$",
  className = "h-[380px]",
  focusSignal,
  onOpenWindow,
}: {
  welcome: string[];
  prompt?: string;
  className?: string;
  /** Bump this (e.g. with the window's z-index) whenever the terminal is
   *  focused/restored by something other than clicking inside it — a
   *  taskbar click, a title-bar drag, a fresh spawn. */
  focusSignal?: number;
  /** Only supplied inside Terminal mode's desktop — lets `resume`/`projects`
   *  /`game` open a window instead of navigating away. */
  onOpenWindow?: (kind: "resume" | "files" | "game") => void;
}) {
  const router = useRouter();
  const { setMode, setAppearance } = useExperience();

  const [lines, setLines] = useState<OutputLine[]>(
    welcome.map((text) => ({ id: nextId(), kind: "output", text }))
  );
  const [animFrame, setAnimFrame] = useState<string[] | null>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTabRef = useRef(0);
  const animTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, animFrame]);

  useEffect(
    () => () => {
      clearInterval(animTimerRef.current);
      clearTimeout(delayTimerRef.current);
    },
    []
  );

  // Reclaim keyboard focus whenever this instance becomes the active
  // window (taskbar click, restore, fresh spawn) — clicking inside the
  // scrollback already focuses via onClick below, but that doesn't cover
  // focus changes driven by chrome outside this component.
  useEffect(() => {
    if (focusSignal) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSignal]);

  const playAnimation = useCallback((kind: AnimationKind) => {
    clearInterval(animTimerRef.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anim = createAnimation(kind);
    if (reduce) {
      setLines((prev) => [
        ...prev,
        ...anim.frame(anim.ticks - 1).map<OutputLine>((text) => ({ id: nextId(), kind: "output", text })),
        { id: nextId(), kind: "output", text: anim.outro },
        { id: nextId(), kind: "output", text: "" },
      ]);
      return;
    }
    let tick = 0;
    setAnimFrame(anim.frame(0));
    animTimerRef.current = setInterval(() => {
      tick += 1;
      if (tick >= anim.ticks) {
        clearInterval(animTimerRef.current);
        setAnimFrame(null);
        setLines((prev) => [
          ...prev,
          { id: nextId(), kind: "output", text: anim.outro },
          { id: nextId(), kind: "output", text: "" },
        ]);
        return;
      }
      setAnimFrame(anim.frame(tick));
    }, anim.intervalMs);
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const echo: OutputLine = { id: nextId(), kind: "input", text: trimmed };

      if (!trimmed) {
        setLines((prev) => [...prev, echo]);
        return;
      }

      const nextHistory = [...history, trimmed];
      setHistory(nextHistory);
      setHistoryIdx(-1);

      const dispatch = normalizeSlashInput(trimmed);
      const [name, ...args] = dispatch.split(/\s+/);
      const command = findCommand(name.toLowerCase());
      trackEvent({ type: "terminal_command", command: name.toLowerCase() });

      if (!command) {
        const suggestion = suggestCommand(name.toLowerCase());
        setLines((prev) => [
          ...prev,
          echo,
          {
            id: nextId(),
            kind: "error",
            text: `${name}: command not found${suggestion ? ` — did you mean '${suggestion}'?` : ""}`,
          },
        ]);
        return;
      }

      const ctx: TerminalContext = {
        setMode,
        setAppearance,
        navigate: (path) => router.push(path),
        scrollTo: scrollToSection,
        openUrl: (url) => window.open(url, "_blank", "noopener,noreferrer"),
        history: nextHistory,
        openWindow: onOpenWindow,
      };

      const result = command.run(args, ctx);

      if (trimmed.toLowerCase() === "sudo hire thiru") {
        void import("@/lib/confetti").then((m) => m.fireConfetti());
      }

      if (result.action === "clear") {
        setLines([]);
        setAnimFrame(null);
        clearInterval(animTimerRef.current);
        return;
      }

      const pushOutput = () => {
        setLines((prev) => [
          ...prev,
          ...result.lines.map<OutputLine>((text) => ({
            id: nextId(),
            kind: "output",
            text,
          })),
        ]);
        if (result.action && ANIMATION_KINDS.includes(result.action)) {
          playAnimation(result.action as AnimationKind);
        } else {
          setLines((prev) => [...prev, { id: nextId(), kind: "output", text: "" }]);
        }
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (result.delayMs && !reduceMotion) {
        const pendingId = nextId();
        setLines((prev) => [
          ...prev,
          echo,
          { id: pendingId, kind: "output", text: "…" },
        ]);
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = setTimeout(() => {
          setLines((prev) => prev.filter((l) => l.id !== pendingId));
          pushOutput();
        }, result.delayMs);
        return;
      }

      setLines((prev) => [...prev, echo]);
      pushOutput();
    },
    [history, router, setMode, setAppearance, playAnimation, onOpenWindow]
  );

  function handleSubmit(e: React.FormEvent) {
    // A <form> submit (not raw onKeyDown) is what reliably fires from
    // mobile virtual keyboards' Enter/Go key — many Android IMEs don't
    // dispatch a real keydown with key:"Enter" during composition, so
    // relying on onKeyDown alone silently ate every command on mobile.
    e.preventDefault();
    runCommand(input);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      if (historyIdx === -1) setDraft(input);
      setHistoryIdx(idx);
      setInput(history[idx]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(-1);
        setInput(draft);
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const raw = input.trimStart();
      if (!raw) return;

      // No space yet → completing the command name itself. One space and
      // no further space → completing its first argument, if that command
      // has known values (cd/mode/theme/cat). Anything past that: no-op.
      const firstSpace = raw.indexOf(" ");
      let candidates: readonly string[];
      let word: string;
      let inputPrefix: string;
      if (firstSpace === -1) {
        candidates = COMMAND_NAMES;
        word = raw.toLowerCase();
        inputPrefix = "";
      } else if (!raw.slice(firstSpace + 1).includes(" ")) {
        const argCandidates = ARG_COMPLETIONS[raw.slice(0, firstSpace).toLowerCase()];
        if (!argCandidates) return;
        candidates = argCandidates;
        word = raw.slice(firstSpace + 1).toLowerCase();
        inputPrefix = raw.slice(0, firstSpace + 1);
      } else {
        return;
      }

      const matches = candidates.filter((n) => n.startsWith(word));
      if (matches.length === 1) {
        setInput(inputPrefix + matches[0] + " ");
      } else if (matches.length > 1) {
        const now = Date.now();
        if (now - lastTabRef.current < 450) {
          setLines((prev) => [
            ...prev,
            { id: nextId(), kind: "input", text: raw },
            { id: nextId(), kind: "output", text: matches.join("  ") },
          ]);
        } else {
          let prefix = matches[0];
          for (const m of matches) {
            while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
          }
          if (prefix.length > word.length) setInput(inputPrefix + prefix);
        }
        lastTabRef.current = now;
      }
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
      setAnimFrame(null);
      clearInterval(animTimerRef.current);
    }
  }

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Terminal output"
      aria-live="polite"
      onClick={() => inputRef.current?.focus()}
      className={`overflow-y-auto bg-term p-4 font-mono text-[13px] leading-relaxed ${className}`}
    >
      {lines.map((line) =>
        line.kind === "input" ? (
          <p key={line.id} className="text-term-ink">
            <span className="text-term-accent">{prompt}</span> {line.text}
          </p>
        ) : (
          <p
            key={line.id}
            className={
              line.kind === "error"
                ? "whitespace-pre-wrap text-red-400"
                : "whitespace-pre-wrap text-term-ink"
            }
          >
            {line.text || " "}
          </p>
        )
      )}

      {animFrame && (
        <pre aria-hidden="true" className="whitespace-pre text-term-accent">
          {animFrame.join("\n")}
        </pre>
      )}

      {!animFrame && (
        <>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="shrink-0 font-mono text-term-accent">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              style={{ caretColor: "rgb(var(--c-term-accent))" }}
              className="w-full bg-transparent font-mono text-[13px] text-term-ink outline-none"
            />
          </form>
          <AnimatePresence>
            {!input && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
                className="mt-1 truncate pl-0 font-mono text-[11px] text-mute"
              >
                try: {HINT_COMMANDS.join("  ")}
              </motion.p>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
