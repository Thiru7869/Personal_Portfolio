"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Github, Code2 } from "lucide-react";
import { site } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatImage } from "@/components/ui/StatImage";

interface GithubStats {
  repos: number | null;
  followers: number | null;
}

/**
 * Activity — live GitHub contribution graph, profile stats, and
 * LeetCode card. All free public endpoints with graceful
 * fallbacks to plain profile links if a service is down.
 */
export function Activity() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [chartOk, setChartOk] = useState(true);
  const [leetOk, setLeetOk] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setStats(d);
      })
      .catch(() => {
        if (!cancelled) setStats({ repos: null, followers: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="activity" aria-label="Latest coding activity" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="activity"
          title="Latest activity"
          lede="Live from GitHub and LeetCode — the graph doesn't lie, which is exactly why it's here."
        />

        <div className="grid min-w-0 gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Contribution graph */}
          <Reveal className="min-w-0">
            <div className="card-shell flex h-full min-w-0 flex-col p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Github size={15} className="text-brand" aria-hidden="true" />
                  GitHub contributions
                </h3>
                <div className="flex gap-3 font-mono text-xs text-mute">
                  {stats?.repos != null && <span>{stats.repos} repos</span>}
                  {stats?.followers != null && <span>{stats.followers} followers</span>}
                </div>
              </div>
              {chartOk ? (
                <div className="overflow-x-auto rounded-xl border border-line/50 bg-surface/50 p-3">
                  <StatImage
                    src={`https://ghchart.rshah.org/58a6ff/${site.githubUsername}`}
                    alt={`GitHub contribution graph for ${site.githubUsername}`}
                    height={128}
                    minWidth={640}
                    bordered={false}
                    onFail={() => setChartOk(false)}
                  />
                </div>
              ) : (
                <p className="rounded-xl border border-line/50 bg-surface/50 p-4 text-sm text-mute">
                  The chart service is snoozing — the real thing lives on{" "}
                  <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                    my GitHub profile
                  </a>
                  .
                </p>
              )}
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                github.com/{site.githubUsername}
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          {/* LeetCode */}
          <Reveal delay={0.08}>
            <div className="card-shell flex h-full flex-col p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Code2 size={15} className="text-brand2" aria-hidden="true" />
                LeetCode
              </h3>
              {leetOk ? (
                <StatImage
                  src={`https://leetcard.jacoblin.cool/${site.leetcodeUsername}?theme=dark&font=JetBrains%20Mono&ext=heatmap`}
                  alt={`LeetCode statistics for ${site.leetcodeUsername}`}
                  height={280}
                  onFail={() => setLeetOk(false)}
                />
              ) : (
                <p className="rounded-xl border border-line/50 bg-surface/50 p-4 text-sm text-mute">
                  Stats card unavailable right now — the profile itself is
                  always up.
                </p>
              )}
              <a
                href={`https://leetcode.com/u/${site.leetcodeUsername}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand2 hover:underline"
              >
                leetcode.com/u/{site.leetcodeUsername}
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
