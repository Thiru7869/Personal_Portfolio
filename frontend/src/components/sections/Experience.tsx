import { Briefcase, CheckCircle2, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/content/experience";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * Experience — animated vertical timeline with achievements and
 * responsibilities. Data lives in src/content/experience.ts.
 */
export function Experience() {
  return (
    <section id="experience" aria-label="Experience" className="section-pad">
      <SectionBackdrop kind="timeline" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="experience"
          title="Where I've worked"
          lede="Internships, freelance clients, and what actually got shipped at each stop."
        />

        <ol className="relative space-y-10 border-l border-line/70 pl-8 sm:pl-10">
          {experience.map((job, i) => (
            <li key={job.id} className="relative">
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-brand/50 bg-bg sm:-left-[49px]"
              >
                <span className="h-2 w-2 rounded-full bg-brand" />
              </span>

              <Reveal delay={i * 0.08}>
                <article className="card-shell p-6 transition-all duration-300 hover:border-brand/40 sm:p-7">
                  <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {job.role}
                      </h3>
                      <p className="mt-0.5 text-sm text-brand">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-mute">
                        {job.start} – {job.end}
                      </p>
                      <span className="chip mt-1.5">
                        <Briefcase size={10} aria-hidden="true" />
                        {job.type}
                      </span>
                    </div>
                  </header>

                  <p className="mb-5 text-sm text-mute">{job.summary}</p>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-brand">
                        <CheckCircle2 size={12} aria-hidden="true" />
                        Responsibilities
                      </h4>
                      <ul className="space-y-1.5 text-sm text-ink/85">
                        {job.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mute" aria-hidden="true" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-brand2">
                        <Trophy size={12} aria-hidden="true" />
                        Achievements
                      </h4>
                      <ul className="space-y-1.5 text-sm text-ink/85">
                        {job.achievements.map((a) => (
                          <li key={a} className="flex gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand2" aria-hidden="true" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-line/50 pt-4">
                    {job.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
