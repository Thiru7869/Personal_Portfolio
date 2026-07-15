"use client";

import { useState, type FormEvent } from "react";
import {
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { site, socialLinks } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";
import { Magnetic } from "@/components/ui/Magnetic";

const channelIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  leetcode: Code2,
  email: Mail,
  whatsapp: MessageCircle,
  phone: Phone,
} as const;

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Contact — working form (SMTP with Web3Forms fallback via
 * /api/contact), direct channels, availability, and a map.
 * Contact details live in src/config/site.ts.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          body?.error ??
            (res.status === 429
              ? "Too many messages just now — give it a few minutes."
              : "Something went wrong sending that.")
        );
      }
      trackEvent({ type: "contact_submit" });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" aria-label="Contact" className="section-pad">
      <SectionBackdrop kind="constellation" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="contact"
          title="Let's Talk"
          lede="Role, project, collaboration, or a question about the research — every message lands in my inbox."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit} className="card-shell relative p-7 sm:p-8">
              {status === "sent" ? (
                <div className="py-10 text-center" aria-live="polite">
                  <Send size={26} className="mx-auto mb-4 text-brand2" aria-hidden="true" />
                  <h3 className="font-display text-xl font-semibold">
                    Message delivered.
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-mute">
                    Thanks for reaching out — I usually reply within a day.
                    If it&apos;s urgent, WhatsApp is faster.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="btn-ghost mt-6 !py-2 text-xs"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-mute">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        className="w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-mute">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        maxLength={150}
                        autoComplete="email"
                        className="w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-mute">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      maxLength={150}
                      className="w-full rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
                      placeholder="Role at Acme / project idea / hello"
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-mute">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      minLength={10}
                      maxLength={3000}
                      rows={5}
                      className="w-full resize-y rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-mute/60 focus:border-brand/60 focus:outline-none"
                      placeholder="What are we building?"
                    />
                  </div>

                  {/* Honeypot — humans never see it, bots fill it. */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="contact-company">Company</label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status === "error" && (
                    <p className="mt-3 text-xs text-red-400" role="alert">
                      {errorMsg}
                    </p>
                  )}

                  <Magnetic strength={8} className="mt-5 block w-full sm:inline-block sm:w-auto">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                    >
                      <Send size={15} aria-hidden="true" />
                      {status === "sending" ? "Sending…" : "Send message"}
                    </button>
                  </Magnetic>
                </>
              )}
            </form>
          </Reveal>

          {/* Direct channels */}
          <div className="space-y-5">
            <Reveal delay={0.08}>
              <div className="card-shell p-6">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-mute">
                  direct channels
                </h3>
                <ul className="grid grid-cols-2 gap-2.5">
                  {socialLinks.map((s) => {
                    const Icon = channelIcons[s.id];
                    return (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          target={s.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface/50 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-brand/50"
                        >
                          <Icon size={16} className="shrink-0 text-brand" aria-hidden="true" />
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold">{s.label}</span>
                            <span className="block truncate text-[11px] text-mute">
                              {s.handle}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                {site.available && (
                  <p className="mt-4 flex items-center gap-2 rounded-xl border border-brand2/30 bg-brand2/10 px-3.5 py-2.5 text-xs text-brand2">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-brand2 opacity-60" />
                      <span className="relative h-2 w-2 rounded-full bg-brand2" />
                    </span>
                    {site.availabilityText} — responses within 24h, {site.timezone}.
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="card-shell overflow-hidden">
                <iframe
                  src={site.mapEmbedUrl}
                  title={`Map of ${site.location}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full border-0 grayscale-[0.4] contrast-[0.9]"
                />
                <p className="flex items-center gap-1.5 px-5 py-3 text-xs text-mute">
                  <MapPin size={12} className="text-brand" aria-hidden="true" />
                  {site.location} — remote-friendly, relocation-ready.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
