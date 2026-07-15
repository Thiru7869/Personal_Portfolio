import { Hammer, MapPin, Milestone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { aboutParagraphs, aboutSections, enjoyBuilding } from "@/content/profile";
import { site } from "@/config/site";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { ContextualMark } from "@/components/illustrations/ContextualMark";

/**
 * About — the owner's story verbatim (src/content/profile.ts),
 * organized into Journey / Work Style / Where I'm Headed, plus
 * "Things I enjoy building" and the developer snapshot.
 *
 * Deliberately NOT duplicated here: the education/experience
 * timeline lives in the Experience + Education sections, and
 * "Currently learning" / "Developer philosophy" live in the Now
 * section — showing them once each keeps the page honest and
 * shorter.
 */
export function About() {
  return (
    <section id="about" aria-label="About me" className="section-pad">
      <SectionBackdrop kind="paper" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="about"
          title="About Me"
          lede="The story, in my own words — how I got here, how I work, and where I'm headed."
        />

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* The story, verbatim, in titled sections */}
          <div className="space-y-8">
            {aboutSections.map((section, si) => (
              <Reveal key={section.title} delay={si * 0.06}>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand">
                    <Milestone size={13} aria-hidden="true" />
                    {section.title}
                  </h3>
                  <div className="space-y-4 text-[15px] leading-relaxed text-ink/90">
                    {section.paragraphs.map((idx) => (
                      <p key={idx}>{aboutParagraphs[idx]}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Sidebar: developer snapshot + things I enjoy building */}
          <div className="space-y-5">
            <Reveal delay={0.1}>
              <aside className="card-shell p-6 font-mono text-sm transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
                <p className="mb-4 text-xs uppercase tracking-widest text-mute">
                  developer snapshot
                </p>
                <ul className="space-y-3">
                  <li>
                    <span className="text-brand">base:</span>{" "}
                    <span className="inline-flex items-center gap-1 text-ink/90">
                      <MapPin size={11} aria-hidden="true" /> {site.location}
                    </span>
                  </li>
                  <li>
                    <span className="text-brand">roots:</span>{" "}
                    <span className="text-ink/90">{site.hometown}</span>
                  </li>
                  <li>
                    <span className="text-brand">degree:</span>{" "}
                    <span className="text-ink/90">B.Tech CSE, AITS Tirupati</span>
                  </li>
                  <li>
                    <span className="text-brand">research:</span>{" "}
                    <span className="text-ink/90">1 published paper (IJNRD)</span>
                  </li>
                  <li>
                    <span className="text-brand">os:</span>{" "}
                    <span className="text-ink/90">Parrot OS — ask the terminal</span>
                  </li>
                  <li>
                    <span className="text-brand">status:</span>{" "}
                    <span className="text-brand2">{site.availabilityText}</span>
                  </li>
                </ul>
              </aside>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="card-shell relative overflow-hidden p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
                <ContextualMark
                  kind="brackets"
                  className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 text-brand/[0.07]"
                />
                <h3 className="relative mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Hammer size={15} className="text-brand2" aria-hidden="true" />
                  Things I enjoy building
                </h3>
                <ul className="relative space-y-2 text-sm text-ink/85">
                  {enjoyBuilding.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
