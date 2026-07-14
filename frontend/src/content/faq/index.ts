import { questions } from "./questions";
import { FaqCategory, type FaqItem } from "./types";

export { FaqCategory, type FaqItem } from "./types";

/**
 * src/content/faq/index.ts
 * ------------------------------------------------------------
 * The official Q&A, ordered by popularity, with the helpers the
 * /qa page, homepage FAQ preview, and AI assistant use.
 *
 * To add a question: append it to questions.ts — categories,
 * search, and related links pick it up automatically.
 */

export const faqs: FaqItem[] = [...questions].sort(
  (a, b) => b.popularityScore - a.popularityScore
);

/** Categories that actually have entries. */
export const faqCategories: FaqCategory[] = [
  ...new Map(faqs.map((f) => [f.category, true])).keys(),
];

export const popularFaqs = faqs.slice(0, 5);

export function faqById(id: string): FaqItem | undefined {
  return faqs.find((f) => f.id === id);
}

/** Simple full-text search across question, answer, and keywords. */
export function searchFaqs(query: string): FaqItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return faqs;
  const terms = q.split(/\s+/);
  return faqs.filter((f) => {
    const haystack =
      `${f.question} ${f.answer} ${f.keywords.join(" ")} ${f.category}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
