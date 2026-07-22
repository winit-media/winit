import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/smtp";
import {
  visitorAutoResponseTemplate,
  adminNotificationTemplate,
} from "@/lib/email/templates";
import { fetchSiteContent } from "@/lib/firebase";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeContactForm } from "@/lib/sanitize";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || "https://winitmedia.com",
  "http://localhost:3000", // local dev only — not a security risk in production
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
  try {
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
    const body = await req.json();
    const sanitized = sanitizeContactForm(body);

    if (sanitized.errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: sanitized.errors },
        { status: 400 }
      );
    }

    // Rate limiting per recipient email (prevents auto-responder abuse)
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

    const siteDetails = await fetchSiteContent();
    const adminEmail = process.env.ADMIN_EMAIL || siteDetails.contactEmail;

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

    const visitorMail = visitorAutoResponseTemplate(
      { name: sanitized.name, email: sanitized.email, phone: sanitized.phone, message: sanitized.message },
      siteDetails
    );

    await sendEmail({
      to: sanitized.email,
      subject: visitorMail.subject,
      html: visitorMail.html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] /api/contact error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
