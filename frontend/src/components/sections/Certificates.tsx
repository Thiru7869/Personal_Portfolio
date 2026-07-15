"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Download, ExternalLink, Maximize2, Trophy, X } from "lucide-react";
import type { Certificate } from "@shared/types";
import { achievements, certificates } from "@/content/certificates";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { SectionBackdrop } from "@/components/layout/SectionBackdrop";

/**
 * Certificates — gallery with fullscreen preview and download.
 * Data in src/content/certificates.ts; images live in
 * frontend/public/certificates/ (or Cloudinary URLs). The
 * preview dialog uses useFocusTrap for WCAG focus management.
 */
export function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null);
  const close = useCallback(() => setActive(null), []);
  const dialogRef = useFocusTrap<HTMLDivElement>(!!active, close);

  return (
    <section id="certificates" aria-label="Certificates" className="section-pad">
      <SectionBackdrop kind="dotted" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="achievements"
          title="Achievements & Certifications"
          lede="Milestones first, paperwork second — every certificate links to the verifiable document on Google Drive."
        />

        {/* Achievements strip */}
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05}>
              <div className="card-shell h-full p-4">
                <Trophy size={15} className="mb-2 text-brand" aria-hidden="true" />
                <p className="text-sm font-semibold leading-snug">{a.title}</p>
                <p className="mt-1 text-xs text-mute">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal key={cert.id} delay={(i % 3) * 0.06}>
              <li className="card-shell group h-full overflow-hidden transition-all duration-300 hover:border-brand/40 hover:shadow-glow">
                <button
                  type="button"
                  onClick={() => setActive(cert)}
                  className="block w-full text-left"
                  aria-label={`Preview certificate: ${cert.title}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line/50 bg-surface">
                    <Image
                      src={cert.image}
                      alt={`${cert.title} certificate from ${cert.issuer}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      unoptimized={cert.image.endsWith(".svg")}
                    />
                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-bg/80 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                      <Maximize2 size={14} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="flex items-center gap-1.5 font-mono text-xs text-mute">
                      <Award size={11} className="text-brand" aria-hidden="true" />
                      {cert.issuer} · {cert.date}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold leading-snug">
                      {cert.title}
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {cert.skills.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Certificate: ${active.title}`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line/60 bg-surface">
                <Image
                  src={active.image}
                  alt={`${active.title} certificate from ${active.issuer}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 768px"
                  className="object-contain"
                  priority
                  unoptimized={active.image.endsWith(".svg")}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {active.title}
                  </h3>
                  <p className="text-sm text-white/60">
                    {active.issuer} · {active.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={active.image}
                    download
                    className="btn-ghost !py-2 text-xs"
                  >
                    <Download size={13} aria-hidden="true" /> Download
                  </a>
                  {active.url && (
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary !py-2 text-xs"
                    >
                      <ExternalLink size={13} aria-hidden="true" /> Verify
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close certificate preview"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-mute transition-all duration-200 hover:border-brand/60 hover:text-brand active:scale-[0.98]"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
