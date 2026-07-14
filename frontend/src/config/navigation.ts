import type { SectionId } from "@shared/constants";

/**
 * src/config/navigation.ts
 * ------------------------------------------------------------
 * Navbar and footer navigation. Section links scroll on the
 * homepage; page links navigate to real routes (/blog, /qa).
 *
 * To add a section to the navbar, add its id here — the section
 * itself must exist in src/app/page.tsx with a matching id.
 */

export interface NavItem {
  label: string;
  /** Either a section id (scrolls) or a route starting with "/". */
  target: SectionId | `/${string}`;
}

/** Primary navbar (keep to ~7 items so it fits on laptop widths). */
export const navItems: NavItem[] = [
  { label: "Home", target: "home" },
  { label: "About", target: "about" },
  { label: "Projects", target: "projects" },
  { label: "Skills", target: "skills" },
  { label: "Experience", target: "experience" },
  { label: "Blogs", target: "/blog" },
  { label: "Contact", target: "contact" },
];

/** Footer quick links — a fuller map of the site. */
export const footerLinks: NavItem[] = [
  { label: "About", target: "about" },
  { label: "Terminal", target: "terminal" },
  { label: "Skills", target: "skills" },
  { label: "Projects", target: "projects" },
  { label: "Activity", target: "activity" },
  { label: "Experience", target: "experience" },
  { label: "Education", target: "education" },
  { label: "Research", target: "research" },
  { label: "Achievements", target: "certificates" },
  { label: "What I Build", target: "services" },
  { label: "Now", target: "now" },
  { label: "FAQ", target: "faq" },
  { label: "Insights", target: "insights" },
  { label: "All Projects", target: "/projects" },
  { label: "Blog", target: "/blog" },
  { label: "Q&A", target: "/qa" },
  { label: "Contact", target: "contact" },
];
