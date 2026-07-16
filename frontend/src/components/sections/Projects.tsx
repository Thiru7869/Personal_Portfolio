import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * Projects — the homepage shows a Parrot-style file manager
 * (max six folders; double-click opens the case study). The
 * traditional card grid lives on the dedicated /projects page.
 * Data: src/content/projects.ts.
 */
export function Projects() {
  return (
    <section id="projects" aria-label="Projects" className="section-pad">
      <SectionBackdrop kind="blueprint" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="projects"
          title="Projects"
          lede="Browse them like I do — as folders. Double-click opens the full case study; right-click for demo and source."
        />

        <Reveal>
          <div className="mx-auto max-w-4xl">
            <ProjectExplorer />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
