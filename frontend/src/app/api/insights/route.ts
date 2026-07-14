import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * GET /api/insights — aggregates analytics_events into the
 * numbers shown by the "Portfolio Insights" section: totals,
 * top projects, countries, and devices.
 */

interface EventRow {
  event_type: string;
  slug: string | null;
  country: string | null;
  device: string | null;
}

function countBy(rows: EventRow[], key: "country" | "device") {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = row[key];
    if (!value || value === "Unknown") continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Insights not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_type, slug, country, device")
    .order("created_at", { ascending: false })
    .limit(10000);

  if (error) {
    console.error("GET /api/insights — Supabase read failed:", error);
    return NextResponse.json({ error: "Failed to load insights" }, { status: 500 });
  }

  const rows = data as EventRow[];
  const pageViews = rows.filter((r) => r.event_type === "page_view");

  const projectCounts = new Map<string, number>();
  for (const row of rows) {
    if (row.event_type === "project_view" && row.slug) {
      projectCounts.set(row.slug, (projectCounts.get(row.slug) ?? 0) + 1);
    }
  }

  return NextResponse.json(
    {
      totalViews: pageViews.length,
      resumeDownloads: rows.filter((r) => r.event_type === "resume_download").length,
      terminalCommands: rows.filter((r) => r.event_type === "terminal_command").length,
      chatSessions: rows.filter((r) => r.event_type === "chat_opened").length,
      topProjects: [...projectCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, views]) => ({ slug, views })),
      countries: countBy(pageViews, "country"),
      devices: countBy(pageViews, "device"),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
