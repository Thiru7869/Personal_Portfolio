import { BlogCategory, Difficulty, type ArticleSource } from "./types";

/**
 * src/content/blog/posts.ts
 * ------------------------------------------------------------
 * The official blog posts, verbatim from the owner's Blogs
 * file. Bodies are NOT to be reworded — only surrounding
 * metadata (dates, tags, SEO fields) is editorial.
 *
 * To add a post: append an entry here. Pages, search, sitemap,
 * related links, and the AI assistant update automatically.
 */
export const posts: ArticleSource[] = [
  {
    id: "post-01",
    slug: "my-journey-into-full-stack-development",
    title: "My Journey into Full-Stack Development",
    subtitle: "How small projects turned an overwhelming field into a learnable one",
    description:
      "Why consistent practice and building small applications from scratch taught more than any step-by-step tutorial.",
    category: BlogCategory.Journey,
    tags: ["Full-Stack", "Learning", "Projects"],
    publishDate: "2026-06-10",
    featured: true,
    difficulty: Difficulty.Beginner,
    seoTitle: "My Journey into Full-Stack Development — Learning by Building",
    seoDescription:
      "How building small projects — starting with a simple to-do application — made full-stack development learnable, one concept at a time.",
    keywords: ["full-stack development", "learning to code", "developer journey", "web development"],
    articleBody: `Starting with web development felt overwhelming because every tutorial introduced another framework or tool. Instead of trying to learn everything at once, I focused on building small projects. A simple to-do application taught me routing, state management, and API integration better than hours of reading documentation. Gradually, backend development became part of the process, making it easier to understand how data moves between the client and the server. Each project added a new concept, from authentication to database management. Looking back, consistent practice made the biggest difference. Building applications from scratch revealed mistakes quickly, and fixing them strengthened my understanding more than following step-by-step tutorials.`,
    relatedPosts: ["why-small-projects-matter", "my-approach-to-learning-new-technologies"],
  },
  {
    id: "post-02",
    slug: "why-i-started-learning-docker",
    title: "Why I Started Learning Docker",
    subtitle: "From environment headaches to consistent, reproducible deployments",
    description:
      "Manual deployments kept producing different results in different environments — containerization fixed that for good.",
    category: BlogCategory.DevOps,
    tags: ["Docker", "DevOps", "Deployment"],
    publishDate: "2026-05-22",
    featured: true,
    difficulty: Difficulty.Beginner,
    seoTitle: "Why I Started Learning Docker — Consistency Over Configuration",
    seoDescription:
      "How Docker removed environment inconsistencies from my workflow and made deployments simpler, reproducible, and reliable.",
    keywords: ["docker", "containerization", "deployment", "devops"],
    articleBody: `Deploying applications manually often created unnecessary problems. Different environments produced different results, and debugging configuration issues consumed valuable time. Docker introduced a consistent way to package an application with everything it needed. Instead of worrying about missing dependencies, the application behaved the same across systems. Building container images also made deployment simpler and easier to reproduce. Although Docker initially introduced new commands and concepts, practical experimentation helped everything become familiar. Containerization is now an important part of my workflow because it reduces setup time and provides confidence that applications will run consistently wherever they are deployed.`,
    relatedPosts: ["learning-cloud-concepts-step-by-step", "my-experience-with-git-and-github"],
  },
  {
    id: "post-03",
    slug: "understanding-rest-apis-through-projects",
    title: "Understanding REST APIs Through Projects",
    subtitle: "Theory explained the idea — building one made it click",
    description:
      "Creating real endpoints, testing with Postman, and organizing routes taught REST in a way books never could.",
    category: BlogCategory.Backend,
    tags: ["REST API", "Backend", "Postman"],
    publishDate: "2026-05-02",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "Understanding REST APIs Through Real Projects",
    seoDescription:
      "How building CRUD endpoints, handling errors, and organizing routes turned REST API theory into practical backend skill.",
    keywords: ["rest api", "backend development", "api design", "postman"],
    articleBody: `Reading about REST APIs explained the theory, but building one made the concepts much clearer. Creating endpoints for creating, updating, deleting, and retrieving data demonstrated how frontend and backend applications communicate. Testing requests using Postman also highlighted the importance of proper status codes and meaningful responses. Error handling became just as important as returning successful data. As projects became larger, organizing routes and separating business logic from controllers improved code readability. Developing APIs through real applications provided practical experience that books alone could not offer, making backend development much easier to understand.`,
    relatedPosts: ["my-journey-into-full-stack-development", "building-better-coding-habits"],
  },
  {
    id: "post-04",
    slug: "building-better-coding-habits",
    title: "Building Better Coding Habits",
    subtitle: "Organized, readable, maintainable — the part of development after the code works",
    description:
      "Smaller components, meaningful names, version control, and regular refactoring — the habits that made projects manageable.",
    category: BlogCategory.Career,
    tags: ["Code Quality", "Habits", "Refactoring"],
    publishDate: "2026-04-15",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "Building Better Coding Habits — Clean, Maintainable Projects",
    seoDescription:
      "The habits that turned messy single-file projects into organized, maintainable codebases: componentization, naming, version control, and refactoring.",
    keywords: ["coding habits", "clean code", "refactoring", "code organization"],
    articleBody: `Writing code is only one part of software development. Keeping the code organized, readable, and maintainable matters just as much. Early projects often became difficult to manage because everything existed inside a single file. Breaking features into smaller components and using meaningful variable names made future updates much easier. Version control also became an essential habit because every meaningful change could be tracked safely. Regular refactoring reduced unnecessary complexity without changing functionality. These small improvements gradually created cleaner projects and reduced debugging time, making development more structured and manageable.`,
    relatedPosts: ["my-experience-with-git-and-github", "debugging-taught-me-more-than-success"],
  },
  {
    id: "post-05",
    slug: "my-experience-with-git-and-github",
    title: "My Experience with Git and GitHub",
    subtitle: "From intimidating commands to the most valuable tool in the workflow",
    description:
      "Branching, frequent commits, and commit history went from confusing to indispensable across real projects.",
    category: BlogCategory.DevOps,
    tags: ["Git", "GitHub", "Version Control"],
    publishDate: "2026-03-28",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "My Experience with Git and GitHub — Version Control in Practice",
    seoDescription:
      "How Git's branching, merging, and history went from complicated to essential — and why version control became my most valuable project tool.",
    keywords: ["git", "github", "version control", "branching"],
    articleBody: `Git initially appeared complicated because of branching, merging, and conflict resolution. After working on multiple projects, those concepts became part of the daily workflow. Committing changes frequently made it easier to identify mistakes, while branches provided a safe environment to experiment with new features. GitHub added another layer by enabling project backups and collaboration. Reviewing commit history also became useful when tracking bugs or understanding previous implementations. Version control is no longer just a requirement for developers; it has become one of the most valuable tools for managing software projects efficiently.`,
    relatedPosts: ["building-better-coding-habits", "why-i-started-learning-docker"],
  },
  {
    id: "post-06",
    slug: "learning-cloud-concepts-step-by-step",
    title: "Learning Cloud Concepts Step by Step",
    subtitle: "Virtual machines first, then storage, networking, and identity — one layer at a time",
    description:
      "An incremental approach that made cloud computing approachable: deploy small, monitor, and connect every concept to a practical example.",
    category: BlogCategory.DevOps,
    tags: ["Cloud", "Learning", "Infrastructure"],
    publishDate: "2026-03-05",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "Learning Cloud Concepts Step by Step — A Practical Path",
    seoDescription:
      "How starting with virtual machines and storage, then deploying small applications, made cloud scalability, security, and automation approachable.",
    keywords: ["cloud computing", "cloud learning", "infrastructure", "deployment"],
    articleBody: `Cloud computing introduced many unfamiliar services at first. Instead of trying to understand everything immediately, I started with virtual machines and storage services before exploring networking and identity management. Deploying small applications helped explain concepts that documentation described only theoretically. Monitoring resource usage also provided insight into how cloud infrastructure operates in real-world scenarios. Gradually, topics such as scalability, security, and automation became easier to understand because they were connected to practical examples. This incremental approach made cloud technologies less intimidating and far more approachable.`,
    relatedPosts: ["why-i-started-learning-docker", "my-approach-to-learning-new-technologies"],
  },
  {
    id: "post-07",
    slug: "debugging-taught-me-more-than-success",
    title: "Debugging Taught Me More Than Success",
    subtitle: "The most valuable lessons live inside the bugs",
    description:
      "Reading errors carefully, checking logs, and isolating one issue at a time — how debugging built real problem-solving skill.",
    category: BlogCategory.Backend,
    tags: ["Debugging", "Problem Solving", "Lessons"],
    publishDate: "2026-02-14",
    featured: true,
    difficulty: Difficulty.Beginner,
    seoTitle: "Debugging Taught Me More Than Success — Lessons from Fixing Bugs",
    seoDescription:
      "Why systematic debugging — reading error messages, checking logs, isolating issues — taught more than any successful deployment.",
    keywords: ["debugging", "problem solving", "error handling", "developer skills"],
    articleBody: `Successful code often hides the learning process behind it. Most valuable lessons appeared while fixing unexpected bugs. Reading error messages carefully, checking logs, and testing assumptions systematically became part of solving problems. Rather than changing random sections of code, isolating one issue at a time usually produced faster results. Debugging also improved patience because many problems were caused by small mistakes that were easy to overlook. Every resolved issue increased confidence and strengthened problem-solving skills, making future debugging sessions more efficient.`,
    relatedPosts: ["building-better-coding-habits", "understanding-rest-apis-through-projects"],
  },
  {
    id: "post-08",
    slug: "why-small-projects-matter",
    title: "Why Small Projects Matter",
    subtitle: "A calculator teaches more than an unfinished platform",
    description:
      "Small, polished, functional applications demonstrate consistent development practice better than one impressive-but-incomplete build.",
    category: BlogCategory.Projects,
    tags: ["Projects", "Portfolio", "Learning"],
    publishDate: "2026-01-20",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "Why Small Projects Matter More Than Impressive Ones",
    seoDescription:
      "How small applications — calculators, trackers, managers — teach frontend, backend, databases, and deployment in manageable stages.",
    keywords: ["small projects", "portfolio projects", "learning by building"],
    articleBody: `Large applications can appear impressive, but small projects often provide stronger learning opportunities. A calculator, expense tracker, or bookmark manager introduces many practical concepts without becoming overwhelming. These projects demonstrate frontend development, backend integration, database operations, authentication, and deployment in manageable stages. Completing multiple smaller applications also creates a stronger portfolio because each project highlights different technical skills. Instead of focusing only on complexity, building polished and functional applications provides a clearer demonstration of consistent development practices and problem-solving ability.`,
    relatedPosts: ["my-journey-into-full-stack-development", "continuous-learning-in-software-development"],
  },
  {
    id: "post-09",
    slug: "my-approach-to-learning-new-technologies",
    title: "My Approach to Learning New Technologies",
    subtitle: "Core features first, small project second, advanced features when there's a foundation",
    description:
      "A practical learning method: build something small with the core features, and let real problems make the documentation meaningful.",
    category: BlogCategory.Career,
    tags: ["Learning", "Method", "Growth"],
    publishDate: "2025-12-18",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "My Approach to Learning New Technologies — Build First",
    seoDescription:
      "Why building a small project with core features beats memorizing documentation — a practical method for learning frameworks, cloud services, and tools.",
    keywords: ["learning technologies", "developer learning", "practical learning"],
    articleBody: `Every new technology introduces unfamiliar terminology, documentation, and workflows. Instead of memorizing everything immediately, I focus on building a small project using the core features. Documentation becomes much easier to understand when solving an actual problem rather than reading randomly. Breaking learning into manageable steps also prevents information overload. After completing a basic project, experimenting with advanced features becomes more meaningful because there is already a working foundation. This practical approach has made learning frameworks, cloud services, and development tools much more effective.`,
    relatedPosts: ["learning-cloud-concepts-step-by-step", "continuous-learning-in-software-development"],
  },
  {
    id: "post-10",
    slug: "continuous-learning-in-software-development",
    title: "Continuous Learning in Software Development",
    subtitle: "Consistency over intensity, fundamentals over framework-chasing",
    description:
      "Technology changes fast — steady improvement through documentation, projects, and code review beats trying to learn everything at once.",
    category: BlogCategory.Career,
    tags: ["Continuous Learning", "Growth", "Consistency"],
    publishDate: "2025-11-25",
    featured: false,
    difficulty: Difficulty.Beginner,
    seoTitle: "Continuous Learning in Software Development — Consistency Wins",
    seoDescription:
      "Why strengthening core programming concepts while gradually exploring modern tools produces better results than chasing every new framework.",
    keywords: ["continuous learning", "software development", "developer growth"],
    articleBody: `Technology changes rapidly, making continuous learning an essential part of software development. Rather than chasing every new framework, I focus on strengthening core programming concepts while gradually exploring modern tools. Reading documentation, building projects, and reviewing existing code all contribute to steady improvement. Mistakes are expected during the process, but each one provides an opportunity to understand concepts more deeply. Consistency has produced better results than trying to learn everything within a short period. Small improvements accumulated over time eventually become noticeable, making each new project stronger than the previous one.`,
    relatedPosts: ["my-approach-to-learning-new-technologies", "why-small-projects-matter"],
  },
];
