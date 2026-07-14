"use client";

/**
 * Global error boundary — last line of defence when even the
 * root layout fails. Must render its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#080f1f",
          color: "#e2e9f6",
          fontFamily: "monospace",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <p style={{ color: "#f87171" }}>fatal: application error</p>
          <h1 style={{ fontSize: 22, margin: "16px 0" }}>
            The whole app hit a wall. That&apos;s on me.
          </h1>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#3b82f6",
              color: "#080f1f",
              border: "none",
              borderRadius: 10,
              padding: "10px 22px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Restart
          </button>
          {error.digest && (
            <p style={{ fontSize: 10, marginTop: 20, color: "#8ba0c4" }}>
              ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
