"use client";

import { useState } from "react";
import { Check, Download, ExternalLink, FileText, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { researchPaper } from "@/content/research";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * Research — publication details, abstract, contributions,
 * download, and one-click citation copy.
 * Data lives in src/content/research.ts.
 */
export function Research() {
  const [copied, setCopied] = useState(false);

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(researchPaper.citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard unavailable — the citation text is selectable anyway.
    }
  }

  return (
    <section id="research" aria-label="Research paper" className="section-pad">
      <SectionBackdrop kind="grid" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="research"
          title="Research"
          lede="Where engineering met the scientific method — and both improved."
        />

        <Reveal>
          <article className="card-shell relative overflow-hidden p-7 sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
            />

            <div className="relative">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="chip border-brand/40 text-brand">
                  <FileText size={11} aria-hidden="true" />
                  {researchPaper.status} · {researchPaper.year}
                </span>
                <span className="chip">{researchPaper.venue}</span>
              </div>

              <h3 className="max-w-3xl font-display text-xl font-bold leading-snug sm:text-2xl">
                {researchPaper.title}
              </h3>
              <p className="mt-2 text-sm text-mute">
                {researchPaper.authors.join(", ")}
              </p>

              <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-brand">
                    Abstract
                  </h4>
                  <p className="text-sm leading-relaxed text-ink/85">
                    {researchPaper.abstract}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {researchPaper.keywords.map((k) => (
                      <li key={k} className="chip">
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-mono text-xs uppercase tracking-widest text-brand2">
                    Key contributions
                  </h4>
                  <ul className="space-y-2 text-sm text-ink/85">
                    {researchPaper.contributions.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand2"
                          aria-hidden="true"
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line/50 pt-6">
                <a
                  href={researchPaper.publicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2.5 text-xs"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  Read paper (official publication)
                </a>
                <a
                  href={researchPaper.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !py-2.5 text-xs"
                >
                  <Download size={14} aria-hidden="true" />
                  Download PDF
                </a>
                <button
                  type="button"
                  onClick={copyCitation}
                  className="btn-ghost !py-2.5 text-xs"
                >
                  {copied ? (
                    <Check size={14} className="text-brand2" aria-hidden="true" />
                  ) : (
                    <Quote size={14} aria-hidden="true" />
                  )}
                  {copied ? "Citation copied" : "Copy citation"}
                </button>
              </div>

              <blockquote className="mt-4 rounded-lg border border-line/50 bg-surface/60 p-4 font-mono text-xs leading-relaxed text-mute">
                {researchPaper.citation}
              </blockquote>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
