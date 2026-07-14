/**
 * src/content/datasets.ts
 * ------------------------------------------------------------
 * Supporting content datasets: quotes, tips, principles,
 * learning resources, career advice, motivational lines, and
 * site statistics. Consumed by the terminal (`fortune`, `tip`),
 * the footer, the blog sidebar, and the AI assistant.
 */

/** 30 original developer quotes — written for this site. */
export const developerQuotes: string[] = [
  "The best code review comment I ever received was a question.",
  "Every 'temporary fix' should come with a tombstone date.",
  "A green pipeline is the only compliment CI knows how to give.",
  "Readable code is a love letter to whoever's on call.",
  "The bug is never where you're sure it is — that's why you're sure.",
  "Ship the boring version first; clever can wait for evidence.",
  "Your users test in production whether you do or not.",
  "An error message is UI. Write it like someone will read it at 2 AM.",
  "The fastest query is the one you cached; the safest is the one you didn't need.",
  "Naming things well is refactoring in advance.",
  "Every abstraction is a bet that the future looks like today.",
  "Delete code with the same pride you wrote it with.",
  "A TODO without an owner is a wish, not a plan.",
  "The terminal remembers what the GUI makes you forget.",
  "Logs are the letters your past self mails to your debugging self.",
  "If the demo can't fail, it isn't demonstrating anything.",
  "Free tiers teach the constraints that budgets let you ignore.",
  "The senior move is asking the question everyone assumed was settled.",
  "Types are documentation that refuses to go stale.",
  "Perfect is a direction, shipped is a location.",
  "Every silent failure eventually finds a loud customer.",
  "Rewrites feel like progress because deleting is easier than understanding.",
  "The best performance optimization is the feature you didn't build.",
  "Git history is the only autobiography developers actually write.",
  "A good schema is an argument you won before it started.",
  "Benchmarks flatter; production audits.",
  "Learning in public converts embarrassment into documentation.",
  "The hardest part of full-stack is respecting the half you like less.",
  "Accessibility is just correctness for more people.",
  "Trust models the way you trust interns: verify, then verify.",
]; // Count: 30

/** 50 practical programming tips. */
export const developerTips: string[] = [
  "Read the error message. All of it. Twice. Then the stack trace.",
  "Reproduce the bug before you fix it, or you're fixing a theory.",
  "console.log with labels: log({user}) beats log(user) every time.",
  "Commit before every risky change — cheap checkpoints buy courage.",
  "Name booleans as questions: isLoading, hasAccess, canRetry.",
  "Validate at the boundary, trust inside — never the reverse.",
  "Write the function's signature before its body; the shape reveals the design.",
  "Prefer early returns over nested ifs — flat code reads faster.",
  "Delete commented-out code; git remembers so you don't have to.",
  "Learn your editor's multi-cursor. It pays rent daily.",
  "Cache invalidation bugs look like data corruption. Check the cache first.",
  "A slow test suite becomes an unused test suite. Keep tests fast.",
  "Use environment variables for config; commit an example file, never the real one.",
  "Index the columns in your WHERE clauses, not the ones you 'might need'.",
  "Handle the empty state, the loading state, and the error state — users live there.",
  "Feature flags beat long-lived branches for anything that takes weeks.",
  "Write the README before you forget why the setup steps matter.",
  "Timebox debugging: 45 minutes stuck means explain it to someone (or a duck).",
  "grep the codebase before writing a helper — someone already wrote it.",
  "Set maxLength on inputs; someone will paste a novel.",
  "Prefer composition over inheritance, and functions over both when possible.",
  "Learn HTTP status codes properly — they're the API's body language.",
  "Never trust Date math you wrote after midnight. Use a library.",
  "Test on a cheap Android phone; your users own it, not your laptop.",
  "Rate-limit anything that sends email, calls an LLM, or writes to disk.",
  "Read code you admire slowly — copying speed skips the learning.",
  "One PR, one idea. Reviewers approve what they can hold in their head.",
  "Rollback plans are features. Write them before deploys, not during incidents.",
  "Type the boundaries hardest: API responses, forms, third-party data.",
  "The database enforcing a constraint beats every app-level check.",
  "Async in a loop usually wants Promise.all. Check before you await serially.",
  "Log the inputs that caused the error, not just the error.",
  "Keyboard-test every interactive element you build. Tab is a user.",
  "Learn to read EXPLAIN output; ORMs hide queries, not consequences.",
  "Small functions lie less. If it needs a comment section, split it.",
  "Pin your dependencies; 'latest' is a time bomb with good intentions.",
  "Measure before optimizing — intuition about performance is usually wrong.",
  "Use TODO(name, date) or don't use TODO.",
  "Draw the data flow before writing state management. Boxes and arrows are free.",
  "An API without versioning is a promise you can't keep.",
  "Backups you haven't restored are hopes, not backups.",
  "Learn one debugging tool deeply — breakpoints beat print statements at scale.",
  "Idempotent endpoints forgive retries; design for the double-click.",
  "Keep secrets out of client code — NEXT_PUBLIC_ means public, forever.",
  "Refactor in a separate commit from behaviour changes. Reviewers will bless you.",
  "The second time you copy-paste code, extract it. Not the first.",
  "Write down the bug that took you longest each month. Patterns will appear.",
  "Prefer boring technology for the parts that must not fail.",
  "Every setTimeout in your code is a race condition with a salary.",
  "Finish things. A shipped 80% beats a perfect 40% in every portfolio.",
]; // Count: 50

/** 25 engineering principles I actually follow. */
export const codingPrinciples: string[] = [
  "Make it work, make it right, make it fast — in that order, always.",
  "Code is read far more than it's written; optimize for the reader.",
  "Impossible states should be unrepresentable, not just unlikely.",
  "The boundary of a system deserves more care than its middle.",
  "Fail loudly in development, gracefully in production, silently never.",
  "Duplication is cheaper than the wrong abstraction.",
  "Every dependency is a hire; interview it first.",
  "Design the failure path with the same care as the happy path.",
  "Data outlives code — schema decisions deserve double the thought.",
  "If it isn't deployed, it doesn't exist.",
  "Convention beats configuration until the convention lies.",
  "Security is a habit applied consistently, not a feature added finally.",
  "Feedback loops are the unit of engineering speed.",
  "Explicit is better than clever; clever is better than magic; magic needs docs.",
  "Constraints breed better designs than freedom does.",
  "The best documentation is a system too simple to need much.",
  "Accessibility, performance, and security are requirements, not enhancements.",
  "Delete more than you add whenever the codebase lets you.",
  "Version control is a communication medium, not a backup tool.",
  "A system you can't observe is a system you don't operate.",
  "Trust the compiler, verify the runtime, distrust the network.",
  "The senior skill is knowing which corners are load-bearing.",
  "Prefer reversible decisions made quickly over perfect decisions made slowly.",
  "Every 'we'll fix it later' needs a ticket, or it's a lie told kindly.",
  "Software is a team sport played in text; write accordingly.",
]; // Count: 25

/** 20 learning resources I genuinely recommend. */
export const learningResources: { name: string; description: string; url: string }[] = [
  { name: "MDN Web Docs", description: "The web's actual reference. When a tutorial disagrees with MDN, MDN is right.", url: "https://developer.mozilla.org" },
  { name: "React Documentation", description: "The rewritten docs teach the mental model, not just the API. Read the 'Learn' track completely.", url: "https://react.dev" },
  { name: "Next.js Learn", description: "The official course — the fastest honest path into the App Router.", url: "https://nextjs.org/learn" },
  { name: "TypeScript Handbook", description: "Skip the crash courses; the handbook is shorter and truer.", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  { name: "FastAPI Documentation", description: "Docs so good they double as a REST design course.", url: "https://fastapi.tiangolo.com" },
  { name: "PostgreSQL Tutorial", description: "Where SQL stops being syntax and starts being thinking.", url: "https://www.postgresqltutorial.com" },
  { name: "JavaScript.info", description: "The depth a serious JS developer eventually needs, in readable order.", url: "https://javascript.info" },
  { name: "CSS-Tricks", description: "Flexbox and Grid guides that ended a thousand layout fights.", url: "https://css-tricks.com" },
  { name: "web.dev", description: "Google's performance and best-practice playbook — Lighthouse explained by its authors.", url: "https://web.dev" },
  { name: "The Odin Project", description: "The free full-stack curriculum I recommend to every beginner who asks.", url: "https://www.theodinproject.com" },
  { name: "freeCodeCamp", description: "Certifications that make you build. The projects matter more than the badges.", url: "https://www.freecodecamp.org" },
  { name: "Docker Getting Started", description: "The official tutorial beats every YouTube summary of it.", url: "https://docs.docker.com/get-started/" },
  { name: "Pro Git (book)", description: "Free, complete, and the reason git stops feeling like incantations.", url: "https://git-scm.com/book" },
  { name: "LeetCode", description: "Pattern practice for interviews — 80 organized problems beat 300 random ones.", url: "https://leetcode.com" },
  { name: "NeetCode Roadmap", description: "The pattern-first DSA ordering I wish I'd started with.", url: "https://neetcode.io" },
  { name: "System Design Primer", description: "The GitHub repo that makes system design interviews approachable.", url: "https://github.com/donnemartin/system-design-primer" },
  { name: "Kaggle Learn", description: "Short, practical ML courses — where my deep learning journey got hands-on.", url: "https://www.kaggle.com/learn" },
  { name: "3Blue1Brown Neural Networks", description: "The visual intuition for deep learning that textbooks can't draw.", url: "https://www.3blue1brown.com/topics/neural-networks" },
  { name: "Linux Journey", description: "Gentle, structured Linux fundamentals — the path I point Windows friends to.", url: "https://linuxjourney.com" },
  { name: "Supabase Docs", description: "Postgres, auth, and RLS explained for application developers.", url: "https://supabase.com/docs" },
]; // Count: 20

/** 25 pieces of career advice I'd give juniors (and myself). */
export const careerAdvice: string[] = [
  "Build things that exist. A deployed URL beats ten repos of half-finished tutorials.",
  "Learn in public — the blog post that embarrasses you today is the interview answer of next year.",
  "Fundamentals compound; frameworks depreciate. Invest accordingly.",
  "Your GitHub is a portfolio whether you curate it or not.",
  "Ask the question in the meeting. Someone else is stuck on it too.",
  "Read rejection as routing, not verdict — the market is noisy at the entry level.",
  "One genuine project with real users teaches more than five clones.",
  "Write your resume in outcomes, not duties: what changed because you were there?",
  "The first job's learning environment matters more than its salary.",
  "Networking is just being findable and helpful. Start with findable.",
  "Interview preparation is a skill separate from engineering. Practice both, resent neither.",
  "Keep a brag document — you will forget your own wins by review season.",
  "Say 'I don't know, but here's how I'd find out' — it outscores confident wrong answers.",
  "Depth in one stack beats shallowness in four. Recruiters can tell.",
  "Contribute to the tools you already use; motivation survives longer than fake interest.",
  "Own a mistake fast and loudly once; it buys years of trust.",
  "Comparison with peers is noise; comparison with last-year-you is signal.",
  "Learn to estimate honestly — 'by Friday, risk is X' is a senior sentence.",
  "The unglamorous ticket done excellently gets noticed more than you think.",
  "Burnout is a debt with compound interest. Rest is maintenance, not weakness.",
  "Freelance at least once; invoicing your own work teaches scope like nothing else.",
  "Make friends with people better than you and pay attention to their defaults.",
  "Titles lag ability by a year or two. Keep building; the paperwork catches up.",
  "Every 'boring' company runs interesting problems at scale. Look past the logo.",
  "Careers are decades long. Optimize for the person you're becoming, not this quarter.",
]; // Count: 25

/** 20 realistic motivational lines — no empty hype. */
export const motivationalMessages: string[] = [
  "You don't need to feel ready; you need to start badly and revise.",
  "The gap between you and the developer you admire is mostly logged hours.",
  "Confusion is what learning feels like from the inside. Keep going.",
  "Nobody's first hundred commits were good. Yours don't have to be either.",
  "The bug will make sense afterward. It always does. Continue.",
  "Small consistent progress embarrasses sporadic brilliance over a year.",
  "Your small-town start is a feature — resourcefulness doesn't grow in comfort.",
  "Rejection emails are proof you're in the arena, not evidence you don't belong.",
  "The tutorial ends; the learning starts when you build without one.",
  "Being stuck is temporary. Quitting makes it permanent. Choose temporary.",
  "You've solved every problem you've ever faced so far. Full record.",
  "Imposter syndrome means your standards grew faster than your self-image. Good sign.",
  "Ship it. Feedback from reality beats another week of private polishing.",
  "The syntax you're fighting today will be muscle memory by December.",
  "One published project outweighs a hundred private intentions.",
  "Slow progress is still compounding. Zero is the only rate that fails.",
  "Someone with fewer resources than you has done this. It's possible. Proceed.",
  "The interview that goes badly is a free syllabus for the one that won't.",
  "Write code today that yesterday-you couldn't. That's the whole game.",
  "Finish the week's plan, not the decade's worry.",
]; // Count: 20

import { blogArticles } from "@/content/blog";
import { faqs } from "@/content/faq";
import { projects, miniProjects } from "@/content/projects";
import { certificates } from "@/content/certificates";
import { skillGroups } from "@/content/skills";
import { modes } from "@/config/modes";

/**
 * Website / profile statistics — the SINGLE SOURCE OF TRUTH.
 * Every value is DERIVED from a real content array or config,
 * so counts can never drift from reality. Do not hardcode
 * counts elsewhere; import from here (or the source arrays).
 *
 * (terminalCommands is exported from lib/terminal-commands.ts as
 * COMMAND_COUNT to avoid a circular import — that module already
 * imports the quotes/tips datasets below.)
 */
export const siteStatistics = {
  totalBlogs: blogArticles.length,
  totalFaqs: faqs.length,
  /** Featured/flagship projects shown in the file manager. */
  totalProjects: projects.length,
  /** Every public repository referenced (flagship + more-on-GitHub). */
  gitHubRepositories:
    projects.filter((p) => p.github).length + miniProjects.length,
  technologiesUsed: new Set(
    skillGroups.flatMap((g) => g.skills.map((s) => s.name))
  ).size,
  certifications: certificates.length,
  publications: 1,
  researchPublications: 1,
  yearsLearning: 3,
  experienceModes: modes.length,
} as const;

/** Popular tags across the content system (for search UIs). */
export const popularTags: string[] = [
  "React", "Next.js", "TypeScript", "JavaScript", "Python", "FastAPI",
  "PostgreSQL", "MongoDB", "Docker", "Git", "Linux", "Parrot OS",
  "Tailwind CSS", "Deep Learning", "Machine Learning", "ECG", "Deployment",
  "Vercel", "Performance", "SEO", "Accessibility", "Career", "Interviews",
  "Freelancing", "System Design", "Authentication", "JWT", "REST API",
  "Debugging", "DevOps", "CI/CD", "Cloud", "AWS", "Supabase", "Portfolio",
];

/** Search keywords for fast indexing across the site's search surfaces. */
export const searchKeywords: string[] = [
  ...popularTags,
  "thiru", "thirumala narasimha poluru", "full-stack developer",
  "bengaluru developer", "venkatagiri", "annamacharya institute",
  "hire developer", "freelance developer india", "react developer",
  "nextjs portfolio", "fastapi developer", "python backend",
  "ecg deep learning", "cardiovascular detection", "ijnrd paper",
  "library management api", "user management dashboard", "research paper", "b.tech cse",
  "responsive design", "web performance", "lighthouse score",
  "jwt authentication", "row level security", "rate limiting",
  "terminal portfolio", "theme engine", "ai assistant", "command palette",
  "developer blog india", "interview questions", "leetcode practice",
  "github contributions", "open source learner", "remote developer",
];
