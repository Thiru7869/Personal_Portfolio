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
import type { Skill } from "@shared/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { skillGroups, LEVEL_PERCENT } from "@/content/skills";
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

/** Ring/dot color per level — the same 4-tone read as the old chip borders. */
const LEVEL_COLOR: Record<Skill["level"], string> = {
  Advanced: "rgb(var(--c-brand))",
  Proficient: "rgb(var(--c-brand2))",
  Comfortable: "rgb(var(--c-ink) / 0.55)",
  Learning: "rgb(var(--c-mute))",
};

interface OrbitNode {
  skill: Skill;
  x: number;
  y: number;
}

/** Places a list of skills evenly around a circle of the given radius
 *  (percent of the container), starting at 12 o'clock plus an optional
 *  offset — the outer ring is offset half its own step so it falls
 *  between the inner ring's nodes instead of stacking on the same rays. */
function ringLayout(skills: Skill[], radius: number, offsetDeg = 0): OrbitNode[] {
  if (skills.length === 0) return [];
  return skills.map((skill, i) => {
    const angle = ((360 / skills.length) * i - 90 + offsetDeg) * (Math.PI / 180);
    return {
      skill,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
}

function SkillNode({
  node,
  reduce,
  delay,
  onHoverChange,
}: {
  node: OrbitNode;
  reduce: boolean | null;
  delay: number;
  onHoverChange: (name: string | null) => void;
}) {
  const { skill, x, y } = node;
  const percent = LEVEL_PERCENT[skill.level];
  const color = LEVEL_COLOR[skill.level];

  return (
    <a
      href={skill.wiki}
      target="_blank"
      rel="noopener noreferrer"
      title={`${skill.name} — ${skill.level}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => onHoverChange(skill.name)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(skill.name)}
      onBlur={() => onHoverChange(null)}
      className="group absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-transform duration-200 hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:scale-110"
    >
      <span className="relative flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgb(var(--c-line))" strokeWidth="3" />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: percent / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay, ease: "easeOut" }}
          />
        </svg>
        <span
          className="h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-125"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </span>
      <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight text-ink/90 transition-colors group-hover:text-brand">
        {skill.name}
      </span>
    </a>
  );
}

function SkillOrbit({
  skills,
  Icon,
  reduce,
}: {
  skills: Skill[];
  Icon: LucideIcon;
  reduce: boolean | null;
}) {
  const innerSkills = skills.filter((_, i) => i % 2 === 0);
  const outerSkills = skills.filter((_, i) => i % 2 === 1);
  const inner = ringLayout(innerSkills, 24);
  const outer = ringLayout(outerSkills, 46, outerSkills.length ? 180 / outerSkills.length : 0);
  const nodes = [...inner, ...outer];
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative mx-auto aspect-square w-56 sm:w-60">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {nodes.map((node) => {
          const active = node.skill.name === hovered;
          return (
            <line
              key={node.skill.name}
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke={active ? "rgb(var(--c-brand))" : "rgb(var(--c-line))"}
              strokeWidth={active ? 1.1 : 0.5}
              strokeDasharray={active ? "2.5 1.5" : undefined}
              className={active && !reduce ? "signal-flow" : undefined}
              style={{ transition: "stroke 0.2s ease, stroke-width 0.2s ease" }}
            />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand/12 text-brand ring-4 ring-card">
        <Icon size={19} aria-hidden="true" />
      </div>
      {nodes.map((node, i) => (
        <SkillNode
          key={node.skill.name}
          node={node}
          reduce={reduce}
          delay={0.1 + i * 0.05}
          onHoverChange={setHovered}
        />
      ))}
    </div>
  );
}

/**
 * Skills — a per-category orbit: skills arranged in a ring around
 * the category icon, each with an animated proficiency ring.
 * Every skill link (data in src/content/skills.ts) opens the same
 * Wikipedia/roadmap.sh article it always did.
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
          title="Things I Know"
          lede="Grouped into orbits, searchable, and honest about levels. Click any skill to read about the technology."
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
                <div className="card-shell flex h-full flex-col items-center p-6 text-center transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
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
                    <h3 className="font-display text-lg font-semibold">{group.label}</h3>
                  )}
                  <div className="mt-5">
                    <SkillOrbit skills={group.skills} Icon={Icon} reduce={reduce} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-mute">
            <span className="font-mono">legend:</span>
            {Object.entries(LEVEL_COLOR).map(([level, color]) => (
              <span key={level} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
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
