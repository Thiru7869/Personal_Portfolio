"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search, Star } from "lucide-react";
import type { ArticleCard } from "@/content/blog";
import { cn, formatDate } from "@/lib/utils";

/**
 * BlogExplorer — client-side search + category filtering over
 * lightweight article cards (bodies never enter this bundle).
 */
export function BlogExplorer({
  cards,
  covers,
}: {
  cards: ArticleCard[];
  covers: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...new Set(cards.map((c) => c.category))],
    [cards]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((card) => {
      if (category !== "All" && card.category !== category) return false;
      if (!q) return true;
      const haystack =
        `${card.title} ${card.description} ${card.tags.join(" ")} ${card.keywords.join(" ")} ${card.category}`.toLowerCase();
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
  }, [cards, query, category]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${cards.length} articles…`}
            aria-label="Search articles"
            className="w-full rounded-xl border border-line bg-card py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "chip transition-colors",
                category === c
                  ? "!border-brand/60 !bg-brand/10 !text-brand"
                  : "hover:border-brand/40 hover:text-ink"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="mb-4 font-mono text-xs text-mute" aria-live="polite">
        {filtered.length} article{filtered.length === 1 ? "" : "s"}
        {query && ` matching “${query}”`}
      </p>

      {filtered.length === 0 ? (
        <div className="card-shell p-10 text-center">
          <p className="font-mono text-sm text-mute">
            No matches. Try “react”, “fastapi”, “docker”, or “career”.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((card) => (
            <Link
              key={card.slug}
              href={`/blog/${card.slug}`}
              className="card-shell group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand/50"
            >
              <div className="relative aspect-[1200/630] border-b border-line/50 bg-surface">
                <Image
                  src={covers[card.slug]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
                {card.featured && (
                  <span className="chip absolute left-3 top-3 !border-brand/50 !bg-bg/85 !text-brand">
                    <Star size={10} aria-hidden="true" /> Featured
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-mute">
                  <span className="font-medium text-brand">{card.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(card.publishDate)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" />
                    {card.readingTime} min
                  </span>
                </div>
                <h2 className="mt-2 font-display text-base font-semibold leading-snug group-hover:text-brand">
                  {card.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">
                  {card.description}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {card.tags.slice(0, 3).map((tag) => (
                    <li key={tag} className="chip !py-0.5 text-[10px]">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
