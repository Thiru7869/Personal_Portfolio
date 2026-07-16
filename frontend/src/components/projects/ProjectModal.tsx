"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  Sparkles,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import type { Project } from "@shared/types";
import { trackEvent } from "@/lib/analytics";
import { EASE_OUT } from "@/lib/motion";
import { useFocusTrap } from "@/lib/use-focus-trap";

/**
 * ProjectModal — the case-study experience. Shared by the homepage
 * file-manager explorer and the /projects page grid. The story is a
 * numbered walkthrough (problem → solution → architecture →
 * challenges → features → learnings → stack) whose steps reveal as
 * the modal body scrolls; the architecture text renders as a flow
 * strip when it uses "→" separators. Focus trapping / restore /
 * Escape via useFocusTrap.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const close = useCallback(onClose, [onClose]);
  const dialogRef = useFocusTrap<HTMLDivElement>(!!project, close);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) trackEvent({ type: "project_view", slug: project.slug });
  }, [project]);

  /** "A → B → C" architecture text becomes a flow strip; plain text
   *  stays a paragraph. */
  const flow = project?.architecture.includes("→")
    ? project.architecture.split("→").map((s) => s.trim())
    : null;

  let step = 0;
  const num = () => String(++step).padStart(2, "0");

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={close}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
            className="card-shell flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-line/60 p-6 pb-5 sm:px-8">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-xs text-mute">{project.year}</span>
                  {project.featured && (
                    <span className="chip !py-0.5 !text-[10px] text-brand">
                      <Sparkles size={9} aria-hidden="true" /> Featured
                    </span>
                  )}
                </div>
                <h3 id="project-modal-title" className="font-display text-2xl font-bold">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-brand2">{project.tagline}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close project details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:border-brand/60 hover:text-brand"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Walkthrough body */}
            <div ref={scrollRef} className="overflow-y-auto p-6 sm:px-8">
              <div className="space-y-7 text-sm leading-relaxed">
                <Step root={scrollRef} n={num()} label="The problem">
                  <p className="text-ink/90">{project.problem}</p>
                </Step>

                <Step root={scrollRef} n={num()} label="The solution">
                  <p className="text-ink/90">{project.solution}</p>
                </Step>

                <Step root={scrollRef} n={num()} label="Architecture">
                  {flow ? (
                    <ol className="flex flex-wrap items-center gap-y-2">
                      {flow.map((part, i) => (
                        <li key={part} className="flex items-center">
                          <span className="rounded-lg border border-line/80 bg-surface/70 px-2.5 py-1.5 font-mono text-xs text-ink/90">
                            {part}
                          </span>
                          {i < flow.length - 1 && (
                            <ArrowRight
                              size={13}
                              className="mx-1.5 shrink-0 text-brand"
                              aria-hidden="true"
                            />
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-ink/90">{project.architecture}</p>
                  )}
                </Step>

                <Step root={scrollRef} n={num()} label="Challenges">
                  <ul className="list-disc space-y-1 pl-5 text-ink/90 marker:text-brand">
                    {project.challenges.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </Step>

                {project.features.length > 0 && (
                  <Step root={scrollRef} n={num()} label="Key features">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {project.features.map((f) => (
                        <li key={f} className="flex gap-2 text-ink/90">
                          <CheckCircle2
                            size={14}
                            className="mt-0.5 shrink-0 text-brand2"
                            aria-hidden="true"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Step>
                )}

                {project.images && project.images.length > 0 && (
                  <Step root={scrollRef} n={num()} label="Gallery">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {project.images.map((src) => (
                        <Image
                          key={src}
                          src={src}
                          alt={`${project.title} screenshot`}
                          width={480}
                          height={300}
                          className="h-40 w-auto shrink-0 rounded-xl border border-line/70 object-cover"
                        />
                      ))}
                    </div>
                  </Step>
                )}

                <Step root={scrollRef} n={num()} label="What I learned">
                  <ul className="list-disc space-y-1 pl-5 text-ink/90 marker:text-brand2">
                    {project.learnings.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </Step>

                <Step root={scrollRef} n={num()} label="Tech stack">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Step>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 border-t border-line/60 p-6 pt-5 sm:px-8">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !py-2 text-xs"
                >
                  <Github size={14} aria-hidden="true" /> Source code
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !py-2 text-xs"
                >
                  <SquareArrowOutUpRight size={14} aria-hidden="true" /> Live demo
                </a>
              )}
              {project.caseStudy && (
                <Link href={project.caseStudy} className="btn-ghost !py-2 text-xs">
                  Case study
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** One numbered walkthrough step — reveals as the modal body
 *  scrolls (viewport root = the modal's scroll container). */
function Step({
  root,
  n,
  label,
  children,
}: {
  root: React.RefObject<HTMLDivElement | null>;
  n: string;
  label: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root, once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h4 className="mb-1.5 flex items-baseline gap-2 font-mono text-xs uppercase tracking-widest text-brand">
        <span className="text-mute/70">{n}</span>
        {label}
      </h4>
      {children}
    </motion.section>
  );
}
