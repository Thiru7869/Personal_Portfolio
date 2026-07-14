"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Cloud,
  Code2,
  Database,
  LayoutTemplate,
  Search,
  Server,
  TerminalSquare,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { skillGroups } from "@/content/skills";
import { cn } from "@/lib/utils";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

const groupIcons: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  server: Server,
  brain: Brain,
  code: Code2,
  database: Database,
  wrench: Wrench,
  cloud: Cloud,
  terminal: TerminalSquare,
};

const levelStyles: Record<string, string> = {
  Advanced: "bg-brand/15 text-brand border-brand/30",
  Proficient: "bg-brand2/15 text-brand2 border-brand2/30",
  Comfortable: "bg-surface text-ink/80 border-line",
  Learning: "bg-surface text-mute border-line border-dashed",
};

/**
 * Skills — grouped, animated grid. Every chip links to the
 * technology's Wikipedia article (data in src/content/skills.ts).
 */
export function Skills() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");

  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skillGroups
      .filter((g) => activeGroup === "All" || g.label === activeGroup)
      .map((g) => ({
        ...g,
        skills: q
          ? g.skills.filter((s) => s.name.toLowerCase().includes(q))
          : g.skills,
      }))
      .filter((g) => g.skills.length > 0);
  }, [query, activeGroup]);

  return (
    <section id="skills" aria-label="Skills" className="section-pad">
      <SectionBackdrop kind="mesh" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="skills"
          title="The toolbox"
          lede="Grouped, searchable, and honest about levels. Click any skill to read about the technology."
        />

        {/* Search + group filter */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative max-w-sm">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills — try “fastapi” or “docker”"
              aria-label="Search skills"
              className="w-full rounded-xl border border-line bg-card py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter skill groups">
            {["All", ...skillGroups.map((g) => g.label)].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveGroup(label)}
                aria-pressed={activeGroup === label}
                className={cn(
                  "chip transition-colors",
                  activeGroup === label
                    ? "!border-brand/60 !bg-brand/10 !text-brand"
                    : "hover:border-brand/40 hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visibleGroups.length === 0 && (
          <p className="card-shell p-8 text-center font-mono text-sm text-mute">
            No skills match “{query}” — but I might be learning it. Ask the assistant.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleGroups.map((group, gi) => {
            const Icon = groupIcons[group.icon] ?? Code2;
            return (
              <Reveal key={group.id} delay={gi * 0.05}>
                <div className="card-shell h-full p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    {group.roadmapUrl ? (
                      <a
                        href={group.roadmapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open the ${group.label} roadmap on roadmap.sh`}
                        className="font-display text-lg font-semibold transition-colors hover:text-brand"
                      >
                        <h3>{group.label}</h3>
                      </a>
                    ) : (
                      <h3 className="font-display text-lg font-semibold">
                        {group.label}
                      </h3>
                    )}
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {group.skills.map((skill, si) => (
                      <motion.li
                        key={skill.name}
                        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + si * 0.04, duration: 0.3 }}
                      >
                        <a
                          href={skill.wiki}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${skill.name} — ${skill.level}. Opens Wikipedia.`}
                          className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-medium transition-transform hover:-translate-y-0.5 ${levelStyles[skill.level]}`}
                        >
                          {skill.name}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-mute">
            <span className="font-mono">legend:</span>
            {Object.keys(levelStyles).map((level) => (
              <span key={level} className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full border ${levelStyles[level]}`}
                  aria-hidden="true"
                />
                {level}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
