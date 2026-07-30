import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/smtp";
import {
  visitorAutoResponseTemplate,
  adminNotificationTemplate,
} from "@/lib/email/templates";
import { getAdminDb } from "@/lib/firebase-admin";
import type { SiteContent } from "@/lib/siteContent";
import { defaultSiteContent, mergeSiteContent } from "@/lib/siteContent";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeContactForm } from "@/lib/sanitize";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.winitmedia.com",
  "https://winitmedia.com",
  "https://www.winitmedia.com",
  "https://blogs.winitmedia.com",
  "https://admin.winitmedia.com",
  "http://localhost:3000",
];

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isAllowedOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return ALLOWED_ORIGINS.includes(`${url.protocol}//${url.host}`);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // CSRF: Origin check
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  if (origin && !isAllowedOrigin(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!origin && referer && !isAllowedOrigin(referer)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting per IP
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = rateLimit(`contact:${ip}`, 600_000, 5);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

  // Parse and sanitize input
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const sanitized = sanitizeContactForm(body);
  if (sanitized.errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: sanitized.errors },
      { status: 400 }
    );
  }

  // Rate limiting per recipient email
  const { allowed: emailAllowed, retryAfterMs: emailRetryAfter } = rateLimit(
    `contact:email:${sanitized.email}`,
    600_000,
    3
  );
  if (!emailAllowed) {
    return NextResponse.json(
      { error: "Too many submissions from this email. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(emailRetryAfter / 1000)) },
      }
    );
  }

  // Build template data (Admin SDK Firestore read)
  let siteDetails: SiteContent;
  try {
    const db = getAdminDb();
    const snap = await db.doc("siteContent/main").get();
    const raw = snap.data() as Partial<SiteContent> | undefined;
    siteDetails = raw ? mergeSiteContent(raw) : defaultSiteContent;
  } catch (err) {
    console.error("[API] /api/contact Firestore read failed:", err);
    return NextResponse.json(
      { error: "Failed to load site data" },
      { status: 500 }
    );
  }
  const adminEmail = process.env.ADMIN_EMAIL || siteDetails.contactEmail;

  // Send admin notification (best-effort, log-only on failure)
  try {
    const adminMail = adminNotificationTemplate(
      { name: sanitized.name, email: sanitized.email, phone: sanitized.phone, message: sanitized.message },
      siteDetails
    );
    await sendEmail({
      to: adminEmail,
      subject: adminMail.subject,
      html: adminMail.html,
      replyTo: sanitized.email,
    });
  } catch (err) {
    console.error("[API] /api/contact admin email failed:", err);
  }

  // Send visitor auto-response (best-effort, log-only on failure)
  try {
    const visitorMail = visitorAutoResponseTemplate(
      { name: sanitized.name, email: sanitized.email, phone: sanitized.phone, message: sanitized.message },
      siteDetails
    );
    await sendEmail({
      to: sanitized.email,
      subject: visitorMail.subject,
      html: visitorMail.html,
    });
  } catch (err) {
    console.error("[API] /api/contact visitor email failed:", err);
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fcm = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const fpk = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  return NextResponse.json({
    smtp: {
      host: smtpHost || "(default: mail.winitmedia.com)",
      port: smtpPort || "(default: 587)",
      user: smtpUser ? `set (${smtpUser})` : "MISSING",
      pass: smtpPass ? "set" : "MISSING",
    },
    firebaseAdmin: {
      clientEmail: fcm ? "set" : "MISSING",
      privateKey: fpk ? "set" : "MISSING",
    },
    adminEmail: adminEmail ? "set" : "MISSING",
    nodeEnv: process.env.NODE_ENV,
  });
}
