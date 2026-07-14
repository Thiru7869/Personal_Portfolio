import { NextResponse } from "next/server";
import { site } from "@/config/site";

/**
 * GET /api/github — public GitHub profile stats, cached for an
 * hour so the free unauthenticated API limit (60/hr) is never a
 * concern. Returns nulls on failure; the UI degrades to links.
 */

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUsername}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const data = await res.json();

    return NextResponse.json(
      {
        repos: data.public_repos ?? null,
        followers: data.followers ?? null,
        avatar: data.avatar_url ?? null,
        createdAt: data.created_at ?? null,
      },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (err) {
    console.error("GET /api/github — upstream fetch failed:", err);
    return NextResponse.json(
      { repos: null, followers: null, avatar: null, createdAt: null },
      { status: 200 }
    );
  }
}
