import { describe, it, expect } from "vitest";
import { contactSchema, chatSchema, newsletterSchema } from "./validation";

describe("contactSchema", () => {
  const valid = {
    name: "Jane Recruiter",
    email: "jane@company.com",
    subject: "Role at Acme",
    message: "We would like to talk about a position.",
    company: "",
  };

  it("accepts a well-formed submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects a too-short message", () => {
    const r = contactSchema.safeParse({ ...valid, message: "hi" });
    expect(r.success).toBe(false);
  });

  it("rejects a filled honeypot (company must be empty)", () => {
    const r = contactSchema.safeParse({ ...valid, company: "bot-filled" });
    expect(r.success).toBe(false);
  });

  it("trims whitespace and enforces the name minimum", () => {
    const r = contactSchema.safeParse({ ...valid, name: "  a  " });
    expect(r.success).toBe(false);
  });

  it("enforces max lengths", () => {
    const r = contactSchema.safeParse({ ...valid, message: "x".repeat(3001) });
    expect(r.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });
  it("rejects a malformed email", () => {
    expect(newsletterSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("chatSchema", () => {
  it("accepts a single user turn", () => {
    const r = chatSchema.safeParse({ messages: [{ role: "user", content: "hi" }] });
    expect(r.success).toBe(true);
  });
  it("rejects an empty conversation", () => {
    expect(chatSchema.safeParse({ messages: [] }).success).toBe(false);
  });
  it("rejects an invalid role", () => {
    const r = chatSchema.safeParse({ messages: [{ role: "system", content: "x" }] });
    expect(r.success).toBe(false);
  });
  it("caps conversation length at 30 turns", () => {
    const messages = Array.from({ length: 31 }, () => ({
      role: "user" as const,
      content: "x",
    }));
    expect(chatSchema.safeParse({ messages }).success).toBe(false);
  });
});
