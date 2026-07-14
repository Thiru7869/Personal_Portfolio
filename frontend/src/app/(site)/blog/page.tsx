import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Layers, ListOrdered } from "lucide-react";
import {
  articleCards,
  blogArticles,
  readingCollections,
  readingSeries,
} from "@/content/blog";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { Reveal } from "@/components/ui/Reveal";
import { AbstractMesh } from "@/components/illustrations/AbstractMesh";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on full-stack development, Docker, REST APIs, Git, cloud, and continuous learning — written by Poluru Thirumala Narasimha.",
  alternates: { canonical: "/blog" },
};

/**
 * Blog index — searchable, filterable explorer over all
 * articles, plus curated collections and reading series.
 * Content lives in src/content/blog/.
 */
export default function BlogIndexPage() {
  const covers = Object.fromEntries(
    blogArticles.map((a) => [a.slug, a.featuredImage])
  );

  return (
    <div className="section-shell pb-24 pt-28">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-brand"
      >
        <ArrowLeft size={14} aria-hidden="true" /> back to portfolio
      </Link>

      <Reveal>
        <div className="relative overflow-hidden rounded-2xl">
          <AbstractMesh
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
            id="blog-header"
          />
          <div className="relative py-2">
            <p className="mb-2 font-mono text-sm text-brand">~/blog</p>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Notes from the workshop
            </h1>
            <p className="mt-3 max-w-2xl text-mute">
              {blogArticles.length} articles on things I actually built, broke, and
              learned from — React, FastAPI, deployment, research, and the career
              underneath it all. No filler, no listicles.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Collections + series */}
      <Reveal delay={0.08}>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="card-shell p-6">
            <h2 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute">
              <Layers size={13} className="text-brand" aria-hidden="true" />
              Reading collections
            </h2>
            <ul className="flex flex-wrap gap-2">
              {readingCollections.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/blog/${c.slugs[0]}`}
                    title={c.description}
                    className="chip transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    {c.title} · {c.slugs.length}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-shell p-6">
            <h2 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute">
              <ListOrdered size={13} className="text-brand2" aria-hidden="true" />
              Reading series (in order)
            </h2>
            <ul className="space-y-2">
              {readingSeries.map((s) => (
                <li key={s.id} className="text-sm">
                  <Link
                    href={`/blog/${s.slugs[0]}`}
                    className="font-medium text-ink transition-colors hover:text-brand"
                  >
                    {s.title}
                  </Link>
                  <span className="ml-2 text-xs text-mute">
                    {s.slugs.length} parts — {s.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mt-10">
        <BlogExplorer cards={articleCards} covers={covers} />
      </div>
    </div>
  );
}
