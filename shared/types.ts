/**
 * shared/types.ts
 * ------------------------------------------------------------
 * Single source of truth for the content model. Both the
 * frontend (components, content files) and backend concerns
 * (API payloads, Supabase rows) build on these shapes.
 *
 * If you add a new field to a section (for example a new field
 * on projects), add it here first, then fill it in the matching
 * file under frontend/src/content/.
 */

/** Experience modes — each transforms the whole site. */
export type ModeId =
  | "professional"
  | "terminal"
  | "ai"
  | "developer"
  | "executive";

/** Light/dark rendering of the active mode. */
export type Appearance = "light" | "dark";

export interface ModeDefinition {
  id: ModeId;
  label: string;
  /** One-line description shown in the mode switcher. */
  tagline: string;
  /** Icon key rendered in the switcher. */
  icon: string;
  /** True when the mode replaces the site with its own shell. */
  takeover: boolean;
}

export interface SocialLink {
  id:
    | "github"
    | "linkedin"
    | "twitter"
    | "leetcode"
    | "email"
    | "whatsapp"
    | "phone";
  label: string;
  href: string;
  /** Shown next to the icon where space allows. */
  handle: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  challenges: string[];
  learnings: string[];
  architecture: string;
  techStack: string[];
  features: string[];
  github?: string;
  liveDemo?: string;
  caseStudy?: string;
  featured: boolean;
  year: number;
  /** Accent emoji/icon key rendered on the card. */
  icon: string;
}

/** Smaller GitHub repos listed under the main project grid. */
export interface MiniProject {
  name: string;
  description: string;
  github: string;
  live?: string;
  tech: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  start: string;
  end: string;
  type: "Internship" | "Freelance" | "Full-time" | "Part-time";
  summary: string;
  responsibilities: string[];
  achievements: string[];
  tech: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  stream: string;
  duration: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  icon: string;
  /** roadmap.sh learning path opened when the group is clicked. */
  roadmapUrl?: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** Wikipedia article for the technology. */
  wiki: string;
  level: "Advanced" | "Proficient" | "Comfortable" | "Learning";
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown body, 200–250 words. */
  body: string;
  date: string;
  readMinutes: number;
  tags: string[];
}

export interface QAItem {
  slug: string;
  question: string;
  /** Markdown answer, 200–250 words. */
  answer: string;
  category: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  /** Image URL (Cloudinary or /public). */
  image: string;
  /** Optional downloadable file/verification URL. */
  url?: string;
  skills: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  /**
   * True for illustrative/placeholder entries that are NOT from a
   * real, named person. The Testimonials section never displays
   * placeholders — set this to false once you have a genuine,
   * attributable quote.
   */
  placeholder?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: string[];
}

export interface ResearchPaper {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  status: string;
  abstract: string;
  contributions: string[];
  keywords: string[];
  downloadUrl: string;
  doi?: string;
  citation: string;
}

/* ---------- API payloads ---------- */

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty; bots fill it. */
  company?: string;
}

export interface RatingPayload {
  score: number; // 1–5
  feedback?: string;
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  /** Most recent one-line review comments — anonymous (the
   *  ratings table stores no name/identity), newest first. */
  recentComments: { score: 1 | 2 | 3 | 4 | 5; feedback: string }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}
