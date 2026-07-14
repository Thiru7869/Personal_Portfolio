import { describe, it, expect } from "vitest";
import { escapeHtml } from "./email";

describe("escapeHtml", () => {
  it("escapes all five HTML-sensitive characters", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("neutralises a script-injection attempt", () => {
    const dirty = `<script>alert('xss')</script>`;
    const clean = escapeHtml(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).toBe("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
  });

  it("escapes ampersands before other entities (no double-escape mangling)", () => {
    // A raw & must become &amp; exactly once.
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("leaves safe text untouched", () => {
    expect(escapeHtml("Hello, world 123")).toBe("Hello, world 123");
  });
});
