"use client";

import { useEffect } from "react";

/**
 * Route error boundary — catches render/runtime errors in any
 * page and offers recovery instead of a white screen.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in logs (Vercel captures console.error server+client).
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="card-shell w-full max-w-lg p-8 text-center">
        <p className="font-mono text-sm text-red-400">
          kernel panic — just kidding, a component crashed.
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold">
          Something broke on my side
        </h1>
        <p className="mt-3 text-sm text-mute">
          The error is logged and I&apos;ll see it. You can retry, or head
          back to the homepage — the rest of the site is unaffected.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary !py-2 text-xs">
            Try again
          </button>
          <button
            type="button"
            // Hard reload on purpose: after a crash, client-side
            // navigation may carry the broken state along.
            onClick={() => window.location.assign("/")}
            className="btn-ghost !py-2 text-xs"
          >
            Go home
          </button>
        </div>
        {error.digest && (
          <p className="mt-5 font-mono text-[10px] text-mute">
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
