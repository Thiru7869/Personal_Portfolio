import { describe, expect, it } from "vitest";
import { featuredProjects, miniProjects, projects } from "./projects";

/**
 * Guards the V4 audit invariant: every showcased project maps to a
 * real, public GitHub repository. These tests exist specifically to
 * prevent regressing to fabricated/placeholder projects — if someone
 * adds a project without a github link, or a non-Thiru7869 repo, the
 * suite fails loudly.
 */

const GH_USER = "https://github.com/Thiru7869/";

describe("projects — real-repo invariant", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every main project links to a real github.com/Thiru7869 repo", () => {
    for (const p of projects) {
      expect(p.github, `${p.slug} must have a github link`).toBeTruthy();
      expect(p.github!.startsWith(GH_USER), `${p.slug} github must be under Thiru7869`).toBe(true);
    }
  });

  it("every live demo is an https URL", () => {
    for (const p of projects) {
      if (p.liveDemo) expect(p.liveDemo.startsWith("https://")).toBe(true);
    }
  });

  it("has no duplicate slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project carries a full case study (no empty fields)", () => {
    for (const p of projects) {
      expect(p.title.length, `${p.slug} title`).toBeGreaterThan(0);
      expect(p.problem.length, `${p.slug} problem`).toBeGreaterThan(20);
      expect(p.solution.length, `${p.slug} solution`).toBeGreaterThan(20);
      expect(p.architecture.length, `${p.slug} architecture`).toBeGreaterThan(20);
      expect(p.challenges.length, `${p.slug} challenges`).toBeGreaterThanOrEqual(3);
      expect(p.learnings.length, `${p.slug} learnings`).toBeGreaterThanOrEqual(3);
      expect(p.techStack.length, `${p.slug} techStack`).toBeGreaterThanOrEqual(3);
      expect(p.features.length, `${p.slug} features`).toBeGreaterThanOrEqual(3);
    }
  });

  it("featuredProjects is derived from the featured flag", () => {
    expect(featuredProjects).toEqual(projects.filter((p) => p.featured));
  });

  it("every mini project links to a real github.com/Thiru7869 repo", () => {
    expect(miniProjects.length).toBeGreaterThan(0);
    for (const m of miniProjects) {
      expect(m.github.startsWith(GH_USER), `${m.name} github must be under Thiru7869`).toBe(true);
      expect(m.tech.length, `${m.name} tech`).toBeGreaterThan(0);
    }
  });
});
