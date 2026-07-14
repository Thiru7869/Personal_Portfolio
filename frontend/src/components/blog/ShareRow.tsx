"use client";

import { useState } from "react";
import { Check, Link2, Share2, Twitter } from "lucide-react";

/** ShareRow — native share, X intent, and copy-link for articles. */
export function ShareRow({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the X intent still works.
    }
  }

  function nativeShare() {
    if (navigator.share) {
      void navigator.share({ title, url }).catch(() => undefined);
    } else {
      void copy();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-widest text-mute">
        share
      </span>
      <button type="button" onClick={nativeShare} className="btn-ghost !px-3 !py-1.5 text-xs">
        <Share2 size={13} aria-hidden="true" /> Share
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost !px-3 !py-1.5 text-xs"
      >
        <Twitter size={13} aria-hidden="true" /> Post on X
      </a>
      <button type="button" onClick={copy} className="btn-ghost !px-3 !py-1.5 text-xs">
        {copied ? (
          <Check size={13} className="text-brand2" aria-hidden="true" />
        ) : (
          <Link2 size={13} aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
