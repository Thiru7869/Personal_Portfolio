/**
 * src/content/profile.ts
 * ------------------------------------------------------------
 * The "About" story (verbatim from the owner's About file),
 * hero content, and the living now/learning/philosophy data.
 */

/** Rotating typed roles in the hero. */
export const heroTypingLines = [
  "Full-Stack Developer",
  "Backend Engineering",
  "Python · FastAPI · React",
  "DevOps & Cloud",
  "AI-Powered Applications",
];

/** Floating hero cards (home spec) — label + optional detail. */
export const heroCards = [
  { label: "Backend Developer", accent: true },
  { label: "Python" },
  { label: "FastAPI" },
  { label: "React" },
  { label: "DevOps" },
  { label: "AWS" },
  { label: "Docker" },
  { label: "Open to Opportunities", accent: true },
];

/**
 * About — the official text, verbatim. Do not reword here;
 * this is the owner's voice. Rendered in order.
 */
export const aboutParagraphs = [
  `I'm a Computer Science graduate who enjoys understanding how software works by building real projects and learning through practice. My interest in programming started with simple applications, and over time I explored backend development, full-stack web development, cloud technologies, and DevOps fundamentals. Every project has introduced a new challenge, whether it was designing APIs, working with databases, deploying applications, or improving code organization.`,

  `I believe that learning becomes more meaningful when concepts are applied to practical problems. Instead of focusing only on theory, I spend time building applications, experimenting with different tools, and understanding how individual components work together. This approach has helped me become comfortable with technologies such as Python, JavaScript, React, FastAPI, Node.js, Express.js, MongoDB, SQL, Docker, Git, and Linux. More recently, I have been exploring cloud platforms, CI/CD workflows, and containerized deployments to better understand modern software development practices.`,

  `While working as a Subject Matter Expert, I answered technical questions related to programming and data analysis. That experience strengthened my problem-solving approach and taught me the importance of explaining technical concepts in a clear and structured way. It also improved my ability to analyze problems carefully before arriving at a solution.`,

  `Outside of project development, I regularly read documentation, revisit previous work, and refine older projects whenever I discover better approaches. I find that rebuilding or improving existing applications often teaches more than starting something entirely new. Small improvements made consistently have helped me understand software development from different perspectives.`,

  `As I begin my professional career, my focus is on contributing to meaningful software while continuing to expand my technical knowledge. I am interested in backend engineering, cloud infrastructure, DevOps practices, and AI-powered applications. More importantly, I want to be part of an environment where I can learn from experienced engineers, collaborate with a team, and steadily grow by solving real-world problems. For me, software development is a continuous learning process, and every project is another opportunity to build something useful while becoming a better engineer.`,
];

/** How the About section groups the paragraphs (indices above). */
export const aboutSections = [
  { title: "Journey", paragraphs: [0, 1] },
  { title: "Work Style", paragraphs: [2, 3] },
  { title: "Where I'm Headed", paragraphs: [4] },
] as const;

/** Short bio used in SEO descriptions and the AI assistant. */
export const shortBio =
  "Poluru Thirumala Narasimha (Thiru) is a Computer Science graduate and full-stack developer from Venkatagiri, Andhra Pradesh, based in Bengaluru. He builds real projects with Python, FastAPI, React, Node.js, and Docker, co-authored a published deep learning research paper (IJNRD), and is focused on backend engineering, cloud infrastructure, DevOps practices, and AI-powered applications.";

/** "Now" strip — what I'm doing at the moment. Update monthly. */
export const nowItems = [
  "Refining this portfolio into a real product",
  "Interview preparation — DSA practice and system design basics",
  "Deepening Docker, CI/CD, and containerized deployments",
  "Exploring cloud platforms hands-on",
];

/** Currently learning + roadmap. */
export const learningNow = [
  "Cloud platforms (AWS)",
  "CI/CD workflows",
  "Kubernetes basics",
  "System design",
];

export const roadmap = [
  { period: "Now", goal: "Land a full-time role and ship production features" },
  { period: "6 months", goal: "Own deployments end to end — Docker, CI/CD, monitoring" },
  { period: "1 year", goal: "Comfortable with cloud infrastructure at production scale" },
  { period: "3 years", goal: "The engineer teams hand the hard, ambiguous problems to" },
];

/** Uses — the actual setup. */
export const uses = [
  { category: "OS", items: "Parrot OS (daily driver), Windows 11 for testing" },
  { category: "Editor", items: "VS Code — with more extensions than I'll admit" },
  { category: "Terminal", items: "Bash + a heavily aliased .bashrc" },
  { category: "Stack of choice", items: "Python · FastAPI · React · Node.js · PostgreSQL · Docker" },
  { category: "Tools", items: "Git, Postman, Docker, Figma" },
  { category: "Fuel", items: "Filter coffee and lo-fi playlists" },
];

/** Developer philosophy — short and honest. */
export const philosophy = [
  "Make it work, make it right, then make it fast — in that order.",
  "Rebuilding an old project teaches more than starting a new one.",
  "Readable code is a feature; cleverness is usually debt.",
  "If it isn't deployed, it doesn't exist.",
  "Small improvements made consistently beat big rewrites.",
];

/** Things I enjoy building — for the About section. */
export const enjoyBuilding = [
  "REST APIs with clean validation and honest error handling",
  "Full-stack applications from schema to deployed URL",
  "Deployment pipelines that make shipping boring",
  "AI-assisted tools grounded in real data",
  "Small utilities that remove daily friction",
];
