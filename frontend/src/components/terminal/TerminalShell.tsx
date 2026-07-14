"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useExperience } from "@/lib/theme-context";
import { scrollToSection } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  COMMAND_NAMES,
  findCommand,
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
}: {
  welcome: string[];
  prompt?: string;
  className?: string;
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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, animFrame]);

  useEffect(() => () => clearInterval(animTimerRef.current), []);

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

      const [name, ...args] = trimmed.split(/\s+/);
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

      setLines((prev) => [
        ...prev,
        echo,
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
    },
    [history, router, setMode, setAppearance, playAnimation]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
      return;
    }
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
      const word = input.trimStart();
      if (!word || word.includes(" ")) return;
      const matches = COMMAND_NAMES.filter((n) => n.startsWith(word.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        const now = Date.now();
        if (now - lastTabRef.current < 450) {
          setLines((prev) => [
            ...prev,
            { id: nextId(), kind: "input", text: word },
            { id: nextId(), kind: "output", text: matches.join("  ") },
          ]);
        } else {
          let prefix = matches[0];
          for (const m of matches) {
            while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
          }
          if (prefix.length > word.length) setInput(prefix);
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
        <div className="flex items-center gap-2">
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
            style={{ caretColor: "rgb(var(--c-term-accent))" }}
            className="w-full bg-transparent font-mono text-[13px] text-term-ink outline-none"
          />
        </div>
      )}
    </div>
  );
}
