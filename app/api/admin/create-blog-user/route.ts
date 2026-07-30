import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email: adminEmail } = await verifyAdmin(req.headers.get("authorization"));

    const adminAuth = getAdminAuth();

    const body = await req.json();
    const { email, password, displayName } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!displayName || typeof displayName !== "string") {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 });
    }

    const userRecord = await adminAuth.createUser({
      email: email.trim(),
      password,
      displayName: displayName.trim(),
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[API] /api/admin/create-blog-user error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? "Failed to create user" : "Failed to create user: " + message },
      { status: 500 }
    );
  }
}
