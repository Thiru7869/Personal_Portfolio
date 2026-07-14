import Link from "next/link";
import { site } from "@/config/site";

/** 404 — terminal style, on brand. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="card-shell w-full max-w-lg overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-line/50 bg-surface/60 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <p className="ml-3 font-mono text-xs text-mute">bash — 404</p>
        </div>
        <div className="p-6 font-mono text-sm leading-relaxed">
          <p
            className="animate-glitch mb-3 text-2xl font-bold tracking-widest text-brand2"
            aria-hidden="true"
          >
            ░▒▓ 404 ▓▒░
          </p>
          <p className="text-term-accent">visitor@thiru:~$ cd {"<this-page>"}</p>
          <p className="mt-2 text-red-400">
            bash: cd: no such file or directory (404)
          </p>
          <p className="mt-4 text-mute">
            The page you asked for isn&apos;t in the tree. Everything that
            exists is reachable from the homepage — or ask the assistant.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary !py-2 text-xs">
              cd ~/
            </Link>
            <Link href="/blog" className="btn-ghost !py-2 text-xs">
              ls blog/
            </Link>
            <a href={`mailto:${site.email}`} className="btn-ghost !py-2 text-xs">
              mail thiru
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
