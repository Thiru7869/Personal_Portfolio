import {
  Brain,
  Globe,
  Layers,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/services";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

const serviceIcons: Record<string, LucideIcon> = {
  layers: Layers,
  layout: LayoutTemplate,
  brain: Brain,
  globe: Globe,
};

/**
 * Services — the "What I Build" section.
 * Data in src/content/services.ts.
 */
export function Services() {
  return (
    <section id="services" aria-label="What I build" className="section-pad">
      <SectionBackdrop kind="aurora" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="services"
          title="What I Build"
          lede="The kinds of work I take on — and what 'done' means for each."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.icon] ?? Layers;
            return (
              <Reveal key={service.id} delay={i * 0.07}>
                <article className="card-shell group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 text-brand transition-transform duration-300 group-hover:scale-110">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-line/50 pt-4">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-xs text-ink/80"
                      >
                        <span
                          className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand2"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
