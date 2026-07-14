"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  Bot,
  CheckCircle2,
  Code2,
  ExternalLink,
  GitBranch,
  Github,
  Languages as LanguagesIcon,
  Server,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { site } from "@/config/site";
import { useExperience } from "@/lib/theme-context";
import { skillGroups } from "@/content/skills";
import { learningNow, nowItems } from "@/content/profile";
import { recentArticles } from "@/content/blog";
import { siteStatistics } from "@/content/datasets";
import { AppearanceToggle } from "@/components/layout/ThemeSwitcher";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { StatImage } from "@/components/ui/StatImage";

interface GithubStats {
  repos: number | null;
  followers: number | null;
}

interface InsightsSummary {
  chatSessions: number;
}

/** Core languages with a qualitative proficiency bar (from the
 *  same level data as the Skills section — not fabricated repo
 *  percentages). */
const LANGUAGE_LEVELS: { name: string; level: "Advanced" | "Proficient" | "Comfortable" | "Learning" }[] = [
  { name: "Python", level: "Advanced" },
  { name: "TypeScript", level: "Advanced" },
  { name: "JavaScript", level: "Advanced" },
  { name: "SQL", level: "Proficient" },
];
const LEVEL_WIDTH: Record<string, number> = {
  Advanced: 90,
  Proficient: 70,
  Comfortable: 50,
  Learning: 30,
};

function Widget({
  title,
  icon: Icon,
  children,
  wide = false,
}: {
  title: string;
  icon: typeof Github;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      aria-label={title}
      className={`card-shell flex min-w-0 flex-col p-4 ${wide ? "md:col-span-2" : ""}`}
    >
      <h2 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-mute">
        <Icon size={13} className="text-brand" aria-hidden="true" />
        {title}
      </h2>
      <div className="min-h-0 min-w-0 flex-1">{children}</div>
    </section>
  );
}

/**
 * DevDashboard — Developer mode's takeover: an editor-styled
 * dashboard of live widgets — GitHub, LeetCode, languages, tech
 * stack, learning, AI usage, and system status.
 */
export function DevDashboard() {
  const { setMode } = useExperience();
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [insights, setInsights] = useState<InsightsSummary | null>(null);
  const [chartOk, setChartOk] = useState(true);
  const [streakOk, setStreakOk] = useState(true);
  const [leetOk, setLeetOk] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let cancelled = false;
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => !cancelled && setStats(d))
      .catch(() => !cancelled && setStats({ repos: null, followers: null }));
    fetch("/api/insights")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && d && setInsights(d))
      .catch(() => undefined);
    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      role="application"
      aria-label="Developer Dashboard mode"
      className="relative fixed inset-0 z-[60] flex flex-col bg-bg"
    >
      <SectionBackdrop kind="matrix" />

      {/* Editor-style title bar */}
      <div className="relative z-[1] flex h-12 items-center justify-between border-b border-line/70 bg-surface/90 px-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-brand">&lt;/&gt; dev.dashboard</span>
          <span className="hidden text-mute sm:inline">
            {site.name.toLowerCase().replace(/\s+/g, "-")}.tsx
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-brand2 md:flex">
            <GitBranch size={12} aria-hidden="true" /> main · deployed
          </span>
          <AppearanceToggle />
          <button
            type="button"
            onClick={() => setMode("professional")}
            className="btn-ghost !px-3 !py-1.5 text-xs"
          >
            <X size={13} aria-hidden="true" /> exit
          </button>
        </div>
      </div>

      {/* Widget grid */}
      <div className="relative z-[1] min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto grid min-w-0 max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Widget title="GitHub contributions" icon={Github} wide>
            {chartOk ? (
              <div className="overflow-x-auto rounded-lg border border-line/60 bg-surface/60 p-2">
                <StatImage
                  src={`https://ghchart.rshah.org/58a6ff/${site.githubUsername}`}
                  alt={`GitHub contribution graph for ${site.githubUsername}`}
                  height={112}
                  minWidth={600}
                  bordered={false}
                  onFail={() => setChartOk(false)}
                />
              </div>
            ) : (
              <p className="text-sm text-mute">
                Chart service unavailable — the profile itself never is.
              </p>
            )}
            {streakOk && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-line/60 bg-surface/60 p-2">
                <StatImage
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${site.githubUsername}&hide_border=true&background=00000000&stroke=0000&ring=58a6ff&fire=22c55e&currStreakLabel=58a6ff`}
                  alt={`GitHub streak stats for ${site.githubUsername}`}
                  height={130}
                  minWidth={320}
                  bordered={false}
                  onFail={() => setStreakOk(false)}
                />
              </div>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-mute">
              {stats?.repos != null && <span>{stats.repos} public repos</span>}
              {stats?.followers != null && <span>{stats.followers} followers</span>}
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-brand hover:underline"
              >
                @{site.githubUsername} <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
          </Widget>

          <Widget title="LeetCode" icon={Code2}>
            {leetOk ? (
              <StatImage
                src={`https://leetcard.jacoblin.cool/${site.leetcodeUsername}?theme=dark&font=JetBrains%20Mono`}
                alt={`LeetCode statistics for ${site.leetcodeUsername}`}
                height={200}
                onFail={() => setLeetOk(false)}
              />
            ) : (
              <p className="text-sm text-mute">Stats card napping — profile linked below.</p>
            )}
            <a
              href={`https://leetcode.com/u/${site.leetcodeUsername}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-brand2 hover:underline"
            >
              leetcode.com/u/{site.leetcodeUsername}
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          </Widget>

          <Widget title="Languages" icon={LanguagesIcon}>
            <ul className="space-y-2.5">
              {LANGUAGE_LEVELS.map((lang) => (
                <li key={lang.name}>
                  <div className="mb-1 flex items-center justify-between font-mono text-xs">
                    <span className="text-ink/85">{lang.name}</span>
                    <span className="text-mute">{lang.level}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand2"
                      style={{ width: `${LEVEL_WIDTH[lang.level]}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Tech stack" icon={Code2}>
            <div className="flex flex-wrap gap-1.5">
              {skillGroups.slice(0, 4).flatMap((g) =>
                g.skills.slice(0, 4).map((s) => (
                  <span key={`${g.id}-${s.name}`} className="chip !py-0.5 text-[10px]">
                    {s.name}
                  </span>
                ))
              )}
            </div>
            <p className="mt-3 font-mono text-[11px] text-mute">
              {siteStatistics.technologiesUsed}+ technologies · full list on the site
            </p>
          </Widget>

          <Widget title="Current focus" icon={Target}>
            <p className="text-sm leading-relaxed text-ink/90">{nowItems[0]}</p>
            <ul className="mt-3 space-y-1.5 border-t border-line/60 pt-3 text-xs text-mute">
              {nowItems.slice(1, 3).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-mute" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Learning queue" icon={Activity}>
            <ul className="space-y-1.5 text-sm">
              {learningNow.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="AI usage" icon={Bot}>
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              {["gemini", "groq", "openrouter"].map((step, i, arr) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span className="rounded-md border border-line bg-surface/70 px-2 py-1 text-ink/85">
                    {step}
                  </span>
                  {i < arr.length - 1 && <span className="text-mute">→</span>}
                </li>
              ))}
            </ol>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-mute">
              <CheckCircle2 size={11} className="text-brand2" aria-hidden="true" />
              free-tier chain · automatic fallback
            </p>
            {insights && (
              <p className="mt-2 font-mono text-[11px] text-mute">
                {insights.chatSessions.toLocaleString()} assistant conversations started
              </p>
            )}
          </Widget>

          <Widget title="System status" icon={Server}>
            <ul className="space-y-2 font-mono text-xs">
              {[
                ["portfolio", "operational"],
                ["api routes", "operational"],
                ["ai chain", "gemini → groq → openrouter"],
                ["deployment", "vercel · auto from main"],
                ["database", "supabase postgres (rls)"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-2">
                  <span className="text-mute">{k}</span>
                  <span className="flex items-center gap-1.5 text-brand2">
                    <CheckCircle2 size={11} aria-hidden="true" /> {v}
                  </span>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Recent writing" icon={BookOpen} wide>
            <ul className="grid gap-2 sm:grid-cols-2">
              {recentArticles.slice(0, 4).map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/blog/${a.slug}`}
                    onClick={() => setMode("professional")}
                    className="group block text-sm"
                  >
                    <span className="font-medium leading-snug group-hover:text-brand">
                      {a.title}
                    </span>
                    <span className="block font-mono text-[10px] text-mute">
                      {a.category} · {a.readingTime} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </div>

      {/* Status strip */}
      <div className="relative z-[1] flex h-7 items-center justify-between border-t border-line/70 bg-brand px-3 font-mono text-[11px] text-bg">
        <span>⬢ {site.name}</span>
        <span className="hidden sm:inline">open to opportunities · {site.email}</span>
        <span>UTF-8 · TSX · Ln 42</span>
      </div>
    </div>
  );
}
