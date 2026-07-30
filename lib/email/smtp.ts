/**
 * Nodemailer SMTP transport configuration.
 * Uses credentials from SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.winitmedia.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/** Options for sending an email via SMTP. */
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an HTML email via the configured SMTP transport.
 *
 * @param options.to - Recipient email address
 * @param options.subject - Email subject line
 * @param options.html - HTML body content
 * @param options.replyTo - Optional reply-to address
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  return transporter.sendMail({
    from: `"WinIt Media" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });
}
