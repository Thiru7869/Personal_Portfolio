"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Code2, Github, Heart, Linkedin, Mail, RotateCcw, TerminalSquare, Twitter } from "lucide-react";
import { footerLinks } from "@/config/navigation";
import { site, socialLinks } from "@/config/site";
import { scrollToSection } from "@/lib/utils";

const iconFor = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  leetcode: Code2,
  email: Mail,
} as const;

type NewsletterStatus = "idle" | "sending" | "done" | "error";

/** Footer newsletter signup — stores to Supabase via /api/newsletter. */
function NewsletterForm() {
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          res.status === 503
            ? "Signups open once the database is connected — email me instead."
            : (body?.error ?? "Couldn't save that — try again.")
        );
      }
      setStatus("done");
      setMessage("You're in. Occasional posts, zero spam.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <label
        htmlFor="newsletter-email"
        className="mb-2 block font-mono text-xs uppercase tracking-widest text-mute"
      >
        Newsletter
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          maxLength={150}
          placeholder="you@company.com"
          className="w-full min-w-0 rounded-xl border border-line bg-card px-3.5 py-2 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary shrink-0 !px-4 !py-2 text-xs disabled:opacity-60"
        >
          {status === "sending" ? "…" : "Join"}
        </button>
      </div>
      {message && (
        <p
          role="status"
          className={`mt-2 text-xs ${status === "error" ? "text-red-400" : "text-brand2"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

/**
 * Footer — quick links, socials, dynamic year.
 */
export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const year = new Date().getFullYear();

  function go(target: string) {
    if (pathname === "/") scrollToSection(target);
    else router.push(`/#${target}`);
  }

  return (
    <footer className="border-t border-line/60 bg-surface/60">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-mono text-sm font-bold">
            <TerminalSquare size={17} className="text-brand" aria-hidden="true" />
            {site.shortName.toLowerCase()}
            <span className="text-brand">@</span>portfolio
          </p>
          <p className="mt-3 max-w-sm text-sm text-mute">
            {site.roles.join(" · ")}. Built with Next.js, TypeScript, and an
            unreasonable attention to detail — five experience modes and a
            working terminal included.
          </p>
          <p className="mt-4 font-mono text-xs text-mute">
            {site.location} · {site.email}
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">
            Quick links
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {footerLinks.map((item) => (
              <li key={item.label}>
                {item.target.startsWith("/") ? (
                  <Link
                    href={item.target}
                    className="text-sm text-mute transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => go(item.target)}
                    className="text-sm text-mute transition-colors hover:text-brand"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-mute">
            Elsewhere
          </h3>
          <ul className="flex gap-2">
            {socialLinks
              .filter((s) => s.id in iconFor)
              .map((s) => {
                const Icon = iconFor[s.id as keyof typeof iconFor];
                return (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-card/60 text-mute transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand"
                    >
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
          </ul>
          <p className="mt-6 font-mono text-xs text-mute">
            $ echo &quot;open to work&quot;
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("replay-boot"))}
            className="mt-2 flex items-center gap-1.5 font-mono text-xs text-mute transition-colors hover:text-brand"
          >
            <RotateCcw size={11} aria-hidden="true" />
            Replay intro
          </button>

          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-line/40">
        <div className="section-shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-mute sm:flex-row">
          <p className="font-mono">
            <span className="text-brand/70" aria-hidden="true">
              &gt;_{" "}
            </span>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 font-mono">
            <span className="chip !px-2 !py-0.5 text-[10px]">v2.0</span>
            <span className="flex items-center gap-1.5" aria-label="Status: all systems operational">
              <span className="h-1.5 w-1.5 rounded-full bg-brand2" aria-hidden="true" />
              all systems operational
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            Crafted with
            <Heart size={12} className="text-brand" aria-hidden="true" />
            <span className="sr-only">love</span>
            in {site.location.split(",")[0]} — no templates were harmed.
          </p>
        </div>
      </div>
    </footer>
  );
}
