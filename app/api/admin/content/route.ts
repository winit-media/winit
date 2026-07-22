import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";

const ALLOWED_CONTENT_FIELDS = new Set([
  "navLinks", "navLogo", "heroHeading", "heroSubtext", "heroCta",
  "services", "servicesTitle", "servicesSubtitle",
  "carouselTitle", "carouselVideos",
  "brandsTitle", "brandsSubtitle", "brands",
  "testimonialsTitle", "testimonialsSubtitle", "testimonials",
  "statsTitle", "statsSubtitle", "stats",
  "whyTitle", "whySubtitle", "whyReasons",
  "defaultVideoUrl",
  "socialLinks", "footerTitle", "footerSubtitle",
  "footerContact", "footerQuickLinks", "footerCopyright",
  "contactEmail", "contactPhone", "contactAddress",
  "blogUsers",
  "pageTitle", "pageDescription",
]);

function filterObject(obj: Record<string, unknown>, allowed: Set<string>): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (allowed.has(key)) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
}

export async function POST(req: Request) {
  try {
    await verifyAdmin(req.headers.get("authorization"));
    const body = await req.json();

    if (!body.content || typeof body.content !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const sanitized = filterObject(body.content, ALLOWED_CONTENT_FIELDS);

    const db = getAdminDb();
    await db.doc("siteContent/main").set(sanitized, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/content auth error:", err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[API] /api/admin/content error:", err);
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? "Internal server error" : "Failed to save content: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}
