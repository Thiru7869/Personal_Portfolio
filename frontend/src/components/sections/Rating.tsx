"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CircleCheck,
  GitMerge,
  GitPullRequestArrow,
  MessageSquare,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import type { RatingSummary } from "@shared/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const RATED_KEY = "thiru-portfolio-rated";

type Tone = "positive" | "neutral" | "warn" | "critical";

interface Verdict {
  /** Maps 1:1 to the score column in Supabase — presentation only changes. */
  score: 1 | 2 | 3 | 4 | 5;
  /** PR-review-style verdict label. */
  label: string;
  /** One-line rationale shown under the label. */
  detail: string;
  icon: LucideIcon;
  tone: Tone;
}

/**
 * Review is framed as a pull-request sign-off rather than a star
 * rating. Each verdict still stores a 1–5 score (same API/DB
 * contract), so the backend and admin views are untouched — only
 * the experience changes. Ordered best → worst as displayed.
 */
const VERDICTS: Verdict[] = [
  { score: 5, label: "LGTM", detail: "Merge and ship it", icon: GitMerge, tone: "positive" },
  { score: 4, label: "Approve", detail: "Solid — minor nits", icon: CircleCheck, tone: "positive" },
  { score: 3, label: "Comment", detail: "Good, a few rough edges", icon: MessageSquare, tone: "neutral" },
  { score: 2, label: "Request changes", detail: "Needs another pass", icon: GitPullRequestArrow, tone: "warn" },
  { score: 1, label: "Blocking", detail: "Not ready to ship", icon: OctagonAlert, tone: "critical" },
];

const TONE_TEXT: Record<Tone, string> = {
  positive: "text-brand",
  neutral: "text-brand2",
  warn: "text-amber-400",
  critical: "text-red-400",
};

type Status = "idle" | "sending" | "done" | "error" | "offline";

/** Derive a CI-style build status from the running average score. */
function buildStatus(average: number): { label: string; cls: string } {
  if (average >= 4.5) return { label: "SHIP READY", cls: "text-brand border-brand/40 bg-brand/10" };
  if (average >= 3.5) return { label: "PASSING", cls: "text-brand border-brand/40 bg-brand/10" };
  if (average >= 2.5) return { label: "UNSTABLE", cls: "text-amber-400 border-amber-400/40 bg-amber-400/10" };
  return { label: "NEEDS WORK", cls: "text-red-400 border-red-400/40 bg-red-400/10" };
}

/**
 * Rating — a "Ship Readiness Review": visitors sign off on the
 * portfolio like a pull request (verdict → 1–5 score) with an
 * optional review comment. Stored in Supabase; the live ship-
 * readiness score and verdict breakdown render from the same
 * data. Degrades to an offline card when the DB isn't configured.
 */
export function Rating() {
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [selected, setSelected] = useState<Verdict["score"] | 0>(0);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const loadSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/rating");
      if (res.status === 503) {
        setStatus("offline");
        return;
      }
      if (res.ok) {
        setSummary(await res.json());
      }
    } catch {
      // Network hiccup — the form still works.
    }
  }, []);

  useEffect(() => {
    void loadSummary();
    try {
      if (localStorage.getItem(RATED_KEY)) setStatus("done");
    } catch {
      // storage unavailable
    }
  }, [loadSummary]);

  async function submit() {
    if (!selected || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: selected, feedback: feedback.trim() || undefined }),
      });
      if (res.status === 503) {
        setStatus("offline");
        return;
      }
      if (!res.ok) throw new Error("failed");
      trackEvent({ type: "rating_submit" });
      if (selected === 5) {
        const { fireConfetti } = await import("@/lib/confetti");
        fireConfetti();
      }
      try {
        localStorage.setItem(RATED_KEY, String(selected));
      } catch {
        // storage unavailable
      }
      setStatus("done");
      void loadSummary();
    } catch {
      setStatus("error");
    }
  }

  // Roving-tabindex + arrow-key navigation for the radiogroup (WCAG).
  function onKeyNav(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (index + 1) % VERDICTS.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = (index - 1 + VERDICTS.length) % VERDICTS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = VERDICTS.length - 1;
    else return;
    e.preventDefault();
    setSelected(VERDICTS[next].score);
    optionRefs.current[next]?.focus();
  }

  const readiness = useMemo(() => {
    if (!summary || summary.count === 0) return 0;
    return Math.round((summary.average / 5) * 100);
  }, [summary]);
  const build = summary ? buildStatus(summary.average) : null;

  // Index that owns the single tab stop when nothing is selected yet.
  const activeIndex = VERDICTS.findIndex((v) => v.score === selected);
  const tabStop = activeIndex === -1 ? 0 : activeIndex;

  return (
    <section id="rating" aria-label="Review this portfolio" className="section-pad exec-hide">
      <div className="section-shell">
        <SectionHeading
          eyebrow="review"
          title="Ship readiness review"
          lede="You've read the code — now sign off on it. Leave a verdict like you would on a pull request; it goes straight into the database you just read about."
        />

        <Reveal>
          <div className="card-shell mx-auto grid max-w-3xl gap-8 p-7 sm:p-9 md:grid-cols-[1fr_auto_1fr]">
            {/* Review input */}
            <div>
              {status === "done" ? (
                <div aria-live="polite">
                  <p className="font-display text-lg font-semibold text-brand2">
                    Review submitted — logged and appreciated.
                  </p>
                  <p className="mt-2 text-sm text-mute">
                    Your verdict is merged into the numbers. If you left a
                    comment, I read every word — it&apos;s how this site gets
                    better.
                  </p>
                </div>
              ) : status === "offline" ? (
                <div aria-live="polite">
                  <p className="font-display text-lg font-semibold">
                    Review pipeline is warming up
                  </p>
                  <p className="mt-2 text-sm text-mute">
                    The reviews database isn&apos;t connected in this deployment
                    yet. The contact form below still reaches me directly.
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-mute">
                    your verdict
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Your review verdict"
                    className="space-y-1.5"
                  >
                    {VERDICTS.map((v, i) => {
                      const isSelected = selected === v.score;
                      const Icon = v.icon;
                      return (
                        <motion.button
                          key={v.score}
                          ref={(el) => {
                            optionRefs.current[i] = el;
                          }}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={i === tabStop ? 0 : -1}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelected(v.score)}
                          onKeyDown={(e) => onKeyNav(e, i)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
                            isSelected
                              ? "border-brand/60 bg-brand/10"
                              : "border-line bg-surface/50 hover:border-brand/40 hover:bg-surface"
                          )}
                        >
                          <Icon
                            size={18}
                            className={cn(
                              "shrink-0 transition-colors",
                              isSelected ? TONE_TEXT[v.tone] : "text-mute"
                            )}
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="block font-mono text-sm font-semibold leading-tight">
                              {v.label}
                            </span>
                            <span className="block text-xs text-mute">{v.detail}</span>
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value.slice(0, 300))}
                    rows={2}
                    placeholder="Optional review comment: one thing you'd improve…"
                    aria-label="Optional review comment"
                    className="mt-3 w-full resize-none rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-mute/70 focus:border-brand/60 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={submit}
                    disabled={!selected || status === "sending"}
                    className="btn-primary mt-3 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status === "sending" ? "Submitting…" : "Submit review"}
                  </button>
                  {status === "error" && (
                    <p className="mt-2 text-xs text-red-400" role="alert">
                      Couldn&apos;t save that — mind trying once more?
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="hidden w-px bg-line/60 md:block" aria-hidden="true" />

            {/* Live ship-readiness report */}
            <div aria-live="polite">
              <p className="font-mono text-xs uppercase tracking-widest text-mute">
                ship readiness
              </p>
              {summary && summary.count > 0 && build ? (
                <>
                  <div className="mt-1 flex items-baseline gap-3">
                    <p className="font-display text-5xl font-bold text-brand">
                      {readiness}
                      <span className="text-lg text-mute">%</span>
                    </p>
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                        build.cls
                      )}
                    >
                      {build.label}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${readiness}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand2"
                    />
                  </div>
                  <p className="mt-2 text-xs text-mute">
                    across {summary.count} review{summary.count === 1 ? "" : "s"}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {VERDICTS.map((v) => {
                      const n = summary.distribution[v.score] ?? 0;
                      const pct = summary.count ? (n / summary.count) * 100 : 0;
                      return (
                        <div key={v.score} className="flex items-center gap-2 text-xs">
                          <span className="w-24 shrink-0 truncate font-mono text-mute">
                            {v.label}
                          </span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: 0.1 }}
                              className="h-full rounded-full bg-gradient-to-r from-brand to-brand2"
                            />
                          </div>
                          <span className="w-6 text-right font-mono text-mute">{n}</span>
                        </div>
                      );
                    })}
                  </div>

                  {summary.recentComments.length > 0 && (
                    <div className="mt-5 space-y-2 border-t border-line/60 pt-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                        recent comments
                      </p>
                      {summary.recentComments.map((c, i) => {
                        const verdict = VERDICTS.find((v) => v.score === c.score);
                        return (
                          <motion.p
                            key={`${c.score}-${i}`}
                            initial={{ opacity: 0, x: -6 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            className="flex items-start gap-2 text-xs leading-relaxed"
                          >
                            <span
                              className={cn(
                                "mt-0.5 shrink-0 font-mono text-[10px] font-semibold",
                                verdict ? TONE_TEXT[verdict.tone] : "text-mute"
                              )}
                            >
                              {verdict?.label ?? c.score}
                            </span>
                            <span className="text-mute">&ldquo;{c.feedback}&rdquo;</span>
                          </motion.p>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-mute">
                  {status === "offline"
                    ? "The readiness score appears here once the database is connected."
                    : "No reviews merged yet — you could be the first sign-off."}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
