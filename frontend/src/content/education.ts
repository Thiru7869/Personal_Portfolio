import type { EducationItem } from "@shared/types";

/**
 * src/content/education.ts
 * ------------------------------------------------------------
 * Education history, newest first. Edit institutions, streams,
 * and descriptions here.
 */

export const education: EducationItem[] = [
  {
    id: "btech",
    institution: "Annamacharya Institute of Technology and Sciences",
    location: "Tirupati, Andhra Pradesh",
    degree: "Bachelor of Technology (B.Tech)",
    stream: "Computer Science and Engineering",
    duration: "2021 – 2025",
    description:
      "Core computer science with an aggregate of 70%, and a self-driven tilt toward backend engineering and machine learning. The final year project — deep learning for ECG-based cardiovascular disease detection — became a published paper in IJNRD (IJNRD2503033), and most lab hours went into building things the syllabus hadn't asked for yet.",
  },
  {
    id: "intermediate",
    institution: "Intermediate (10+2), Board of Intermediate Education AP",
    location: "Andhra Pradesh",
    degree: "Intermediate",
    stream: "Mathematics, Physics, Chemistry",
    duration: "2019 – 2021",
    description:
      "MPC stream with a focus on mathematics — the part of the syllabus that later made machine learning feel familiar instead of frightening. First real exposure to programming happened here, and it quietly changed everything.",
  },
];
