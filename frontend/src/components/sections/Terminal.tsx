"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TerminalShell } from "@/components/terminal/TerminalShell";

const WELCOME: string[] = [
  "ThiruOS 3.0 LTS (Parrot-inspired) — tty1",
  "",
  'Type "help" for commands. Try "neofetch", "donut", or "sudo hire thiru".',
  "",
];

const SUGGESTION_CHIPS = ["help", "neofetch", "donut", "sudo hire thiru", "mode terminal"];

/**
 * Terminal — the homepage terminal section. The shell logic is
 * shared with Terminal mode's desktop (TerminalShell).
 */
export function Terminal() {
  return (
    <section
      id="terminal"
      aria-label="Interactive terminal"
      className="section-pad exec-hide"
    >
      <div className="section-shell">
        <SectionHeading
          eyebrow="terminal"
          title="Talk to the portfolio"
          lede="A real shell — Tab completes, arrows recall history, sudo works. Type `mode terminal` for the full desktop."
        />

        <Reveal>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-line/70 shadow-card">
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-line/50 bg-surface/80 px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <p className="font-mono text-xs text-mute">visitor@thiru: ~ — bash</p>
                <span className="w-12" aria-hidden="true" />
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
