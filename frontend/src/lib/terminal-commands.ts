import { MODE_IDS, SECTION_IDS } from "@shared/constants";
import type { Appearance, ModeId } from "@shared/types";
import { site, socialLinks } from "@/config/site";
import { aboutParagraphs } from "@/content/profile";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { skillGroups } from "@/content/skills";
import { researchPaper } from "@/content/research";
import { certificates } from "@/content/certificates";
import { blogArticles } from "@/content/blog";
import { faqs } from "@/content/faq";
import { developerQuotes, developerTips } from "@/content/datasets";

/**
 * src/lib/terminal-commands.ts
 * ------------------------------------------------------------
 * The command registry for the portfolio terminal. To add a
 * command, append an entry to COMMANDS — `help`, autocomplete,
 * and suggestions pick it up automatically.
 */

export interface TerminalContext {
  setMode: (mode: ModeId) => void;
  setAppearance: (appearance: Appearance) => void;
  navigate: (path: string) => void;
  scrollTo: (sectionId: string) => void;
  openUrl: (url: string) => void;
  history: string[];
}

export interface CommandResult {
  lines: string[];
  /** "clear" wipes the scrollback; animations run in the shell. */
  action?: "clear" | "matrix" | "donut" | "train" | "clock" | "parrot";
}

export interface TerminalCommand {
  name: string;
  description: string;
  usage?: string;
  run: (args: string[], ctx: TerminalContext) => CommandResult;
}

const link = (id: string) => socialLinks.find((s) => s.id === id)?.href ?? "";

/** Virtual files for `ls` and `cat`. */
const FILES: Record<string, string[]> = {
  "about.txt": aboutParagraphs.map((p) => p.replace(/\n/g, " ")),
  "contact.txt": [
    `email:    ${site.email}`,
    `phone:    ${site.phone}`,
    `location: ${site.location}`,
    `github:   ${link("github")}`,
    `linkedin: ${link("linkedin")}`,
  ],
  "research.txt": [
    researchPaper.title,
    `${researchPaper.venue} · ${researchPaper.year} · ${researchPaper.status}`,
  ],
  "resume.pdf": ["Binary file. Use the `resume` command to open it."],
};

/** `fortune` draws from the original quotes in content/datasets.ts. */
const FORTUNES = [
  ...developerQuotes,
  "Fortune favours the prepared repo. Try `sudo hire thiru`.",
];

export const COMMANDS: TerminalCommand[] = [
  {
    name: "help",
    description: "List every available command",
    run: () => ({
      lines: [
        "Available commands:",
        "",
        ...COMMANDS.map(
          (c) => `  ${c.name.padEnd(12)} ${c.description}`
        ),
        "",
        "Tip: Tab autocompletes, ↑/↓ walk history.",
      ],
    }),
  },
  {
    name: "about",
    description: "Who is Thiru?",
    run: (_a, ctx) => {
      ctx.scrollTo("about");
      return {
        lines: [
          `${site.name} ("${site.shortName}")`,
          site.roles.join(" · "),
          "",
          aboutParagraphs[0],
          "",
          "→ Scrolled you to the About section for the full story.",
        ],
      };
    },
  },
  {
    name: "skills",
    description: "Tech stack, grouped",
    run: () => ({
      lines: skillGroups.map(
        (g) => `${g.label.padEnd(20)} ${g.skills.map((s) => s.name).join(", ")}`
      ),
    }),
  },
  {
    name: "projects",
    description: "List all projects",
    run: (_a, ctx) => {
      ctx.scrollTo("projects");
      return {
        lines: [
          ...projects.map(
            (p) =>
              `  ${p.featured ? "★" : "·"} ${p.title.padEnd(34)} ${p.year} — ${p.tagline}`
          ),
          "",
          "→ Scrolled to Projects. Click any card for the full case study.",
        ],
      };
    },
  },
  {
    name: "experience",
    description: "Work history",
    run: () => ({
      lines: experience.map(
        (e) => `  ${e.start} – ${e.end}  ${e.role} @ ${e.company} (${e.type})`
      ),
    }),
  },
  {
    name: "education",
    description: "Where I studied",
    run: () => ({
      lines: education.map(
        (e) => `  ${e.duration}  ${e.degree}, ${e.stream} — ${e.institution}`
      ),
    }),
  },
  {
    name: "contact",
    description: "How to reach me",
    run: (_a, ctx) => {
      ctx.scrollTo("contact");
      return { lines: [...FILES["contact.txt"], "", "→ Scrolled to the contact form."] };
    },
  },
  {
    name: "resume",
    description: "Open my resume (PDF)",
    run: (_a, ctx) => {
      ctx.openUrl(site.resumeUrl);
      return { lines: ["Opening resume.pdf in a new tab…"] };
    },
  },
  {
    name: "github",
    description: "Open my GitHub profile",
    run: (_a, ctx) => {
      ctx.openUrl(link("github"));
      return { lines: [`Opening ${link("github")} …`] };
    },
  },
  {
    name: "linkedin",
    description: "Open my LinkedIn profile",
    run: (_a, ctx) => {
      ctx.openUrl(link("linkedin"));
      return { lines: [`Opening ${link("linkedin")} …`] };
    },
  },
  {
    name: "research",
    description: "My published research paper",
    run: (_a, ctx) => {
      ctx.scrollTo("research");
      return {
        lines: [
          researchPaper.title,
          `${researchPaper.venue} · ${researchPaper.year} · ${researchPaper.status}`,
          "",
          `Keywords: ${researchPaper.keywords.join(", ")}`,
          "→ Scrolled to the Research section for abstract and download.",
        ],
      };
    },
  },
  {
    name: "certificates",
    description: "Certifications earned",
    run: () => ({
      lines: certificates.map((c) => `  ${c.date.padEnd(10)} ${c.title} — ${c.issuer}`),
    }),
  },
  {
    name: "blogs",
    description: "Latest blog posts",
    run: (_a, ctx) => {
      ctx.navigate("/blog");
      return {
        lines: [
          ...blogArticles.slice(0, 5).map((b) => `  ${b.publishDate}  ${b.title}`),
          "",
          "→ Taking you to /blog …",
        ],
      };
    },
  },
  {
    name: "qa",
    description: "Interview Q&A pages",
    run: (_a, ctx) => {
      ctx.navigate("/qa");
      return {
        lines: [
          `${faqs.length} questions answered in detail — searchable and categorized.`,
          "→ Taking you to /qa …",
        ],
      };
    },
  },
  {
    name: "theme",
    description: "Light/dark: theme light | dark | toggle",
    usage: "theme [light|dark|toggle]",
    run: (args, ctx) => {
      const arg = (args[0] ?? "toggle").toLowerCase();
      if (arg === "light" || arg === "dark") {
        ctx.setAppearance(arg);
        return { lines: [`Appearance set to ${arg}.`] };
      }
      if (arg === "toggle") {
        const next =
          document.documentElement.getAttribute("data-appearance") === "dark"
            ? "light"
            : "dark";
        ctx.setAppearance(next as Appearance);
        return { lines: [`Appearance toggled to ${next}.`] };
      }
      return { lines: ["usage: theme [light|dark|toggle]  — for modes, see 'mode'"] };
    },
  },
  {
    name: "mode",
    description: "Switch experience mode: mode <name> | mode list",
    usage: "mode [list|professional|terminal|ai|developer|executive]",
    run: (args, ctx) => {
      const raw = (args[0] ?? "list").toLowerCase();
      if (raw === "list") {
        return {
          lines: [
            "Experience modes:",
            ...MODE_IDS.map((m) => `  mode ${m}`),
            "",
            "Tip: 'mode terminal' turns the whole site into a desktop.",
          ],
        };
      }
      if ((MODE_IDS as readonly string[]).includes(raw)) {
        ctx.setMode(raw as ModeId);
        return { lines: [`Switching to ${raw} mode…`] };
      }
      return { lines: [`mode: unknown mode '${raw}'. Try 'mode list'.`] };
    },
  },
  {
    name: "clear",
    description: "Clear the terminal",
    run: () => ({ lines: [], action: "clear" }),
  },
  {
    name: "date",
    description: "Current date and time",
    run: () => ({ lines: [new Date().toString()] }),
  },
  {
    name: "whoami",
    description: "Print the current user",
    run: () => ({
      lines: ["visitor", "", `(The interesting one is ${site.shortName.toLowerCase()} — try 'about'.)`],
    }),
  },
  {
    name: "neofetch",
    description: "System info, portfolio edition",
    run: () => ({
      lines: [
        "        .-.        thiru@portfolio",
        "       (o o)       ---------------",
        "       | O \\       OS:       ThiruOS 2.0 (Parrot-inspired)",
        "        \\   \\      Host:     Single Page Portfolio",
        "         `~~~'     Kernel:   Next.js 15 / React 19",
        "                   Shell:    TypeScript (strict)",
        "                   DE:       Tailwind CSS + Framer Motion",
        "                   Themes:   7 UI modes installed",
        `                   Uptime:   coding since 2022`,
        `                   Contact:  ${site.email}`,
      ],
    }),
  },
  {
    name: "sudo",
    description: "Try: sudo hire thiru",
    usage: "sudo hire thiru",
    run: (args, ctx) => {
      if (args.join(" ").toLowerCase() === "hire thiru") {
        ctx.scrollTo("contact");
        return {
          lines: [
            "[sudo] password for visitor: ********",
            "Permission granted. Excellent judgment detected.",
            "",
            "  ✓ Resolving dependencies… full-stack skills found",
            "  ✓ Verifying references… research paper published",
            "  ✓ Availability check… OPEN TO WORK",
            "",
            "Next step → the contact form (scrolling you there now).",
          ],
        };
      }
      return {
        lines: [
          `visitor is not in the sudoers file for '${args.join(" ") || "?"}'.`,
          "This incident will be reported. (Try: sudo hire thiru)",
        ],
      };
    },
  },
  {
    name: "pwd",
    description: "Print working directory",
    run: () => ({ lines: ["/home/visitor/thiru-portfolio"] }),
  },
  {
    name: "ls",
    description: "List sections and files",
    run: () => ({
      lines: [
        [...SECTION_IDS].map((s) => `${s}/`).join("  "),
        Object.keys(FILES).join("  "),
      ],
    }),
  },
  {
    name: "cat",
    description: "Read a file: cat about.txt",
    usage: "cat <file> — try: cat about.txt | contact.txt | research.txt",
    run: (args) => {
      const file = args[0];
      if (!file) return { lines: ["usage: cat <file>  (try 'ls' to see files)"] };
      const content = FILES[file];
      if (!content) return { lines: [`cat: ${file}: No such file or directory`] };
      return { lines: content };
    },
  },
  {
    name: "echo",
    description: "Print text back",
    run: (args) => ({ lines: [args.join(" ")] }),
  },
  {
    name: "history",
    description: "Show command history",
    run: (_a, ctx) => ({
      lines: ctx.history.length
        ? ctx.history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`)
        : ["(history is empty)"],
    }),
  },
  {
    name: "uname",
    description: "Print system information",
    run: (args) =>
      args[0] === "-a"
        ? {
            lines: [
              "ThiruOS portfolio 1.0.0-thiru #1 SMP Next.js 15 x86_64 GNU/Web",
            ],
          }
        : { lines: ["ThiruOS"] },
  },
  {
    name: "fortune",
    description: "A random developer fortune",
    run: () => ({
      lines: [FORTUNES[Math.floor(Math.random() * FORTUNES.length)]],
    }),
  },
  {
    name: "tip",
    description: "One practical programming tip",
    run: () => ({
      lines: [developerTips[Math.floor(Math.random() * developerTips.length)]],
    }),
  },
  {
    name: "matrix",
    description: "Follow the white rabbit",
    run: () => ({ lines: ["Wake up, Neo…"], action: "matrix" }),
  },
  {
    name: "donut",
    description: "The classic spinning ASCII donut",
    run: () => ({ lines: [], action: "donut" }),
  },
  {
    name: "train",
    description: "You typed sl again, didn't you",
    run: () => ({ lines: [], action: "train" }),
  },
  {
    name: "clock",
    description: "Big ASCII clock",
    run: () => ({ lines: [], action: "clock" }),
  },
  {
    name: "parrot",
    description: "The mandatory party parrot",
    run: () => ({ lines: [], action: "parrot" }),
  },
  {
    name: "cd",
    description: "Change directory (scrolls to a section)",
    usage: "cd <section> — try: cd projects",
    run: (args, ctx) => {
      const target = (args[0] ?? "").replace(/\/$/, "").replace(/^~\//, "");
      if (!target || target === "~" || target === "/") {
        ctx.scrollTo("home");
        return { lines: [""] };
      }
      if ((SECTION_IDS as readonly string[]).includes(target)) {
        ctx.scrollTo(target);
        return { lines: [`→ ${target}/`] };
      }
      if (target === "blog" || target === "qa") {
        ctx.navigate(`/${target}`);
        return { lines: [`→ /${target}`] };
      }
      return { lines: [`cd: no such directory: ${target}  (try 'ls')`] };
    },
  },
  {
    name: "tree",
    description: "Directory tree of the portfolio",
    run: () => ({
      lines: [
        "~/thiru-portfolio",
        ...SECTION_IDS.map(
          (s, i) => `${i === SECTION_IDS.length - 1 ? "└──" : "├──"} ${s}/`
        ),
        `├── blog/  (${blogArticles.length} posts)`,
        `└── qa/    (${faqs.length} answers)`,
      ],
    }),
  },
  {
    name: "ping",
    description: "Check if Thiru is reachable",
    run: (args) => {
      const host = args[0] ?? "thiru";
      return {
        lines: [
          `PING ${host} (127.0.0.1): 56 data bytes`,
          `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.042 ms`,
          `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.038 ms`,
          `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.040 ms`,
          "",
          `--- ${host} ping statistics ---`,
          "3 packets transmitted, 3 received, 0.0% packet loss",
          `status: reachable — fastest route is ${site.email}`,
        ],
      };
    },
  },
  {
    name: "netstat",
    description: "Active connections",
    run: () => ({
      lines: [
        "Proto  Local Address      Foreign Address        State",
        "tcp    portfolio:443      github.com:https       ESTABLISHED",
        "tcp    portfolio:443      linkedin.com:https     ESTABLISHED",
        "tcp    portfolio:443      leetcode.com:https     ESTABLISHED",
        "tcp    portfolio:443      recruiter:anywhere     LISTENING",
      ],
    }),
  },
  {
    name: "hire",
    description: "Shortcut for the important command",
    run: (_a, ctx) => {
      ctx.scrollTo("contact");
      return {
        lines: [
          "Initiating hire sequence…",
          `  status:  ${site.available ? "OPEN TO OPPORTUNITIES" : "occupied"}`,
          `  contact: ${site.email}`,
          "→ Scrolled to the contact form. (Full ceremony: sudo hire thiru)",
        ],
      };
    },
  },
  {
    name: "exit",
    description: "Return to professional mode",
    run: (_a, ctx) => {
      ctx.setMode("professional");
      return { lines: ["logout"] };
    },
  },
];

export const COMMAND_NAMES = COMMANDS.map((c) => c.name);

/** Total number of terminal commands — derived, one source of truth. */
export const COMMAND_COUNT = COMMANDS.length;

export function findCommand(name: string): TerminalCommand | undefined {
  return COMMANDS.find((c) => c.name === name);
}

/** Nearest command for "did you mean" suggestions. */
export function suggestCommand(input: string): string | null {
  if (!input) return null;
  const prefix = COMMAND_NAMES.find((n) => n.startsWith(input));
  if (prefix) return prefix;
  let best: string | null = null;
  let bestDist = 3;
  for (const name of COMMAND_NAMES) {
    const d = levenshtein(input, name);
    if (d < bestDist) {
      bestDist = d;
      best = name;
    }
  }
  return best;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}
