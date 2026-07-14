"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, FileText, FolderOpen, GraduationCap, Search, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { site } from "@/config/site";
import { useChat } from "@/lib/use-chat";
import { useExperience } from "@/lib/theme-context";
import { searchFaqs } from "@/content/faq";
import { articleCards } from "@/content/blog";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";
import { AppearanceToggle } from "@/components/layout/ThemeSwitcher";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { AbstractMesh } from "@/components/illustrations/AbstractMesh";

const GREETING = `[AI::ONLINE] Welcome to the **AI Workspace** — the whole site, as a conversation. I'm grounded in ${site.shortName}'s real portfolio: projects, research paper, resume, blog posts, and Q&A. Ask anything, or pick a prompt from the left.`;

const PROMPT_LIBRARY: { group: string; icon: typeof Bot; prompts: string[] }[] = [
  {
    group: "Resume Q&A",
    icon: FileText,
    prompts: [
      "Summarize his resume in five bullet points",
      "Is he a fit for a backend engineering role?",
      "What's his experience with Python and FastAPI?",
    ],
  },
  {
    group: "Projects Q&A",
    icon: FolderOpen,
    prompts: [
      "Walk me through the Portfolio V2 full-stack platform",
      "How is the Library Management System's role model built?",
      "Which project best shows his backend skills?",
    ],
  },
  {
    group: "Research Q&A",
    icon: GraduationCap,
    prompts: [
      "Explain his published research paper simply",
      "What did the ECG project contribute?",
      "How does the research make him a better engineer?",
    ],
  },
  {
    group: "Blog Q&A",
    icon: Search,
    prompts: [
      "What does he write about on his blog?",
      "Summarize his post about learning Docker",
      "What's his approach to learning new technologies?",
    ],
  },
];

/**
 * AiWorkspace — AI mode's takeover: the entire page becomes a
 * streaming assistant with a prompt library and instant
 * portfolio search across projects, articles, and Q&A.
 */
export function AiWorkspace() {
  const { setMode } = useExperience();
  const router = useRouter();
  const { messages, send, busy, streaming } = useChat(GREETING);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const projectHits = projects
      .filter((p) => `${p.title} ${p.techStack.join(" ")}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({ kind: "Project", label: p.title, action: () => send(`Tell me about the project "${p.title}"`) }));
    const blogHits = articleCards
      .filter((a) => `${a.title} ${a.tags.join(" ")}`.toLowerCase().includes(q))
      .slice(0, 3)
      .map((a) => ({ kind: "Blog", label: a.title, action: () => router.push(`/blog/${a.slug}`) }));
    const faqHits = searchFaqs(q)
      .slice(0, 3)
      .map((f) => ({ kind: "Q&A", label: f.question, action: () => send(f.question) }));
    return [...projectHits, ...blogHits, ...faqHits];
  }, [searchQuery, send, router]);

  function submit(text: string) {
    setInput("");
    setSearchQuery("");
    void send(text);
  }

  return (
    <div
      role="application"
      aria-label="AI Workspace mode"
      className="fixed inset-0 z-[60] flex flex-col bg-bg"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-line/70 bg-surface/80 px-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Bot size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI Workspace</p>
            <p className="text-[11px] text-mute">
              grounded in {site.name}&apos;s portfolio · streaming
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AppearanceToggle />
          <button
            type="button"
            onClick={() => setMode("professional")}
            className="btn-ghost !px-3 !py-1.5 text-xs"
          >
            <X size={13} aria-hidden="true" /> exit workspace
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Prompt library + search */}
        <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-r border-line/70 bg-surface/50 p-4 lg:flex">
          <AbstractMesh
            className="mb-3 h-16 w-full rounded-xl opacity-60"
            id="ai-workspace"
          />
          <div className="relative mb-4">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the portfolio…"
              aria-label="Search the portfolio"
              className="w-full rounded-xl border border-line bg-card py-2 pl-9 pr-3 text-sm focus:border-brand/60 focus:outline-none"
            />
          </div>

          {searchResults ? (
            <div className="space-y-1.5" aria-live="polite">
              <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                {searchResults.length} results
              </p>
              {searchResults.length === 0 && (
                <p className="text-xs text-mute">
                  Nothing matched — ask the assistant instead, it knows everything here.
                </p>
              )}
              {searchResults.map((r) => (
                <button
                  key={`${r.kind}-${r.label}`}
                  type="button"
                  onClick={r.action}
                  className="block w-full rounded-xl border border-line/70 bg-card px-3 py-2 text-left text-xs transition-colors hover:border-brand/50"
                >
                  <span className="font-mono text-[10px] text-brand">{r.kind}</span>
                  <span className="block text-ink">{r.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {PROMPT_LIBRARY.map((group) => (
                <div key={group.group}>
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-mute">
                    <group.icon size={11} aria-hidden="true" />
                    {group.group}
                  </p>
                  <div className="space-y-1.5">
                    {group.prompts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => submit(p)}
                        className="block w-full rounded-xl border border-line/70 bg-card px-3 py-2 text-left text-xs text-mute transition-colors hover:border-brand/50 hover:text-brand"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Conversation */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <SectionBackdrop kind="mesh" />
          <div
            ref={scrollRef}
            className="relative z-[1] flex-1 space-y-5 overflow-y-auto p-4 sm:p-8"
            aria-live="polite"
          >
            <div className="mx-auto w-full max-w-2xl space-y-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[92%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto rounded-br-md bg-brand text-bg"
                      : "rounded-bl-md border border-line/70 bg-card shadow-card"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="chat-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || "…"}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              ))}
              {busy && !streaming && (
                <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-line/70 bg-card px-5 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand"
                      style={{ animationDelay: `${d * 0.18}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="relative z-[1] border-t border-line/70 bg-surface/60 p-4"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={800}
                placeholder="Ask about the resume, projects, research paper, blogs…"
                aria-label="Message the AI Workspace"
                className="flex-1 rounded-xl border border-line bg-card px-4 py-3 text-sm focus:border-brand/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-bg transition-all hover:brightness-110 disabled:opacity-40"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
