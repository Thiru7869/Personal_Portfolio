"use client";

import { useState } from "react";
import {
  Brain,
  ChartLine,
  ExternalLink,
  Github,
  Kanban,
  Leaf,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@shared/types";
import { miniProjects, projects } from "@/content/projects";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

const projectIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  leaf: Leaf,
  brain: Brain,
  users: Users,
  kanban: Kanban,
  chart: ChartLine,
};

/**
 * ProjectsGrid — the full card grid for the /projects page:
 * every flagship project with its case-study modal, plus every
 * public GitHub repo.
 */
export function ProjectsGrid() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => {
          const Icon = projectIcons[project.icon] ?? Sparkles;
          return (
            <Reveal key={project.slug} delay={(i % 3) * 0.07}>
              <TiltCard maxTilt={4} className="h-full">
                <article className="card-shell group flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 text-brand transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div className="flex items-center gap-2">
                      {project.featured && (
                        <span className="chip !border-brand/40 !text-brand">
                          <Star size={10} aria-hidden="true" /> Featured
                        </span>
                      )}
                      <span className="font-mono text-xs text-mute">{project.year}</span>
                    </div>
                  </div>

                  <h2 className="font-display text-lg font-semibold">{project.title}</h2>
                  <p className="mt-0.5 text-xs font-medium text-brand2">{project.tagline}</p>
                  <p className="mt-3 flex-1 text-sm text-mute">{project.description}</p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                    {project.techStack.length > 4 && (
                      <li className="chip">+{project.techStack.length - 4}</li>
                    )}
                  </ul>

                  <div className="mt-5 flex items-center gap-2 border-t border-line/60 pt-4">
                    <button
                      type="button"
                      onClick={() => setActive(project)}
                      className="btn-primary flex-1 !py-2 text-xs"
                    >
                      Case Study
                    </button>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-200 hover:border-brand/60 hover:text-brand active:scale-[0.98]"
                      >
                        <Github size={15} aria-hidden="true" />
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live demo`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-all duration-200 hover:border-brand/60 hover:text-brand active:scale-[0.98]"
                      >
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      {/* Every public repo */}
      <Reveal delay={0.1}>
        <div className="mt-12">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-mute">
            more on github — every public repo
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {miniProjects.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-shell group flex h-full flex-col p-4 transition-all duration-200 hover:border-brand/50"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-sm font-semibold group-hover:text-brand">
                      {repo.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-mute">
                      {repo.live && (
                        <ExternalLink size={12} aria-hidden="true" className="text-brand2" />
                      )}
                      <Github size={13} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="mt-1.5 line-clamp-2 flex-1 text-xs text-mute">
                    {repo.description}
                  </span>
                  <span className="mt-2 font-mono text-[10px] text-mute/80">
                    {repo.tech.join(" · ")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}
