import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Lightbulb, ListOrdered } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  adjacentArticles,
  articleBySlug,
  blogArticles,
  readingSeries,
  relatedArticles,
} from "@/content/blog";
import { FloatingBack } from "@/components/layout/FloatingBack";
import { headingId } from "@/content/blog/types";
import { site } from "@/config/site";
import { formatDate } from "@/lib/utils";
import { ShareRow } from "@/components/blog/ShareRow";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: article.keywords,
    alternates: { canonical: `/blog/${article.canonicalSlug}` },
    openGraph: {
      type: "article",
      title: article.ogTitle,
      description: article.ogDescription,
      publishedTime: article.publishDate,
      modifiedTime: article.updatedDate,
      authors: [article.author],
      url: `${site.url}/blog/${article.slug}`,
      images: [{ url: article.featuredImage, alt: article.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.twitterTitle,
      description: article.twitterDescription,
    },
  };
}

/**
 * Article page — cover, table of contents, markdown body with
 * anchored headings, takeaways, references, share, series
 * navigation, author block, and related reading.
 */
export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const related = relatedArticles(article);
  const { newer, older } = adjacentArticles(article.slug);
  const series = readingSeries.find((s) => s.slugs.includes(article.slug));
  const seriesIndex = series ? series.slugs.indexOf(article.slug) : -1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.updatedDate ?? article.publishDate,
    author: { "@type": "Person", name: article.author, url: site.url },
    image: `${site.url}${article.featuredImage}`,
    keywords: article.keywords.join(", "),
    wordCount: article.wordCount,
    mainEntityOfPage: `${site.url}/blog/${article.slug}`,
  };

  return (
    <div className="section-shell pb-24 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FloatingBack href="/blog" label="All articles" />
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-brand"
      >
        <ArrowLeft size={14} aria-hidden="true" /> all articles
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0 max-w-3xl">
          <header>
            <div className="flex flex-wrap items-center gap-2 text-xs text-mute">
              <span className="chip !border-brand/40 !text-brand">{article.category}</span>
              <span className="chip">{article.difficulty}</span>
              <time dateTime={article.publishDate}>{formatDate(article.publishDate)}</time>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} aria-hidden="true" /> {article.readingTime} min read
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-lg text-mute">{article.subtitle}</p>
          </header>

          <div className="relative mt-7 aspect-[1200/630] overflow-hidden rounded-2xl border border-line/60">
            <Image
              src={article.featuredImage}
              alt={article.coverImageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
              unoptimized
            />
          </div>

          {series && (
            <p className="card-shell mt-6 flex items-center gap-2 p-4 text-sm">
              <ListOrdered size={15} className="shrink-0 text-brand2" aria-hidden="true" />
              <span>
                Part {seriesIndex + 1} of {series.slugs.length} in{" "}
                <strong className="text-ink">{series.title}</strong>
              </span>
            </p>
          )}

          <div className="prose-portfolio mt-8 !text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 id={headingId(String(children))}>{children}</h2>
                ),
              }}
            >
              {article.articleBody}
            </ReactMarkdown>

            {article.conclusion && (
              <>
                <h2 id="conclusion">Wrapping up</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.conclusion}
                </ReactMarkdown>
              </>
            )}
          </div>

          {/* Key takeaways */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="card-shell mt-10 p-6">
              <h2 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand">
                <Lightbulb size={14} aria-hidden="true" /> Key takeaways
              </h2>
              <ul className="space-y-2 text-sm text-ink/90">
                {article.keyTakeaways.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.references && article.references.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-mute">
                references
              </h2>
              <ul className="space-y-1 text-sm">
                {article.references.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand2 underline underline-offset-2"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 border-t border-line/60 pt-6">
            <ShareRow title={article.title} url={`${site.url}/blog/${article.slug}`} />
          </div>

          {/* Previous / next article */}
          {(older || newer) && (
            <nav aria-label="Adjacent articles" className="mt-6 grid gap-3 sm:grid-cols-2">
              {older ? (
                <Link
                  href={`/blog/${older.slug}`}
                  className="card-shell group p-4 transition-colors hover:border-brand/50"
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-mute">
                    ← previous
                  </span>
                  <span className="mt-1 block text-sm font-medium leading-snug group-hover:text-brand">
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {newer && (
                <Link
                  href={`/blog/${newer.slug}`}
                  className="card-shell group p-4 text-right transition-colors hover:border-brand/50"
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-mute">
                    next →
                  </span>
                  <span className="mt-1 block text-sm font-medium leading-snug group-hover:text-brand">
                    {newer.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {/* Author */}
          <div className="card-shell mt-8 flex items-start gap-4 p-6">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/12 font-display text-lg font-bold text-brand"
              aria-hidden="true"
            >
              T
            </span>
            <div>
              <p className="text-sm font-semibold">{article.author}</p>
              <p className="text-xs text-mute">{article.authorRole}</p>
              <p className="mt-2 text-sm text-mute">
                Full-stack developer from Venkatagiri, based in Bengaluru.
                Published deep learning researcher (IJNRD), Parrot OS daily
                driver, and open to full-time, internship, and freelance work.
              </p>
              {article.callToAction && (
                <p className="mt-2 text-sm font-medium text-brand">{article.callToAction}</p>
              )}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {article.tableOfContents.length > 0 && (
              <nav aria-label="Table of contents" className="card-shell p-5">
                <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">
                  on this page
                </h2>
                <ul className="space-y-2 text-sm">
                  {article.tableOfContents.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className="block text-mute transition-colors hover:text-brand"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                  {article.conclusion && (
                    <li>
                      <a href="#conclusion" className="block text-mute transition-colors hover:text-brand">
                        Wrapping up
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            )}

            {related.length > 0 && (
              <div className="card-shell p-5">
                <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">
                  related reading
                </h2>
                <ul className="space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/blog/${r.slug}`}
                        className="group block text-sm"
                      >
                        <span className="font-medium leading-snug text-ink group-hover:text-brand">
                          {r.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-mute">
                          {r.category} · {r.readingTime} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile related */}
      {related.length > 0 && (
        <nav aria-label="Related articles" className="mt-12 lg:hidden">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">
            related reading
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="card-shell group p-4 text-sm transition-colors hover:border-brand/50"
              >
                <span className="font-medium leading-snug group-hover:text-brand">
                  {r.title}
                </span>
                <span className="mt-1 block text-xs text-mute">
                  {r.category} · {r.readingTime} min
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
