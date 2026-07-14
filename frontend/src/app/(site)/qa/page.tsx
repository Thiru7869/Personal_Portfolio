import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { faqCategories, faqs } from "@/content/faq";
import { FaqFilter } from "@/components/faq/FaqFilter";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Q&A",
  description:
    "Questions about my journey, learning approach, projects, and goals — answered in my own words. Searchable and categorized.",
  alternates: { canonical: "/qa" },
};

/**
 * Q&A — the official answers, server-rendered as native accordions
 * (SEO-complete, zero content in the JS bundle), with
 * client-side search and category filtering on top.
 * Content lives in src/content/faq/.
 */
export default function QaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 25).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer.replace(/[*_`#]/g, ""),
      },
    })),
  };

  return (
    <div className="section-shell pb-24 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-brand"
      >
        <ArrowLeft size={14} aria-hidden="true" /> back to portfolio
      </Link>

      <Reveal>
        <p className="mb-2 font-mono text-sm text-brand">~/qa</p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Questions &amp; Answers
        </h1>
        <p className="mt-3 max-w-2xl text-mute">
          {faqs.length} questions answered the way I&apos;d answer them across
          a table — technical depth, honest stories, zero rehearsed fluff.
          Search, filter, expand.
        </p>
      </Reveal>

      <div className="mt-10">
        <FaqFilter categories={faqCategories} />

        <div className="space-y-10">
          {faqCategories.map((category) => (
            <section key={category} data-faq-group aria-label={`${category} questions`}>
              <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-brand">
                {category}
              </h2>
              <div className="space-y-3">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <details
                      key={faq.id}
                      id={faq.id}
                      data-faq={`${faq.question} ${faq.answer} ${faq.keywords.join(" ")}`.toLowerCase()}
                      data-category={faq.category}
                      className="card-shell group open:border-brand/40"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <ChevronDown
                          size={16}
                          className="shrink-0 text-mute transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="prose-portfolio border-t border-line/50 px-5 pb-5 pt-4 !text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {faq.answer}
                        </ReactMarkdown>
                      </div>
                    </details>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
