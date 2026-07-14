import { FaqCategory, type FaqItem } from "./types";

/**
 * src/content/faq/questions.ts
 * ------------------------------------------------------------
 * The official Q&A, verbatim from the owner's Q&A file.
 * Answers are NOT to be reworded — only surrounding metadata
 * (categories, keywords, ordering) is editorial.
 *
 * To add a question: append an entry here. The /qa page,
 * search, homepage preview, and AI assistant update
 * automatically.
 */
export const questions: FaqItem[] = [
  {
    id: "what-motivated-you-to-choose-software-development",
    category: FaqCategory.Career,
    question: "What motivated you to choose software development?",
    answer: `Technology always felt practical because every new concept could be turned into something useful. Writing code that solves a real problem gave me a different perspective on learning. Instead of only understanding theory, I preferred building projects and seeing ideas become working applications. That process kept pushing me to improve my skills.`,
    keywords: ["motivation", "career choice", "why software"],
    relatedQuestions: ["what-are-your-goals-as-a-software-engineer", "why-do-you-work-on-personal-projects"],
    popularityScore: 95,
  },
  {
    id: "how-do-you-approach-learning-a-new-technology",
    category: FaqCategory.Skills,
    question: "How do you approach learning a new technology?",
    answer: `I usually begin with the fundamentals instead of trying to understand every feature. Once the basics are clear, I build a small project that uses the technology in a practical way. Real implementation exposes challenges that tutorials rarely mention, making the learning process much more meaningful.`,
    keywords: ["learning", "new technology", "method"],
    relatedQuestions: ["how-do-you-keep-improving-your-coding-skills", "what-do-you-do-when-you-get-stuck-on-a-problem"],
    popularityScore: 90,
  },
  {
    id: "what-do-you-do-when-you-get-stuck-on-a-problem",
    category: FaqCategory.Skills,
    question: "What do you do when you get stuck on a problem?",
    answer: `The first step is understanding the error instead of immediately searching for a solution. I break the problem into smaller parts, verify each assumption, and test different approaches. Documentation, logs, and debugging tools often provide enough information to identify the actual cause without unnecessary trial and error.`,
    keywords: ["debugging", "problem solving", "stuck"],
    relatedQuestions: ["what-is-the-biggest-lesson-from-building-projects", "how-do-you-approach-learning-a-new-technology"],
    popularityScore: 88,
  },
  {
    id: "which-project-helped-you-grow-the-most",
    category: FaqCategory.Projects,
    question: "Which project helped you grow the most?",
    answer: `Building my Portfolio V2 platform stretched me the most — it forced backend development, a database, authentication, and AI to work together in one application. I designed a layered FastAPI backend, wired up PostgreSQL with pgvector, and built a retrieval-grounded assistant that answers only from indexed content. Making all those parts cooperate cleanly improved both my technical depth and how I organise a real project.`,
    keywords: ["portfolio v2", "full-stack", "rag ai", "growth", "best project"],
    relatedQuestions: ["why-do-you-work-on-personal-projects", "what-is-the-biggest-lesson-from-building-projects"],
    popularityScore: 92,
  },
  {
    id: "how-do-you-keep-improving-your-coding-skills",
    category: FaqCategory.Skills,
    question: "How do you keep improving your coding skills?",
    answer: `Consistency has been more valuable than trying to learn everything quickly. Regular coding practice, reviewing previous projects, and rebuilding ideas with better implementations have helped strengthen my understanding. Every project becomes an opportunity to apply something new while improving earlier mistakes.`,
    keywords: ["improvement", "practice", "consistency"],
    relatedQuestions: ["how-do-you-approach-learning-a-new-technology", "what-are-your-goals-as-a-software-engineer"],
    popularityScore: 84,
  },
  {
    id: "what-is-the-biggest-lesson-from-building-projects",
    category: FaqCategory.Projects,
    question: "What is the biggest lesson you've learned from building projects?",
    answer: `Projects rarely work perfectly on the first attempt. Unexpected issues appear throughout development, and solving them becomes the most valuable part of the experience. Every debugging session teaches something new, whether it involves writing cleaner code, improving architecture, or understanding a framework more deeply.`,
    keywords: ["lessons", "projects", "debugging"],
    relatedQuestions: ["what-do-you-do-when-you-get-stuck-on-a-problem", "which-project-helped-you-grow-the-most"],
    popularityScore: 86,
  },
  {
    id: "why-do-you-work-on-personal-projects",
    category: FaqCategory.Projects,
    question: "Why do you work on personal projects?",
    answer: `Personal projects provide the freedom to experiment without strict requirements. They allow me to explore different technologies, understand complete application development, and improve practical problem-solving skills. Every completed project also becomes a reference point for measuring progress over time.`,
    keywords: ["personal projects", "experimentation", "portfolio"],
    relatedQuestions: ["which-project-helped-you-grow-the-most", "how-do-you-organize-your-development-workflow"],
    popularityScore: 80,
  },
  {
    id: "how-do-you-organize-your-development-workflow",
    category: FaqCategory.Experience,
    question: "How do you organize your development workflow?",
    answer: `Before writing code, I define the core features and divide the work into smaller tasks. Git helps track progress, while testing each feature individually prevents larger issues later. This approach keeps development structured and makes future modifications much easier.`,
    keywords: ["workflow", "git", "organization"],
    relatedQuestions: ["how-do-you-keep-improving-your-coding-skills", "why-do-you-work-on-personal-projects"],
    popularityScore: 78,
  },
  {
    id: "what-interests-you-about-backend-development",
    category: FaqCategory.Backend,
    question: "What interests you about backend development?",
    answer: `Backend development focuses on the logic that keeps applications running. Designing APIs, handling databases, and managing authentication require careful planning and attention to detail. Understanding how information flows between different components has made backend engineering an interesting area for continuous improvement.`,
    keywords: ["backend", "apis", "databases"],
    relatedQuestions: ["what-are-your-goals-as-a-software-engineer", "which-project-helped-you-grow-the-most"],
    popularityScore: 82,
  },
  {
    id: "what-are-your-goals-as-a-software-engineer",
    category: FaqCategory.Career,
    question: "What are your goals as a software engineer?",
    answer: `My goal is to contribute to meaningful software while continuously improving my technical skills. I want to work on applications that involve backend engineering, cloud technologies, and AI-based solutions. At the same time, I aim to strengthen system design, deployment practices, and software architecture through real-world experience.`,
    keywords: ["goals", "career", "future"],
    relatedQuestions: ["what-motivated-you-to-choose-software-development", "what-interests-you-about-backend-development"],
    popularityScore: 89,
  },
];
