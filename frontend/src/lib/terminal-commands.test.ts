import { describe, it, expect } from "vitest";
import {
  COMMANDS,
  COMMAND_NAMES,
  COMMAND_COUNT,
  findCommand,
  suggestCommand,
  normalizeSlashInput,
} from "./terminal-commands";

describe("command registry", () => {
  it("COMMAND_COUNT matches the registry length (single source of truth)", () => {
    expect(COMMAND_COUNT).toBe(COMMANDS.length);
    expect(COMMAND_NAMES.length).toBe(COMMANDS.length);
  });

  it("has unique command names", () => {
    expect(new Set(COMMAND_NAMES).size).toBe(COMMAND_NAMES.length);
  });

  it("advertises at least 30 commands (matches the UI copy)", () => {
    expect(COMMAND_COUNT).toBeGreaterThanOrEqual(30);
  });

  it("resolves a known command and rejects an unknown one", () => {
    expect(findCommand("help")?.name).toBe("help");
    expect(findCommand("definitely-not-a-command")).toBeUndefined();
  });
});

describe("suggestCommand", () => {
  it("completes a unique prefix", () => {
    expect(suggestCommand("hel")).toBe("help");
  });

  it("offers the nearest command for a typo", () => {
    // one edit away from "clear"
    expect(suggestCommand("clesr")).toBe("clear");
  });

  it("returns null for empty input", () => {
    expect(suggestCommand("")).toBeNull();
  });
});

describe("normalizeSlashInput", () => {
  it("rewrites section slash-aliases to `cd <section>`", () => {
    expect(normalizeSlashInput("/review")).toBe("cd rating");
    expect(normalizeSlashInput("/reviews")).toBe("cd rating");
    expect(normalizeSlashInput("/rating")).toBe("cd rating");
    expect(normalizeSlashInput("/testimonial")).toBe("cd testimonials");
    expect(normalizeSlashInput("/testimonials")).toBe("cd testimonials");
  });

  it("prefers a same-named top-level command over the section fallback", () => {
    expect(normalizeSlashInput("/projects")).toBe("projects");
    expect(normalizeSlashInput("/blog")).toBe("blogs");
  });

  it("leaves unrecognized slash input unchanged", () => {
    expect(normalizeSlashInput("/nonexistent")).toBe("/nonexistent");
  });
});
