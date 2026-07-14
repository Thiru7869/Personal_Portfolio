import type { ServiceItem } from "@shared/types";

/**
 * src/content/services.ts
 * ------------------------------------------------------------
 * The "What I Build" section — the kinds of work I take on.
 * Edit titles, descriptions, and bullet points here.
 */

export const services: ServiceItem[] = [
  {
    id: "web-apps",
    title: "Full-Stack Web Applications",
    description:
      "Complete products from database schema to polished UI — Next.js and TypeScript up front, FastAPI or Node.js behind, PostgreSQL or MongoDB underneath, deployed and monitored on Vercel.",
    icon: "layers",
    points: [
      "Authentication, payments, dashboards",
      "Type-safe APIs end to end",
      "Production deployment included",
    ],
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    description:
      "Interfaces that feel fast and considered — responsive, accessible, animated with restraint, and scoring 95+ on Lighthouse.",
    icon: "layout",
    points: [
      "Design-system driven UI",
      "WCAG AA accessibility",
      "Motion that respects the user",
    ],
  },
  {
    id: "ai-features",
    title: "AI-Powered Features",
    description:
      "Practical AI integrations — chat assistants, RAG over your documents, and classification pipelines — grounded, rate-limited, and cost-aware.",
    icon: "brain",
    points: [
      "RAG with citation-grounded answers",
      "Multi-provider fallback chains",
      "Free-tier friendly architecture",
    ],
  },
  {
    id: "sites",
    title: "Business Websites",
    description:
      "Fast, SEO-ready sites for real businesses — the kind that load instantly on a phone and turn visitors into enquiries.",
    icon: "globe",
    points: [
      "SEO and analytics from day one",
      "Contact and WhatsApp integration",
      "Easy content updates",
    ],
  },
];
