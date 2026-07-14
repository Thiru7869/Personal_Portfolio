import { z } from "zod";

/**
 * src/lib/validation.ts
 * ------------------------------------------------------------
 * Shared zod schemas for API-route input validation. Centralised
 * so the routes and the test suite validate against the exact
 * same rules (one source of truth), and so form-validation logic
 * is unit-testable in isolation.
 */

/** Contact form. `company` is a honeypot — must stay empty. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name looks too short").max(100),
  email: z.string().trim().email("That email doesn't look right").max(150),
  subject: z.string().trim().min(3, "Subject looks too short").max(150),
  message: z.string().trim().min(10, "Tell me a little more").max(3000),
  company: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Newsletter signup. */
export const newsletterSchema = z.object({
  email: z.string().trim().email().max(150),
});

/** A single chat turn + the whole conversation. */
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});
export const chatSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(30),
});
