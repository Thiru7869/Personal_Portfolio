/**
 * src/content/blog/types.ts
 * ------------------------------------------------------------
 * The blog content model. Articles are authored in
 * articles-01.ts … articles-06.ts as `ArticleSource` objects;
 * index.ts enriches them into full `BlogArticle`s by computing
 * everything that can be derived (reading time, table of
 * contents, cover art, canonical slug, author block) — so no
 * field is ever duplicated or stale.
 */

export enum BlogCategory {
  React = "React",
  NextJS = "Next.js",
  TypeScript = "TypeScript",
  JavaScript = "JavaScript",
  CSS = "CSS & Design",
  Backend = "Backend",
  FastAPI = "FastAPI",
  Databases = "Databases",
  DevOps = "DevOps & Docker",
  Linux = "Linux",
  AI = "AI & Research",
  Performance = "Performance & SEO",
  Career = "Career",
  Journey = "Developer Journey",
  Projects = "Project Breakdowns",
}

export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export const BLOG_AUTHOR = {
  author: "Thirumala Narasimha Poluru",
  authorRole: "Full-Stack Developer",
} as const;

/** What an article author actually writes. */
export interface ArticleSource {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** 1–2 sentence card/list description. */
  description: string;
  category: BlogCategory;
  tags: string[];
  publishDate: string; // YYYY-MM-DD
  updatedDate?: string; // YYYY-MM-DD
  featured: boolean;
  difficulty: Difficulty;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** Markdown. `##` headings become the table of contents. */
  articleBody: string;
  /** Optional closing section (rendered only when present). */
  conclusion?: string;
  /** Optional takeaway list (rendered only when present). */
  keyTakeaways?: string[];
  relatedPosts: string[]; // slugs
  references?: { label: string; url: string }[];
  callToAction?: string;
}

export interface TocEntry {
  id: string;
  text: string;
}

/** The enriched article the site renders. */
export interface BlogArticle extends ArticleSource {
  canonicalSlug: string;
  readingTime: number; // minutes
  wordCount: number;
  tableOfContents: TocEntry[];
  featuredImage: string;
  coverImageAlt: string;
  author: string;
  authorRole: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

/** GitHub-style slug for a heading (used for TOC anchors). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
