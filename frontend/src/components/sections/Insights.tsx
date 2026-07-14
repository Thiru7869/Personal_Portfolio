"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Download,
  Eye,
  Globe2,
  MonitorSmartphone,
  TerminalSquare,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

interface InsightsData {
  totalViews: number;
  resumeDownloads: number;
  terminalCommands: number;
  chatSessions: number;
  topProjects: { slug: string; views: number }[];
  countries: { name: string; count: number }[];
  devices: { name: string; count: number }[];
}

type State =
  | { kind: "loading" }
  | { kind: "offline" }
  | { kind: "ready"; data: InsightsData };

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
}) {
  return (
    <div className="card-shell p-5 text-center transition-all duration-300 hover:border-brand/40">
      <Icon size={18} className="mx-auto mb-2 text-brand" aria-hidden="true" />
      <p className="font-display text-2xl font-bold">{value.toLocaleString()}</p>
      <p className="mt-0.5 text-xs text-mute">{label}</p>
    </div>
  );
}

function BarList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="card-shell p-6">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-mute">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-mute">Collecting data — check back soon.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.label} className="text-sm">
              <div className="mb-1 flex justify-between">
                <span className="truncate text-ink/90">{item.label}</span>
                <span className="ml-3 font-mono text-xs text-mute">
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.count / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand2"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Insights — "Portfolio Insights": live first-party analytics
 * (views, downloads, countries, devices, top projects) from the
 * /api/insights endpoint backed by Supabase. Shows a friendly
 * offline card when the database isn't connected.
 */
/**
 * Public stats stay hidden until there's enough traffic to be
 * meaningful — showing "3 views" reads worse than showing
 * nothing. Configurable via NEXT_PUBLIC_INSIGHTS_MIN_VIEWS.
 */
const MIN_PUBLIC_VIEWS = Number(
  process.env.NEXT_PUBLIC_INSIGHTS_MIN_VIEWS ?? 100
);

export function Insights() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [belowThreshold, setBelowThreshold] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/insights");
        if (cancelled) return;
        if (!res.ok) {
          setState({ kind: "offline" });
          return;
        }
        const data = (await res.json()) as InsightsData;
        if (data.totalViews < MIN_PUBLIC_VIEWS) {
          setBelowThreshold(true);
          setState({ kind: "offline" });
          return;
        }
        setState({ kind: "ready", data });
      } catch {
        if (!cancelled) setState({ kind: "offline" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="insights" aria-label="Portfolio insights" className="section-pad exec-hide">
      <div className="section-shell">
        <SectionHeading
          eyebrow="insights"
          title="Portfolio Insights"
          lede="This site measures itself — first-party analytics, stored in the same database you can rate it with."
        />

        {state.kind === "loading" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
        )}

        {state.kind === "offline" && (
          <Reveal>
            <div className="card-shell mx-auto max-w-xl p-8 text-center">
              <Activity size={22} className="mx-auto mb-3 text-brand" aria-hidden="true" />
              <h3 className="font-display text-lg font-semibold">
                {belowThreshold ? "Gathering enough signal" : "Telemetry warming up"}
              </h3>
              <p className="mt-2 text-sm text-mute">
                {belowThreshold
                  ? `Public stats appear here once this site has passed ${MIN_PUBLIC_VIEWS} views — small numbers say less than they seem, so they stay private until they're meaningful.`
                  : "Live visitor stats appear here once the analytics database is connected for this deployment. Vercel Analytics and Google Analytics keep counting in the background either way."}
              </p>
            </div>
          </Reveal>
        )}

        {state.kind === "ready" && (
          <>
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Eye} label="Page views" value={state.data.totalViews} />
                <StatCard
                  icon={Download}
                  label="Resume downloads"
                  value={state.data.resumeDownloads}
                />
                <StatCard
                  icon={TerminalSquare}
                  label="Terminal commands run"
                  value={state.data.terminalCommands}
                />
                <StatCard
                  icon={Activity}
                  label="Assistant chats"
                  value={state.data.chatSessions}
                />
              </div>
            </Reveal>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <Reveal delay={0.05}>
                <BarList
                  title="Top viewed projects"
                  items={state.data.topProjects.map((p) => ({
                    label: p.slug.replace(/-/g, " "),
                    count: p.views,
                  }))}
                />
              </Reveal>
              <Reveal delay={0.1}>
                <BarList
                  title={"Visitor countries"}
                  items={state.data.countries.map((c) => ({
                    label: c.name,
                    count: c.count,
                  }))}
                />
              </Reveal>
              <Reveal delay={0.15}>
                <BarList
                  title="Devices"
                  items={state.data.devices.map((d) => ({
                    label: d.name,
                    count: d.count,
                  }))}
                />
              </Reveal>
            </div>

            <p className="mt-4 flex items-center justify-center gap-4 text-xs text-mute">
              <span className="flex items-center gap-1.5">
                <Globe2 size={12} aria-hidden="true" /> Country from request headers
              </span>
              <span className="flex items-center gap-1.5">
                <MonitorSmartphone size={12} aria-hidden="true" /> No cookies, no tracking IDs
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
