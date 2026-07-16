import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { faqs, popularFaqs } from "@/content/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * FaqPreview — the most popular questions inline on the
 * homepage, linking to the full /qa page.
 */
const PREVIEW_COUNT = 5;

export function FaqPreview() {
  const shown = Math.min(PREVIEW_COUNT, popularFaqs.length);
  const remaining = Math.max(0, faqs.length - shown);

  return (
    <section id="faq" aria-label="Frequently asked questions" className="section-pad">
      <SectionBackdrop kind="dotted" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="faq"
          title="FAQ"
          lede={
            remaining > 0
              ? `The top ${shown}, answered honestly — ${remaining} more on the Q&A page.`
              : "Answered honestly, in my own words."
          }
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {popularFaqs.slice(0, PREVIEW_COUNT).map((faq, i) => (
            <Reveal key={faq.id} delay={i * 0.05}>
              <details className="card-shell group open:border-brand/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-mute transition-transform duration-300 ease-out group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="prose-portfolio border-t border-line/50 px-5 pb-5 pt-4 !text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {faq.answer}
                  </ReactMarkdown>
                </div>
              </details>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <Link
              href="/qa"
              className="card-shell group flex items-center justify-between p-5 text-sm font-semibold"
            >
              <span>
                Browse all {faqs.length} questions — technical, career,
                projects, research
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
