import { BookOpen, Compass, Laptop, Lightbulb, Map } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { learningNow, nowItems, philosophy, roadmap, uses } from "@/content/profile";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { ContextualMark } from "@/components/illustrations/ContextualMark";

/**
 * Now — the living section: what I'm doing, learning, aiming
 * for, working with, and the principles underneath. All content
 * in src/content/profile.ts (update monthly).
 */
export function Now() {
  return (
    <section id="now" aria-label="Now — current focus" className="section-pad">
      <SectionBackdrop kind="grid" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="now"
          title="Now"
          lede="A living snapshot — current focus, the learning queue, the road ahead, and the setup it all happens on."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Reveal>
            <div className="card-shell relative h-full overflow-hidden p-6">
              <ContextualMark
                kind="mug"
                className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-brand2/[0.07]"
              />
              <h3 className="relative mb-3 flex items-center gap-2 text-sm font-semibold">
                <Compass size={15} className="text-brand" aria-hidden="true" />
                Right now
              </h3>
              <ul className="relative space-y-2 text-sm text-ink/85">
                {nowItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="card-shell h-full p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <BookOpen size={15} className="text-brand2" aria-hidden="true" />
                Currently learning
              </h3>
              <ul className="flex flex-wrap gap-2">
                {learningNow.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 mt-6 flex items-center gap-2 text-sm font-semibold">
                <Map size={15} className="text-brand" aria-hidden="true" />
                Roadmap
              </h3>
              <ol className="space-y-2.5">
                {roadmap.map((r) => (
                  <li key={r.period} className="flex gap-3 text-sm">
                    <span className="w-16 shrink-0 font-mono text-xs text-brand">
                      {r.period}
                    </span>
                    <span className="text-ink/85">{r.goal}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-shell h-full p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Laptop size={15} className="text-brand" aria-hidden="true" />
                Uses
              </h3>
              <dl className="space-y-2">
                {uses.map((u) => (
                  <div key={u.category} className="text-sm">
                    <dt className="font-mono text-xs text-mute">{u.category}</dt>
                    <dd className="text-ink/85">{u.items}</dd>
                  </div>
                ))}
              </dl>
              <h3 className="mb-2 mt-6 flex items-center gap-2 text-sm font-semibold">
                <Lightbulb size={15} className="text-brand2" aria-hidden="true" />
                Working philosophy
              </h3>
              <ul className="space-y-1.5 text-sm italic text-mute">
                {philosophy.slice(0, 3).map((p) => (
                  <li key={p}>“{p}”</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
