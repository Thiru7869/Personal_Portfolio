import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/content/projects";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { FloatingBack } from "@/components/layout/FloatingBack";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project by Poluru Thirumala Narasimha — full case studies with problem, solution, architecture, and learnings, plus every public GitHub repo.",
  alternates: { canonical: "/projects" },
};

/**
 * /projects — the dedicated all-projects page: full case-study
 * cards plus every public repo. The homepage shows the
 * file-manager view of the top six.
 */
export default function ProjectsPage() {
  return (
    <div className="section-shell pb-24 pt-28">
      <FloatingBack href="/" label="Portfolio" />
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-brand"
      >
        <ArrowLeft size={14} aria-hidden="true" /> back to portfolio
      </Link>

      <Reveal>
        <p className="mb-2 font-mono text-sm text-brand">~/projects — all</p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Every project, documented
        </h1>
        <p className="mt-3 max-w-2xl text-mute">
          {projects.length} builds with full case studies — problem, solution,
          architecture, challenges, learnings — and every public repo beneath
          them. Nothing hidden.
        </p>
      </Reveal>

      <div className="mt-10">
        <ProjectsGrid />
      </div>
    </div>
  );
}
