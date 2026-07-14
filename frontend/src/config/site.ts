import type { SocialLink } from "@shared/types";

/**
 * src/config/site.ts
 * ------------------------------------------------------------
 * THE file to edit for personal details: name, tagline, contact
 * information, social links, resume URL, availability, and the
 * numbers shown in the hero. Every component reads from here —
 * change it once and it updates everywhere (hero, contact,
 * footer, terminal, AI assistant, SEO metadata).
 */

export const site = {
  name: "Poluru Thirumala Narasimha",
  shortName: "Thiru",
  /** Logo text — the ONLY place the name is shortened. */
  logo: "THIRU",
  roles: [
    "Full-Stack Developer",
    "Backend Developer",
    "DevOps & Cloud Learner",
  ],
  tagline:
    "I build software by building — clean APIs, working products, and the deployment pipelines underneath them.",
  location: "Bengaluru, India",
  hometown: "Venkatagiri, Andhra Pradesh",
  timezone: "Asia/Kolkata",

  /** Public site URL — used for SEO, sitemap, and Open Graph. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  email: "reddytn4@gmail.com",
  phone: "+91 93926 13828",
  whatsapp: "919392613828",

  /** Set to false to hide the availability badge in the hero. */
  available: true,
  availabilityText: "Open to full-time, internship & freelance",

  /** Resume — the official copy lives on Google Drive. */
  resumeUrl:
    "https://drive.google.com/file/d/1tf1CfdDaZpWJ4SvDiEV7sYd1Z4y-eBiY/view",

  /** "Book a Meeting" — Google Form. */
  meetingUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScjUyT1kVvd8RD08N6Z7FG5oGttqAQdCab0yMJQDvx-PstxTQ/viewform?usp=dialog",

  /** Google Maps embed for the contact section. */
  mapEmbedUrl:
    "https://www.google.com/maps?q=Venkatagiri,+Andhra+Pradesh,+India&output=embed",

  github: "https://github.com/Thiru7869",
  githubUsername: "Thiru7869",
  leetcodeUsername: "thiru7869",

  heroStats: [
    { value: "15+", label: "Projects built" },
    { value: "3+", label: "Years coding" },
    { value: "1", label: "Published paper" },
    { value: "5", label: "Certifications" },
  ],
} as const;

/**
 * Social links — shown in the hero, contact section, and footer.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Thiru7869",
    handle: "@Thiru7869",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/poluru-thirumala-narasimha-23775926b/",
    handle: "poluru-thirumala-narasimha",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    href: "https://x.com/Thiru06765700",
    handle: "@Thiru06765700",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/thiru7869/",
    handle: "thiru7869",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:reddytn4@gmail.com",
    handle: "reddytn4@gmail.com",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/919392613828",
    handle: "+91 93926 13828",
  },
  {
    id: "phone",
    label: "Phone",
    href: "tel:+919392613828",
    handle: "+91 93926 13828",
  },
];
