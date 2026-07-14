import type { ExperienceItem } from "@shared/types";

/**
 * src/content/experience.ts
 * ------------------------------------------------------------
 * Work experience, newest first. The timeline section, terminal
 * `experience` command, and AI assistant all render from this
 * list. Add new roles at the top.
 */

export const experience: ExperienceItem[] = [
  {
    id: "freelance",
    role: "Freelance Full-Stack Developer",
    company: "Self-employed",
    location: "Remote / Bengaluru",
    start: "2024",
    end: "Present",
    type: "Freelance",
    summary:
      "Building web applications end to end for small clients and personal products — including a role-based Library Management API, full-stack portfolios, and a React user-management dashboard — handling everything from requirements to deployment.",
    responsibilities: [
      "Scope requirements with non-technical clients and turn them into buildable plans",
      "Build responsive frontends in React/Next.js and APIs in FastAPI or Node.js",
      "Design database schemas in PostgreSQL and MongoDB with sensible auth",
      "Deploy on Vercel and free-tier infrastructure with monitoring and analytics",
    ],
    achievements: [
      "Shipped multiple full-stack apps solo — including a role-based REST API with JWT auth — all public on GitHub and deployed",
      "Every delivered site scores 90+ on Lighthouse performance and SEO",
      "Built and deployed this portfolio — CMS, AI assistant, and analytics included",
    ],
    tech: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "MongoDB", "Vercel"],
  },
  {
    id: "sme",
    role: "Subject Matter Expert — Programming & Data Analysis",
    company: "Online learning platform",
    location: "Remote",
    start: "2023",
    end: "2024",
    type: "Part-time",
    summary:
      "Answered technical questions related to programming and data analysis — an experience that strengthened my problem-solving approach and taught me to explain technical concepts in a clear, structured way.",
    responsibilities: [
      "Answer student questions on programming and data analysis with worked solutions",
      "Break down problems carefully before arriving at a solution",
      "Explain technical concepts in clear, structured, step-by-step language",
      "Maintain accuracy and quality standards across submissions",
    ],
    achievements: [
      "Sharpened the analyze-first habit that now shapes how I debug and design",
      "Learned to write explanations that teach, not just answers that work",
      "Built breadth across programming and data-analysis topics under real review",
    ],
    tech: ["Python", "SQL", "Data Analysis", "Problem Solving"],
  },
  {
    id: "research",
    role: "Undergraduate Researcher — Deep Learning",
    company: "Annamacharya Institute of Technology and Sciences",
    location: "Tirupati, Andhra Pradesh",
    start: "2024",
    end: "2025",
    type: "Part-time",
    summary:
      "Co-authored a published research paper on ECG-based cardiovascular disease detection using deep learning — from dataset preparation and model training through peer review.",
    responsibilities: [
      "Preprocess and augment ECG signal datasets for training and evaluation",
      "Train and compare CNN and recurrent architectures in Python/TensorFlow",
      "Design evaluation protocols that survive class imbalance and noisy signals",
      "Write, revise, and defend the manuscript through the review process",
    ],
    achievements: [
      "Paper published in the International Journal of Novel Research and Development (IJNRD)",
      "Built the full training pipeline — preprocessing, augmentation, evaluation — from scratch",
      "Learned to defend every reported number, a habit that now shapes all my engineering",
    ],
    tech: ["Python", "TensorFlow", "NumPy", "Pandas", "scikit-learn"],
  },
  {
    id: "projects-lab",
    role: "Self-Directed Developer",
    company: "Personal projects & coursework",
    location: "Tirupati / Bengaluru",
    start: "2022",
    end: "2024",
    type: "Part-time",
    summary:
      "The unofficial apprenticeship: two years of deliberately building progressively harder projects — static sites, then APIs, then full products — while keeping up with coursework.",
    responsibilities: [
      "Learn by shipping: every new concept had to end up in a working project",
      "Rebuild the same ideas with better tools to feel the difference (vanilla JS → React → Next.js)",
      "Practice DSA consistently on LeetCode alongside project work",
      "Live in Linux (Parrot OS) to make the command line a first language",
    ],
    achievements: [
      "Went from copying tutorials to designing systems — schema-first, API-second, UI-last",
      "Built the ECG detection app that grew into the published research",
      "Accumulated the 15+ projects that this portfolio curates down from",
    ],
    tech: ["JavaScript", "React", "Python", "Git", "Linux"],
  },
];
