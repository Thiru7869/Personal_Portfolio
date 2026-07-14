import { describe, it, expect } from "vitest";
import {
  blogArticles,
  articleBySlug,
  relatedArticles,
  adjacentArticles,
} from "./index";
import { headingId } from "./types";

describe("headingId", () => {
  it("slugifies a heading for anchor links", () => {
    expect(headingId("The Mental Model")).toBe("the-mental-model");
  });
  it("strips punctuation and collapses spaces", () => {
    expect(headingId("Why REST? (a note)")).toBe("why-rest-a-note");
  });
});

describe("blog derivation", () => {
  it("derives a positive reading time for every article", () => {
    for (const a of blogArticles) {
      expect(a.readingTime).toBeGreaterThanOrEqual(1);
      expect(a.wordCount).toBeGreaterThan(0);
    }
  });

  it("assigns a cover image and author to every article", () => {
    for (const a of blogArticles) {
      expect(a.featuredImage).toMatch(/\.svg$/);
      expect(a.author).toBeTruthy();
      expect(a.canonicalSlug).toBe(a.slug);
    }
  });

  it("sorts articles newest-first", () => {
    for (let i = 1; i < blogArticles.length; i++) {
      expect(
        blogArticles[i - 1].publishDate >= blogArticles[i].publishDate
      ).toBe(true);
    }
  });

  it("has unique slugs (no duplicate routes)", () => {
    const slugs = blogArticles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("relatedArticles / adjacentArticles", () => {
  it("never returns the article itself as related", () => {
    const a = blogArticles[0];
    const related = relatedArticles(a);
    expect(related.every((r) => r.slug !== a.slug)).toBe(true);
  });

  it("returns at most the requested count", () => {
    expect(relatedArticles(blogArticles[0], 2).length).toBeLessThanOrEqual(2);
  });

  it("gives the newest article no 'newer' neighbour", () => {
    const first = blogArticles[0];
    expect(adjacentArticles(first.slug).newer).toBeNull();
  });

  it("resolves a known slug", () => {
    const a = blogArticles[0];
    expect(articleBySlug(a.slug)?.slug).toBe(a.slug);
    expect(articleBySlug("does-not-exist")).toBeUndefined();
  });
});
