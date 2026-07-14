"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Github, SquareArrowOutUpRight, X } from "lucide-react";
import type { Project } from "@shared/types";
import { trackEvent } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/use-focus-trap";

/**
 * ProjectModal — the full case study (problem, solution,
 * architecture, challenges, learnings). Shared by the homepage
 * file-manager explorer and the /projects page grid. Focus
 * trapping / restore / Escape via useFocusTrap.
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

  useEffect(() => {
    if (project) trackEvent({ type: "project_view", slug: project.slug });
  }, [project]);

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
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="card-shell max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
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

            <dl className="space-y-5 text-sm leading-relaxed">
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-widest text-brand">
                  The problem
                </dt>
                <dd className="text-ink/90">{project.problem}</dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-widest text-brand">
                  The solution
                </dt>
                <dd className="text-ink/90">{project.solution}</dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-widest text-brand">
                  Architecture
                </dt>
                <dd className="text-ink/90">{project.architecture}</dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-widest text-brand">
                  Challenges
                </dt>
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-ink/90 marker:text-brand">
                    {project.challenges.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-widest text-brand">
                  What I learned
                </dt>
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-ink/90 marker:text-brand2">
                    {project.learnings.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-widest text-brand">
                  Tech stack
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-line/60 pt-5">
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
