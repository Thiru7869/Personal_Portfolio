"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowLeft,
  FileEdit,
  Inbox,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { getAnonSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn, formatDate } from "@/lib/utils";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { blogArticles } from "@/content/blog";
import { faqs } from "@/content/faq";
import { certificates } from "@/content/certificates";
import { testimonials } from "@/content/testimonials";
import { skillGroups } from "@/content/skills";

/**
 * /admin — the CMS.
 *
 * Dynamic data (messages, ratings, analytics) lives in Supabase
 * and is managed right here after signing in with the admin
 * account. Editorial content (projects, blogs, Q&A, skills…)
 * is content-as-code: the Content Studio tab maps every domain
 * to its exact file so edits are one click away in your editor,
 * type-checked, and versioned in git.
 */

interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  delivered_via: string;
  read: boolean;
  created_at: string;
}

interface AdminRating {
  id: string;
  score: number;
  feedback: string | null;
  created_at: string;
}

type Tab = "overview" | "messages" | "ratings" | "content";

const CONTENT_MAP: { domain: string; file: string; count: number; note: string }[] = [
  { domain: "Projects", file: "frontend/src/content/projects.ts", count: projects.length, note: "Cards, quick-view modal, terminal, AI knowledge" },
  { domain: "Experience", file: "frontend/src/content/experience.ts", count: experience.length, note: "Timeline (newest first)" },
  { domain: "Education", file: "frontend/src/content/education.ts", count: education.length, note: "No GPA by design" },
  { domain: "Blog articles", file: "frontend/src/content/blog/articles-*.ts", count: blogArticles.length, note: "Pages, TOC, covers, and sitemap auto-generate" },
  { domain: "FAQ (Q&A)", file: "frontend/src/content/faq/faq-*.ts", count: faqs.length, note: "Search, categories, and homepage preview auto-update" },
  { domain: "Skills", file: "frontend/src/content/skills.ts", count: skillGroups.reduce((n, g) => n + g.skills.length, 0), note: "Each links to Wikipedia" },
  { domain: "Certificates", file: "frontend/src/content/certificates.ts", count: certificates.length, note: "Images in frontend/public/certificates/" },
  { domain: "Testimonials", file: "frontend/src/content/testimonials.ts", count: testimonials.length, note: "Keep to the best three" },
  { domain: "Research paper", file: "frontend/src/content/research.ts", count: 1, note: "PDF at frontend/public/research/paper.pdf" },
  { domain: "AI knowledge", file: "frontend/src/content/ai-knowledge.ts", count: 1, note: "Auto-compiled + EXTRA_KNOWLEDGE facts" },
  { domain: "Terminal commands", file: "frontend/src/lib/terminal-commands.ts", count: 28, note: "Add to COMMANDS — help updates itself" },
  { domain: "Modes & appearance", file: "frontend/src/app/globals.css + src/config/modes.ts", count: 5, note: "Tokens per [data-mode] × [data-appearance]" },
  { domain: "Site settings", file: "frontend/src/config/site.ts", count: 1, note: "Name, contacts, socials, resume, availability" },
];

export default function AdminPage() {
  const supabase = useMemo(() => getAnonSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [ratings, setRatings] = useState<AdminRating[]>([]);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const authedFetch = useCallback(
    async (input: string, init?: RequestInit) => {
      const token = session?.access_token;
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [session]
  );

  const loadData = useCallback(async () => {
    if (!session) return;
    setDataError("");
    try {
      const [msgRes, ratingRes] = await Promise.all([
        authedFetch("/api/admin/messages"),
        authedFetch("/api/admin/ratings"),
      ]);
      if (!msgRes.ok || !ratingRes.ok) {
        const body = await msgRes.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to load admin data.");
      }
      setMessages((await msgRes.json()).messages ?? []);
      setRatings((await ratingRes.json()).ratings ?? []);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Failed to load admin data.");
    }
  }, [session, authedFetch]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    if (!supabase || signingIn) return;
    setSigningIn(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setSigningIn(false);
  }

  async function toggleRead(msg: AdminMessage) {
    await authedFetch("/api/admin/messages", {
      method: "PATCH",
      body: JSON.stringify({ id: msg.id, read: !msg.read }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
    );
  }

  async function deleteMessage(id: string) {
    await authedFetch("/api/admin/messages", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  async function deleteRating(id: string) {
    await authedFetch("/api/admin/ratings", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setRatings((prev) => prev.filter((r) => r.id !== id));
  }

  /* ---------- Render states ---------- */

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="skeleton h-40 w-full max-w-sm rounded-2xl" aria-label="Loading" />
      </div>
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="card-shell max-w-md p-8 text-center">
          <ShieldCheck size={24} className="mx-auto mb-3 text-brand" aria-hidden="true" />
          <h1 className="font-display text-xl font-bold">Admin needs Supabase</h1>
          <p className="mt-3 text-sm text-mute">
            Set <code className="font-mono text-brand">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="font-mono text-brand">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,{" "}
            <code className="font-mono text-brand">SUPABASE_SERVICE_ROLE_KEY</code> and{" "}
            <code className="font-mono text-brand">ADMIN_EMAIL</code>, then follow{" "}
            <span className="font-mono">docs/SUPABASE_SETUP.md</span> step by step.
          </p>
          <Link href="/" className="btn-ghost mt-6 !py-2 text-xs">
            <ArrowLeft size={13} aria-hidden="true" /> back to site
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <form onSubmit={handleSignIn} className="card-shell w-full max-w-sm p-8">
          <ShieldCheck size={24} className="mb-3 text-brand" aria-hidden="true" />
          <h1 className="font-display text-xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-xs text-mute">
            Supabase Auth — only the configured admin account gets past the API.
          </p>

          <label htmlFor="admin-email" className="mt-6 block text-xs font-medium text-mute">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm focus:border-brand/60 focus:outline-none"
          />

          <label htmlFor="admin-password" className="mt-4 block text-xs font-medium text-mute">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm focus:border-brand/60 focus:outline-none"
          />

          {authError && (
            <p className="mt-3 text-xs text-red-400" role="alert">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={signingIn}
            className="btn-primary mt-5 w-full disabled:opacity-60"
          >
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
          <Link
            href="/"
            className="mt-4 block text-center text-xs text-mute hover:text-brand"
          >
            ← back to the portfolio
          </Link>
        </form>
      </div>
    );
  }

  const unread = messages.filter((m) => !m.read).length;
  const avgRating = ratings.length
    ? (ratings.reduce((n, r) => n + r.score, 0) / ratings.length).toFixed(1)
    : "—";

  const tabs: { id: Tab; label: string; icon: typeof Inbox }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "messages", label: `Messages${unread ? ` (${unread})` : ""}`, icon: Inbox },
    { id: "ratings", label: "Ratings", icon: Star },
    { id: "content", label: "Content Studio", icon: FileEdit },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Portfolio Admin</h1>
          <p className="mt-1 text-xs text-mute">
            signed in as {session.user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="btn-ghost !py-2 text-xs">
            <ArrowLeft size={13} aria-hidden="true" /> view site
          </Link>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="btn-ghost !py-2 text-xs"
          >
            <LogOut size={13} aria-hidden="true" /> sign out
          </button>
        </div>
      </header>

      <nav aria-label="Admin sections" className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors",
                tab === t.id
                  ? "border-brand/50 bg-brand/12 text-brand"
                  : "border-line text-mute hover:text-ink"
              )}
            >
              <Icon size={14} aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {dataError && (
        <p className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400" role="alert">
          {dataError}
        </p>
      )}

      {tab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card-shell p-6">
            <p className="text-xs text-mute">Contact messages</p>
            <p className="mt-1 font-display text-3xl font-bold">{messages.length}</p>
            <p className="mt-1 text-xs text-brand2">{unread} unread</p>
          </div>
          <div className="card-shell p-6">
            <p className="text-xs text-mute">Ratings received</p>
            <p className="mt-1 font-display text-3xl font-bold">{ratings.length}</p>
            <p className="mt-1 text-xs text-brand2">average {avgRating}/5</p>
          </div>
          <div className="card-shell p-6">
            <p className="text-xs text-mute">Content domains</p>
            <p className="mt-1 font-display text-3xl font-bold">{CONTENT_MAP.length}</p>
            <p className="mt-1 text-xs text-brand2">managed as code, in git</p>
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="card-shell p-8 text-center text-sm text-mute">
              Inbox zero. When the contact form is used, messages appear here.
            </p>
          )}
          {messages.map((msg) => (
            <article
              key={msg.id}
              className={cn(
                "card-shell p-5",
                !msg.read && "border-brand/40"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{msg.subject}</h2>
                  <p className="mt-0.5 text-xs text-mute">
                    {msg.name} · <a className="text-brand2 hover:underline" href={`mailto:${msg.email}`}>{msg.email}</a> ·{" "}
                    {formatDate(msg.created_at.slice(0, 10))} · via {msg.delivered_via}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead(msg)}
                    className="btn-ghost !px-3 !py-1.5 text-xs"
                  >
                    {msg.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMessage(msg.id)}
                    aria-label={`Delete message from ${msg.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-mute hover:border-red-400/60 hover:text-red-400"
                  >
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/90">{msg.message}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "ratings" && (
        <div className="space-y-3">
          {ratings.length === 0 && (
            <p className="card-shell p-8 text-center text-sm text-mute">
              No ratings yet — share the site and watch this fill up.
            </p>
          )}
          {ratings.map((r) => (
            <article key={r.id} className="card-shell flex items-start justify-between gap-4 p-5">
              <div>
                <p className="flex items-center gap-1 text-brand" aria-label={`${r.score} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < r.score ? "fill-brand" : "text-line"}
                      aria-hidden="true"
                    />
                  ))}
                </p>
                {r.feedback && (
                  <p className="mt-2 text-sm text-ink/90">“{r.feedback}”</p>
                )}
                <p className="mt-1.5 text-xs text-mute">
                  {formatDate(r.created_at.slice(0, 10))}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteRating(r.id)}
                aria-label="Delete rating"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-mute hover:border-red-400/60 hover:text-red-400"
              >
                <Trash2 size={13} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      )}

      {tab === "content" && (
        <div>
          <p className="mb-5 max-w-2xl text-sm text-mute">
            Editorial content is <strong className="text-ink">content-as-code</strong>:
            each domain below lives in one typed file, so edits are
            spell-checked by TypeScript, reviewed in git, and deployed by a
            push — no second database to keep in sync. Open the file, edit,
            commit.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line/60 font-mono text-xs uppercase tracking-wider text-mute">
                  <th className="px-3 py-2.5">Domain</th>
                  <th className="px-3 py-2.5">Entries</th>
                  <th className="px-3 py-2.5">Edit here</th>
                  <th className="px-3 py-2.5">Feeds</th>
                </tr>
              </thead>
              <tbody>
                {CONTENT_MAP.map((row) => (
                  <tr key={row.domain} className="border-b border-line/30">
                    <td className="px-3 py-3 font-medium">{row.domain}</td>
                    <td className="px-3 py-3 text-mute">{row.count}</td>
                    <td className="px-3 py-3">
                      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-brand2">
                        {row.file}
                      </code>
                    </td>
                    <td className="px-3 py-3 text-xs text-mute">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-xs text-mute">
            Full editing walkthroughs live in <code className="font-mono">docs/CUSTOMIZATION_GUIDE.md</code>.
          </p>
        </div>
      )}
    </div>
  );
}
