import { MessageSquareQuote, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { genuineTestimonials } from "@/content/testimonials";
import { site } from "@/config/site";

/**
 * Testimonials — shows only GENUINE, attributable quotes
 * (placeholders are filtered out in the content layer). Until a
 * real quote exists, it renders an honest "references on
 * request" card rather than inventing people.
 */
export function Testimonials() {
  const hasReal = genuineTestimonials.length > 0;

  return (
    <section id="testimonials" aria-label="Testimonials" className="section-pad">
      <SectionBackdrop kind="waves" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="testimonials"
          title="What People Say"
          lede={
            hasReal
              ? "From the people I've actually worked with."
              : "I'd rather show real quotes than invent them — references are available on request."
          }
        />

        {hasReal ? (
          <div className="grid gap-5 md:grid-cols-3">
            {genuineTestimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <figure className="card-shell flex h-full flex-col p-6 transition-all duration-300 hover:border-brand/40">
                  <Quote size={20} className="mb-4 text-brand" aria-hidden="true" />
                  <blockquote className="flex-1 text-sm leading-relaxed text-ink/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line/50 pt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-mute">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="card-shell mx-auto max-w-xl p-7 text-center sm:p-9">
              <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/12 text-brand">
                <MessageSquareQuote size={20} aria-hidden="true" />
              </span>
              <p className="text-sm leading-relaxed text-mute">
                I keep this section honest: it stays empty until I have a real
                quote from someone I&apos;ve worked with, rather than filling it
                with invented praise. Want a reference? Reach me at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-brand hover:underline"
                >
                  {site.email}
                </a>
                .
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
