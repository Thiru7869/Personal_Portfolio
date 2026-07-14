import { describe, it, expect } from "vitest";
import { faqs, searchFaqs, faqCategories, popularFaqs } from "./index";

describe("faq data integrity", () => {
  it("has unique ids", () => {
    const ids = faqs.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is ordered by popularity (desc)", () => {
    for (let i = 1; i < faqs.length; i++) {
      expect(faqs[i - 1].popularityScore >= faqs[i].popularityScore).toBe(true);
    }
  });

  it("exposes only categories that have entries", () => {
    for (const c of faqCategories) {
      expect(faqs.some((f) => f.category === c)).toBe(true);
    }
  });

  it("caps the popular preview at five", () => {
    expect(popularFaqs.length).toBeLessThanOrEqual(5);
  });
});

describe("searchFaqs", () => {
  it("returns everything for an empty query", () => {
    expect(searchFaqs("").length).toBe(faqs.length);
  });

  it("matches across question, answer, and keywords", () => {
    const results = searchFaqs("learn");
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((f) =>
        `${f.question} ${f.answer} ${f.keywords.join(" ")}`
          .toLowerCase()
          .includes("learn")
      )
    ).toBe(true);
  });

  it("requires every term to match (AND semantics)", () => {
    const results = searchFaqs("zzz-nonexistent-term learn");
    expect(results.length).toBe(0);
  });
});
