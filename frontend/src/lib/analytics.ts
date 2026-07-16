"use client";

/**
 * src/lib/analytics.ts
 * ------------------------------------------------------------
 * Lightweight first-party event tracking. Events are POSTed to
 * /api/track and stored in Supabase (analytics_events table),
 * powering the "Portfolio Insights" section. Fire-and-forget:
 * failures never affect the UI. Vercel Analytics and GA run
 * independently of this.
 */

export type AnalyticsEvent =
  | { type: "page_view"; path: string }
  | { type: "resume_download" }
  | { type: "project_view"; slug: string }
  | { type: "contact_submit" }
  | { type: "rating_submit" }
  | { type: "chat_opened" }
  | { type: "terminal_command"; command: string }
  | { type: "game_played" };

export function trackEvent(event: AnalyticsEvent): void {
  try {
    const body = JSON.stringify(event);
    // sendBeacon survives page navigation; fetch is the fallback.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([body], { type: "application/json" })
      );
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // Analytics must never break the experience.
  }
}
