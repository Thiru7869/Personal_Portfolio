import type { Certificate } from "@shared/types";

/**
 * src/content/certificates.ts
 * ------------------------------------------------------------
 * Certifications & documents. Each `url` is the Google Drive
 * link to the real document; `image` is the card artwork shown
 * in the gallery (drop scans into public/certificates/ to
 * replace).
 *
 * NOTE: the Drive links are real; the titles below describe
 * each document — rename them to match the actual certificates
 * if these labels drift from what each file contains.
 */

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Full-Stack Web Development Certification",
    issuer: "Certificate of Completion",
    date: "2024",
    image: "/certificates/cert-fullstack.svg",
    url: "https://drive.google.com/file/d/1iP5b445yiRZfVGiYdYpF0P_wijz0w6MO/view?usp=drive_link",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: "cert-2",
    title: "Python Programming Certification",
    issuer: "Certificate of Completion",
    date: "2024",
    image: "/certificates/cert-python.svg",
    url: "https://drive.google.com/file/d/19WdvbSVRPWxraDNGAhOvRTuGjENhXSal/view?usp=drive_link",
    skills: ["Python", "Problem Solving"],
  },
  {
    id: "cert-3",
    title: "Machine Learning & AI Certification",
    issuer: "Certificate of Completion",
    date: "2024",
    image: "/certificates/cert-aiml.svg",
    url: "https://drive.google.com/file/d/1kUEefdLXMTIaC4VPXOfUb-TYMT2sb6n1/view?usp=drive_link",
    skills: ["Machine Learning", "Deep Learning"],
  },
  {
    id: "cert-4",
    title: "Database & SQL Certification",
    issuer: "Certificate of Completion",
    date: "2025",
    image: "/certificates/cert-sql.svg",
    url: "https://drive.google.com/file/d/1BqOOnDnRaXrm2t3G7KZwz-K46UM3OWF1/view?usp=drive_link",
    skills: ["SQL", "Databases"],
  },
  {
    id: "cert-5",
    title: "Research Publication — IJNRD",
    issuer: "International Journal of Novel Research and Development",
    date: "2025",
    image: "/certificates/cert-research.svg",
    url: "https://drive.google.com/file/d/13hUoW4rOIw-QJR2S3GjrXxq_fNecRDtQ/view?usp=drive_link",
    skills: ["Deep Learning", "ECG Analysis", "Research"],
  },
];

/** Achievements shown alongside certifications. */
export const achievements = [
  {
    id: "paper",
    title: "Published a peer-reviewed research paper",
    detail:
      "Deep learning for ECG-based cardiovascular disease detection — IJNRD, 2025.",
  },
  {
    id: "fullstack",
    title: "Built and deployed full-stack apps end to end",
    detail:
      "Live projects with real backends — a role-based Library Management API, a Node/MongoDB portfolio, and a React user dashboard — all public on GitHub and deployed.",
  },
  {
    id: "leetcode",
    title: "Consistent problem-solving practice",
    detail: "Active on LeetCode — DSA patterns over memorised answers.",
  },
  {
    id: "portfolio",
    title: "Built this portfolio as a product",
    detail:
      "Five experience modes, terminal mode, AI assistant, CMS, and analytics — all on free tiers.",
  },
];
