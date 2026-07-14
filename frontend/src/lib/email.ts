import nodemailer from "nodemailer";
import type { ContactPayload } from "@shared/types";
import { site } from "@/config/site";

/**
 * src/lib/email.ts
 * ------------------------------------------------------------
 * Contact-form delivery with two transports:
 *
 *   1. SMTP via Nodemailer (Gmail app password — see docs)
 *   2. Web3Forms as a fallback when SMTP is not configured
 *      or fails (free key from https://web3forms.com)
 *
 * If neither is configured the API stores the message in
 * Supabase only and tells the visitor their message was saved.
 */

const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
);
const web3formsConfigured = Boolean(process.env.WEB3FORMS_ACCESS_KEY);

export const isEmailConfigured = smtpConfigured || web3formsConfigured;

async function sendViaSmtp(payload: ContactPayload): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL ?? site.email,
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject}`,
    text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px">
        <h2 style="margin:0 0 4px">New portfolio message</h2>
        <p style="margin:0 0 16px;color:#666">via the contact form</p>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
        <hr style="border:none;border-top:1px solid #ddd" />
        <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
      </div>`,
  });
}

async function sendViaWeb3Forms(payload: ContactPayload): Promise<void> {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      name: payload.name,
      email: payload.email,
      subject: `[Portfolio] ${payload.subject}`,
      message: payload.message,
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error("Web3Forms delivery failed");
  }
}

/**
 * Send the contact message. Returns the transport used, or
 * "none" when no email provider is configured.
 */
export async function deliverContactMessage(
  payload: ContactPayload
): Promise<"smtp" | "web3forms" | "none"> {
  if (smtpConfigured) {
    try {
      await sendViaSmtp(payload);
      return "smtp";
    } catch {
      // fall through to Web3Forms
    }
  }
  if (web3formsConfigured) {
    await sendViaWeb3Forms(payload);
    return "web3forms";
  }
  return "none";
}

/** Escape user text before interpolating it into the HTML email
 *  body. Exported so it can be unit-tested directly. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
