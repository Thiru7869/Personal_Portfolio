import type { SkillGroup } from "@shared/types";

/**
 * src/content/skills.ts
 * ------------------------------------------------------------
 * Skill groups rendered in the Skills section (filterable and
 * searchable). Each group links to its roadmap.sh learning
 * path; individual skills link to roadmap.sh where a roadmap
 * exists, otherwise Wikipedia.
 */

const wiki = (article: string) => `https://en.wikipedia.org/wiki/${article}`;
const roadmap = (path: string) => `https://roadmap.sh/${path}`;

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    roadmapUrl: roadmap("frontend"),
    label: "Frontend",
    icon: "layout",
    skills: [
      { name: "HTML5", wiki: wiki("HTML5"), level: "Advanced" },
      { name: "CSS3", wiki: wiki("CSS"), level: "Advanced" },
      { name: "JavaScript", wiki: roadmap("javascript"), level: "Advanced" },
      { name: "TypeScript", wiki: roadmap("typescript"), level: "Advanced" },
      { name: "React", wiki: roadmap("react"), level: "Advanced" },
      { name: "Next.js", wiki: roadmap("react"), level: "Advanced" },
      { name: "Tailwind CSS", wiki: wiki("Tailwind_CSS"), level: "Advanced" },
      { name: "Framer Motion", wiki: wiki("Motion_(software)"), level: "Proficient" },
      { name: "Responsive Design", wiki: wiki("Responsive_web_design"), level: "Advanced" },
    ],
  },
  {
    id: "backend",
    roadmapUrl: roadmap("backend"),
    label: "Backend",
    icon: "server",
    skills: [
      { name: "Python", wiki: roadmap("python"), level: "Advanced" },
      { name: "FastAPI", wiki: wiki("FastAPI"), level: "Advanced" },
      { name: "Node.js", wiki: roadmap("nodejs"), level: "Proficient" },
      { name: "Express.js", wiki: wiki("Express.js"), level: "Proficient" },
      { name: "REST APIs", wiki: wiki("REST"), level: "Advanced" },
      { name: "JWT Auth", wiki: wiki("JSON_Web_Token"), level: "Advanced" },
      { name: "API Integration", wiki: wiki("Web_API"), level: "Advanced" },
    ],
  },
  {
    id: "database",
    roadmapUrl: roadmap("sql"),
    label: "Databases",
    icon: "database",
    skills: [
      { name: "PostgreSQL", wiki: roadmap("postgresql-dba"), level: "Proficient" },
      { name: "MongoDB", wiki: roadmap("mongodb"), level: "Proficient" },
      { name: "MySQL", wiki: wiki("MySQL"), level: "Proficient" },
      { name: "Supabase", wiki: wiki("Supabase"), level: "Proficient" },
      { name: "Redis", wiki: wiki("Redis"), level: "Comfortable" },
      { name: "SQL", wiki: roadmap("sql"), level: "Proficient" },
    ],
  },
  {
    id: "ai",
    roadmapUrl: roadmap("ai-data-scientist"),
    label: "AI & Data Science",
    icon: "brain",
    skills: [
      { name: "Machine Learning", wiki: wiki("Machine_learning"), level: "Proficient" },
      { name: "Deep Learning", wiki: wiki("Deep_learning"), level: "Proficient" },
      { name: "TensorFlow", wiki: wiki("TensorFlow"), level: "Proficient" },
      { name: "scikit-learn", wiki: wiki("Scikit-learn"), level: "Proficient" },
      { name: "Pandas", wiki: wiki("Pandas_(software)"), level: "Proficient" },
      { name: "NumPy", wiki: wiki("NumPy"), level: "Proficient" },
      { name: "LLM Integration", wiki: wiki("Large_language_model"), level: "Proficient" },
      { name: "Signal Processing", wiki: wiki("Signal_processing"), level: "Comfortable" },
    ],
  },
  {
    id: "cloud-devops",
    roadmapUrl: roadmap("devops"),
    label: "Cloud & DevOps",
    icon: "cloud",
    skills: [
      { name: "Docker", wiki: roadmap("docker"), level: "Proficient" },
      { name: "CI/CD", wiki: wiki("CI/CD"), level: "Proficient" },
      { name: "GitHub Actions", wiki: wiki("GitHub"), level: "Proficient" },
      { name: "Vercel", wiki: wiki("Vercel"), level: "Advanced" },
      { name: "AWS", wiki: roadmap("aws"), level: "Learning" },
      { name: "Kubernetes", wiki: roadmap("kubernetes"), level: "Learning" },
      { name: "Terraform", wiki: wiki("Terraform_(software)"), level: "Learning" },
      { name: "Nginx", wiki: wiki("Nginx"), level: "Comfortable" },
    ],
  },
  {
    id: "linux",
    roadmapUrl: roadmap("linux"),
    label: "Linux & Security",
    icon: "terminal",
    skills: [
      { name: "Linux", wiki: roadmap("linux"), level: "Advanced" },
      { name: "Parrot OS", wiki: wiki("Parrot_OS"), level: "Advanced" },
      { name: "Bash", wiki: wiki("Bash_(Unix_shell)"), level: "Proficient" },
      { name: "Web Security", wiki: roadmap("cyber-security"), level: "Comfortable" },
      { name: "Networking Basics", wiki: wiki("Computer_network"), level: "Comfortable" },
    ],
  },
  {
    id: "tools",
    roadmapUrl: roadmap("git-github"),
    label: "Tools & Version Control",
    icon: "wrench",
    skills: [
      { name: "Git", wiki: roadmap("git-github"), level: "Advanced" },
      { name: "GitHub", wiki: wiki("GitHub"), level: "Advanced" },
      { name: "VS Code", wiki: wiki("Visual_Studio_Code"), level: "Advanced" },
      { name: "Postman", wiki: wiki("Postman_(software)"), level: "Proficient" },
      { name: "Figma", wiki: wiki("Figma"), level: "Comfortable" },
    ],
  },
  {
    id: "practices",
    roadmapUrl: roadmap("system-design"),
    label: "Practices & Soft Skills",
    icon: "code",
    skills: [
      { name: "UI/UX Design", wiki: wiki("User_experience_design"), level: "Proficient" },
      { name: "Performance Optimization", wiki: wiki("Web_performance"), level: "Proficient" },
      { name: "SEO", wiki: wiki("Search_engine_optimization"), level: "Proficient" },
      { name: "Accessibility", wiki: wiki("Web_accessibility"), level: "Proficient" },
      { name: "System Design", wiki: roadmap("system-design"), level: "Learning" },
      { name: "Technical Writing", wiki: wiki("Technical_writing"), level: "Proficient" },
      { name: "Problem Solving", wiki: wiki("Problem_solving"), level: "Advanced" },
    ],
  },
];
