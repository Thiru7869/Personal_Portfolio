/**
 * src/content/faq/types.ts
 * ------------------------------------------------------------
 * FAQ content model. Entries are authored in faq-personal.ts,
 * faq-frontend.ts, and faq-backend.ts; index.ts merges them and
 * exposes search/category helpers.
 */

export enum FaqCategory {
  AboutMe = "About Me",
  Education = "Education",
  Skills = "Skills",
  Frontend = "Frontend",
  Backend = "Backend",
  React = "React",
  NextJS = "Next.js",
  JavaScript = "JavaScript",
  TypeScript = "TypeScript",
  Python = "Python",
  FastAPI = "FastAPI",
  Databases = "Databases",
  Docker = "Docker",
  Git = "Git",
  DevOps = "DevOps",
  Cloud = "Cloud",
  Linux = "Linux",
  Portfolio = "Portfolio",
  Projects = "Projects",
  Research = "Research",
  Experience = "Experience",
  Career = "Career",
  Freelancing = "Freelancing",
  Services = "Services",
  AI = "AI",
  Deployment = "Deployment",
  Contact = "Contact",
}

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  /** Conversational answer, roughly 80–200 words. Markdown allowed. */
  answer: string;
  keywords: string[];
  /** ids of related entries. */
  relatedQuestions: string[];
  /** 1–100; drives default ordering and "popular" lists. */
  popularityScore: number;
}
