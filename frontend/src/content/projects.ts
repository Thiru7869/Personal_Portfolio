import type { MiniProject, Project } from "@shared/types";

/**
 * src/content/projects.ts
 * ------------------------------------------------------------
 * All projects shown on the site. `projects` fills the main
 * grid + quick-view modal; `miniProjects` is the "more on
 * GitHub" strip linking smaller public repos.
 *
 * GROUND RULE (V4 audit): every entry here maps to a real,
 * public repository on github.com/Thiru7869. The `github` and,
 * where deployed, `liveDemo` links were verified to resolve.
 * Case studies are written from each repo's own README and code
 * — nothing is invented. Client work without a public repo is
 * described in the Experience section, not showcased as a card.
 */

export const projects: Project[] = [
  {
    slug: "portfolio-v2-platform",
    title: "Portfolio V2 — Full-Stack AI Platform",
    tagline: "A portfolio engineered like a real product",
    description:
      "A production-shaped, dual-mode portfolio platform: a FastAPI backend with a grounded, read-only RAG assistant, JWT auth, and an admin dashboard, served by a Next.js 15 frontend — the whole thing containerised behind Nginx with GitHub Actions CI/CD.",
    problem:
      "Most developer portfolios are a single static page that proves nothing a resume doesn't. I wanted the repository itself to be the evidence: a layered backend, a real database, authentication done properly, an AI assistant that can't hallucinate about me, and the deployment plumbing to run it — architecture locked in docs before a line was written.",
    solution:
      "A monorepo split into a FastAPI service and a Next.js 15 App Router frontend. The backend is strictly layered — endpoints call services, services call repositories, and only the repository layer touches a SQLAlchemy session — with Pydantic schemas as the single validation source. A retrieval-augmented AI assistant answers only from indexed portfolio content, so it stays grounded. Auth uses JWT with refresh-token rotation and Argon2id hashing. n8n handles background automation, and everything runs under Docker Compose with an Nginx reverse proxy.",
    challenges: [
      "Keeping the RAG assistant strictly grounded — it retrieves from embedded portfolio content and refuses to answer beyond it, rather than free-associating like a generic chatbot",
      "Enforcing a clean layered architecture (endpoint → service → repository → model) so business logic never leaks into the API or the ORM",
      "Wiring async SQLAlchemy + Alembic migrations + pgvector so the same Postgres instance stores both relational data and embeddings",
    ],
    learnings: [
      "Writing the architecture spec first — and treating it as the source of truth when code disagrees — kept a large project from drifting",
      "A read-only, retrieval-grounded assistant is far more trustworthy than an open-ended one, and much safer to ship",
      "The layered backend earns its keep the moment a feature spans auth, business rules, and the database at once",
    ],
    architecture:
      "Next.js 15 App Router frontend (Professional mode as SSG/ISR for SEO, Developer mode as a CSR app-shell) → FastAPI backend with async SQLAlchemy, Alembic migrations, and Pydantic schemas → PostgreSQL + pgvector for relational data and embeddings → a RAG pipeline (retrieval → embedding → prompt → provider) for the grounded assistant → JWT + refresh rotation + Argon2id auth → n8n for automation. Docker Compose, Nginx reverse proxy, and GitHub Actions CI/CD tie it together.",
    techStack: [
      "FastAPI",
      "Next.js",
      "PostgreSQL",
      "pgvector",
      "Docker",
      "Nginx",
      "GitHub Actions",
    ],
    features: [
      "Grounded, read-only RAG assistant over portfolio content",
      "Layered FastAPI backend with async SQLAlchemy + Alembic",
      "JWT auth with refresh rotation and Argon2id hashing",
      "Dockerised, Nginx-fronted, with GitHub Actions CI/CD",
    ],
    github: "https://github.com/Thiru7869/My_Portfolio",
    featured: true,
    year: 2026,
    icon: "sparkles",
  },
  {
    slug: "library-management-system",
    title: "Library Management System API",
    tagline: "A backend built the way a real library needs",
    description:
      "A REST API for running a library — books, members, and borrowing — built with Node.js, Express, and MongoDB. Two real roles: librarians manage the catalogue, members borrow and return, and the permission model keeps the two strictly apart.",
    problem:
      "Most CRUD tutorials give every user the same powers. A real library doesn't work that way — librarians run the catalogue but don't borrow, members borrow but can't touch the catalogue or see the member list. I wanted to build a backend where the business rules and permissions actually reflect how the domain behaves.",
    solution:
      "An Express API with two genuinely separate roles enforced at the route layer. Librarians add, edit, and remove books and manage members; members register, browse availability, check books out, return them, and review their own history — and nothing outside their lane. Auth is JWT with bcrypt-hashed passwords, and every protected route is actually protected. The codebase is split into config, controllers, services, repositories, middleware, validators, and tests so responsibilities stay separated.",
    challenges: [
      "Designing a role model where librarian and member aren't just different labels but genuinely different capabilities, checked server-side on every route",
      "Modelling borrowing rules — availability, checkout, return, and per-member history — as real business logic in the service layer rather than ad-hoc controller code",
      "Keeping validation, auth middleware, and error handling consistent across every endpoint",
    ],
    learnings: [
      "Role-based access is a modelling problem before it's a middleware problem — get the capabilities right and the code follows",
      "A layered Express project (controllers → services → repositories) stays maintainable as routes multiply",
      "Validators and centralised error handling are what separate a demo API from one you'd actually deploy",
    ],
    architecture:
      "Express REST API split into config, controllers, services, repositories, middleware, validators, and tests → MongoDB Atlas via Mongoose for models and storage → JWT authentication with bcrypt password hashing → role-based route guards separating librarian and member capabilities. Deployed on Render.",
    techStack: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT", "bcrypt"],
    features: [
      "Separate librarian and member roles with server-side guards",
      "Full borrowing lifecycle: checkout, return, per-member history",
      "JWT auth with bcrypt-hashed passwords on every protected route",
      "Layered structure with validators and centralised error handling",
    ],
    github: "https://github.com/Thiru7869/Library-Management-System",
    liveDemo: "https://library-management-system-7p29.onrender.com",
    featured: true,
    year: 2026,
    icon: "kanban",
  },
  {
    slug: "fullstack-portfolio-node",
    title: "Full-Stack Portfolio (Node + MongoDB)",
    tagline: "A portfolio with a real backend behind it",
    description:
      "An earlier full-stack portfolio: a Node.js/Express API backed by MongoDB Atlas that stores visitor reviews and sends email notifications, served to a responsive frontend — frontend and backend both deployed on Render.",
    problem:
      "A portfolio doesn't need a backend to look good — but building one that had a real API taught me the parts a static site can't: persisting user-submitted data safely, sending transactional email, and defending public endpoints against spam.",
    solution:
      "A Node/Express backend exposing APIs for a review-submission system, storing entries in MongoDB Atlas and firing Gmail SMTP notifications when someone leaves a review. The public endpoints are rate-limited to blunt spam, secrets live in environment variables, and both the frontend site and the backend API are deployed independently on Render.",
    challenges: [
      "Wiring transactional email through Gmail SMTP reliably from a Node service without leaking credentials",
      "Rate-limiting public endpoints so a review form can't be abused",
      "Running frontend and backend as two separate deployments that talk to each other cleanly across origins",
    ],
    learnings: [
      "Even a 'simple' review form pulls in validation, storage, email, and abuse-prevention — the boring parts are the real work",
      "Environment-based configuration and secret hygiene matter the moment anything is public",
      "Splitting frontend and backend deployments forces you to get CORS and API contracts right",
    ],
    architecture:
      "Responsive HTML/CSS/JS frontend → Node.js/Express REST API → MongoDB Atlas for review storage → Gmail SMTP for email notifications → per-endpoint rate limiting for spam protection. Frontend and backend deployed separately on Render.",
    techStack: ["Node.js", "Express", "MongoDB", "JavaScript", "Render"],
    features: [
      "Review submission system persisted to MongoDB Atlas",
      "Email notifications via Gmail SMTP",
      "Rate-limited API for spam protection",
      "Independently deployed frontend and backend",
    ],
    github: "https://github.com/Thiru7869/New_Portfolio",
    liveDemo: "https://new-portfolio-1-ba0l.onrender.com",
    featured: true,
    year: 2026,
    icon: "leaf",
  },
  {
    slug: "user-management-dashboard",
    title: "User Management Dashboard",
    tagline: "A CRUD dashboard that handles the real states",
    description:
      "A responsive user-management dashboard built with React 19 and Vite: view, add, edit, delete, search, sort, filter, and paginate user records — with the loading, empty, and error states a real app actually needs.",
    problem:
      "A data table is easy to fake and hard to finish. The gap between a demo and something usable is all the states in between — loading, empty results, failed requests, form validation, pagination at scale — so I built a dashboard that handles them instead of hiding them.",
    solution:
      "A React 19 + Vite single-page app talking to the JSONPlaceholder REST API through Axios. It supports full CRUD, search across name and email, sortable columns, a filter popup, and client-side pagination from 10 up to 100 rows per page. Every asynchronous path has a real UI: a loading state, an empty state, and error handling with a retry action — plus client-side form validation before anything is submitted.",
    challenges: [
      "Handling every async outcome explicitly — loading, empty, and error-with-retry — instead of assuming the happy path",
      "Keeping search, sort, filter, and pagination composable so they work together rather than fighting each other",
      "Making the table genuinely responsive across desktop, tablet, and mobile without losing usability",
    ],
    learnings: [
      "The states between success and failure are where most of the real work in a UI lives",
      "Composable list operations (search + sort + filter + paginate) need a clear data-flow, or they collide",
      "Client-side validation and honest error UI make even a mock-API app feel trustworthy",
    ],
    architecture:
      "React 19 + Vite SPA → Axios client against the JSONPlaceholder mock REST API → composable client-side search, sort, filter, and pagination → explicit loading, empty, and error states with retry, plus client-side form validation. Deployed as a static build.",
    techStack: ["React 19", "Vite", "JavaScript", "Axios", "CSS"],
    features: [
      "Full CRUD with client-side form validation",
      "Search, column sorting, filter popup, and pagination (10–100/page)",
      "Explicit loading, empty, and error-with-retry states",
      "Responsive across desktop, tablet, and mobile",
    ],
    github: "https://github.com/Thiru7869/User-Management-Dashboard",
    liveDemo: "https://user-managementboard.netlify.app",
    featured: true,
    year: 2026,
    icon: "users",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/**
 * Smaller but real public repos on github.com/Thiru7869 — the
 * "more on GitHub" strip. Each link was verified to resolve.
 * Larger, backend-backed repos are promoted to `projects` above.
 */
export const miniProjects: MiniProject[] = [
  {
    name: "Food-App (TOMATO)",
    description:
      "A MERN food-ordering app with user and admin panels, JWT auth, and cart/checkout flows — built to practise the full MERN stack end to end.",
    github: "https://github.com/Thiru7869/Food-App",
    tech: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    name: "Genre-music-selector",
    description:
      "Music explorer with genre switching, cover art, and a dynamic song grid — a frontend study in smooth, intuitive UI.",
    github: "https://github.com/Thiru7869/Genre-music-selector",
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    name: "Weather-predicter",
    description: "Weather lookup app consuming a public forecast API.",
    github: "https://github.com/Thiru7869/Weather-predicter",
    tech: ["HTML", "JavaScript"],
  },
  {
    name: "ProductLanding-page",
    description: "A responsive product landing page — a layout and CSS study.",
    github: "https://github.com/Thiru7869/ProductLanding-page",
    tech: ["HTML", "CSS"],
  },
  {
    name: "Sarees-page-layout",
    description: "A textile storefront layout study built with HTML and CSS.",
    github: "https://github.com/Thiru7869/Sarees-page-layout",
    tech: ["HTML", "CSS"],
  },
];
