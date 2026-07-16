"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Briefcase, CheckCircle2, GraduationCap, MapPin, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * Journey — Experience + Education merged into ONE chronological
 * timeline (newest first: work, then the classrooms it started in).
 * The spine line draws itself as you scroll and each node pops into
 * place — the section reads as a single road, not two lists.
 *
 * Keeps BOTH anchor ids: the section is #experience and the
 * education group carries #education, so old deep links, terminal
 * `cd` targets, and palette nav all still land correctly.
 */
export function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="experience" aria-label="My journey" className="section-pad">
      <SectionBackdrop kind="timeline" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="journey"
          title="My Journey"
          lede="Work and study on one road, newest first — internships, freelance clients, and the classrooms where it all started."
        />

        <ol ref={listRef} className="relative space-y-10 pl-8 sm:pl-10">
          {/* Static faint rail + the scroll-drawn line on top of it */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-px bg-line/60"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduce ? 1 : lineScale }}
            className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-brand via-brand to-brand2"
          />

          {experience.map((job, i) => (
            <li key={job.id} className="relative">
              <TimelineNode icon="work" />
              <Reveal delay={i * 0.08}>
                <article className="card-shell p-6 sm:p-7">
                  <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{job.role}</h3>
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
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mute"
                              aria-hidden="true"
                            />
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
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand2"
                              aria-hidden="true"
                            />
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

          {education.map((item, i) => (
            <li
              key={item.id}
              className="relative"
              {...(i === 0 ? { id: "education" } : {})}
            >
              <TimelineNode icon="study" />
              <Reveal delay={i * 0.08}>
                <article className="card-shell p-6 hover:!border-brand2/40 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand2/12 text-brand2">
                        <GraduationCap size={20} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold">{item.degree}</h3>
                        <p className="text-sm font-medium text-brand2">{item.stream}</p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-mute">{item.duration}</p>
                  </div>

                  <p className="mt-4 text-sm text-ink/90">{item.institution}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-mute">
                    <MapPin size={11} aria-hidden="true" />
                    {item.location}
                  </p>
                  <p className="mt-4 border-t border-line/50 pt-4 text-sm leading-relaxed text-mute">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Timeline node — pops into place as it scrolls into view. */
function TimelineNode({ icon }: { icon: "work" | "study" }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      initial={reduce ? false : { scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-bg sm:-left-[49px] ${
        icon === "work" ? "border-brand/50" : "border-brand2/50"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${icon === "work" ? "bg-brand" : "bg-brand2"}`}
      />
    </motion.span>
  );
}
