"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { TerminalThemeToggle } from "@/components/terminal/TerminalThemeToggle";
import { getTerminalWelcome } from "@/lib/terminal-commands";
import { useTerminalTheme } from "@/lib/use-terminal-theme";

const WELCOME = getTerminalWelcome("embed");

const SUGGESTION_CHIPS = ["help", "neofetch", "donut", "sudo hire thiru", "/projects"];

/**
 * Terminal — the homepage terminal section. The shell logic is
 * shared with Terminal mode's desktop (TerminalShell).
 */
export function Terminal() {
  const { theme, cycle } = useTerminalTheme();

  return (
    <section
      id="terminal"
      aria-label="Interactive terminal"
      className="section-pad"
    >
      <SectionBackdrop kind="matrix" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="terminal"
          title="Terminal"
          lede="A real shell — Tab completes, arrows recall history, sudo works. Type `mode terminal` for the full desktop."
        />

        <Reveal>
          <div className="mx-auto max-w-3xl">
            <div
              data-terminal-theme={theme}
              className="terminal-chrome overflow-hidden rounded-2xl border shadow-card"
            >
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-line/50 bg-surface/80 px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <p className="font-mono text-xs text-mute">visitor@thiru: ~ — bash</p>
                <TerminalThemeToggle theme={theme} onCycle={cycle} />
              </div>

              <TerminalShell welcome={WELCOME} className="h-[380px]" />
            </div>

            {/* Suggestion chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-mute">try:</span>
              {SUGGESTION_CHIPS.map((cmd) => (
                <span key={cmd} className="chip font-mono">
                  {cmd}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
