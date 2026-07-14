"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * FloatingBack — fixed back button on subpages (blog articles,
 * projects, Q&A). Uses browser history when it exists, falls
 * back to the given href.
 */
export function FloatingBack({ href = "/", label = "Back" }: { href?: string; label?: string }) {
  const router = useRouter();

  function goBack(e: React.MouseEvent) {
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  }

  return (
    <Link
      href={href}
      onClick={goBack}
      aria-label={label}
      className="card-shell fixed left-4 top-20 z-40 hidden items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-mute transition-all hover:-translate-x-0.5 hover:border-brand/50 hover:text-brand md:flex"
    >
      <ArrowLeft size={13} aria-hidden="true" />
      {label}
    </Link>
  );
}
