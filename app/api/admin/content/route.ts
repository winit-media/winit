import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { uid, email } = await verifyAdmin(req.headers.get("authorization"));
    const body = await req.json();
    const db = getAdminDb();
    await db.doc("siteContent/main").set(body.content);
    return NextResponse.json({ success: true, uid, email });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/content auth error:", err.message);
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    console.error("[API] /api/admin/content error:", err);
    return NextResponse.json(
      { error: "Failed to save content: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}
