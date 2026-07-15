"use client";

import { site } from "@/config/site";

/**
 * src/components/modes/ResumeViewer.tsx
 * ------------------------------------------------------------
 * Resume content for the desktop's "resume" window. site.resumeUrl
 * is a Google Drive share link (…/file/d/ID/view) — Drive serves
 * an embeddable viewer at the same path with /preview instead of
 * /view, no API key needed, so this stays free-tier and avoids
 * escaping to a new browser tab.
 */
function toPreviewUrl(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

const PREVIEW_SRC = toPreviewUrl(site.resumeUrl);

export function ResumeViewer({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-full w-full flex-col bg-surface ${className}`}>
      <iframe
        src={PREVIEW_SRC}
        title="Resume preview"
        className="w-full flex-1 border-0"
      />
      <div className="flex shrink-0 items-center justify-between border-t border-line/60 bg-surface/90 px-3 py-1.5">
        <p className="font-mono text-[11px] text-mute">resume.pdf</p>
        <a
          href={site.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-brand hover:underline"
        >
          Open in Google Drive ↗
        </a>
      </div>
    </div>
  );
}
