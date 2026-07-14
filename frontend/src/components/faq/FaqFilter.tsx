"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FaqFilter — search + category filtering over the
 * server-rendered FAQ list. Filters the DOM directly, so the
 * answers stay out of the JavaScript bundle entirely.
 */
export function FaqFilter({ categories }: { categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Deep links: /qa#question-id opens and scrolls to that entry.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el instanceof HTMLDetailsElement) {
      el.open = true;
      el.scrollIntoView({ block: "center" });
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      const items = document.querySelectorAll<HTMLElement>("[data-faq]");
      let shown = 0;

      items.forEach((item) => {
        const haystack = item.dataset.faq ?? "";
        const itemCategory = item.dataset.category ?? "";
        const matchesCategory = category === "All" || itemCategory === category;
        const matchesQuery =
          terms.length === 0 || terms.every((t) => haystack.includes(t));
        const show = matchesCategory && matchesQuery;
        item.hidden = !show;
        if (show) shown += 1;
      });

      // Hide category headings whose sections are fully filtered out.
      document.querySelectorAll<HTMLElement>("[data-faq-group]").forEach((group) => {
        const any = group.querySelector("[data-faq]:not([hidden])");
        group.hidden = !any;
      });

      setVisible(shown);
    }, 120);
    return () => clearTimeout(debounceRef.current);
  }, [query, category]);

  return (
    <div className="mb-8">
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
          placeholder="Search questions…"
          aria-label="Search questions"
          className="w-full rounded-xl border border-line bg-card py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
        />
      </div>
      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by category"
      >
        {["All", ...categories].map((c) => (
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
      <p className="mt-3 font-mono text-xs text-mute" aria-live="polite">
        {visible === null ? "" : `${visible} question${visible === 1 ? "" : "s"} shown`}
      </p>
    </div>
  );
}
