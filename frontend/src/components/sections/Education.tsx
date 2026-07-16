import { GraduationCap, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { education } from "@/content/education";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * Education — institution, location, degree, stream, duration,
 * description (no GPA by design). Data in src/content/education.ts.
 */
export function Education() {
  return (
    <section id="education" aria-label="Education" className="section-pad">
      <SectionBackdrop kind="waves" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="education"
          title="Education"
          lede="The formal part of the journey — the informal part is the rest of this site."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <article className="card-shell h-full p-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 text-brand">
                    <GraduationCap size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-mute">{item.duration}</p>
                    <h3 className="font-display text-lg font-semibold">
                      {item.degree}
                    </h3>
                  </div>
                </div>

                <p className="text-sm font-medium text-brand2">{item.stream}</p>
                <p className="mt-1 text-sm text-ink/90">{item.institution}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-mute">
                  <MapPin size={11} aria-hidden="true" />
                  {item.location}
                </p>

                <p className="mt-4 border-t border-line/50 pt-4 text-sm leading-relaxed text-mute">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
