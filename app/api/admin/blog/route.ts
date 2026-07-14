import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email } = await verifyAdmin(req.headers.get("authorization"));
    const body = await req.json();
    const db = getAdminDb();
    await db.collection("blogs").doc(body.post.id).set(body.post);
    return NextResponse.json({ success: true, email });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/blog POST auth error:", err.message);
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    console.error("[API] /api/admin/blog POST error:", err);
    return NextResponse.json(
      { error: "Failed to create blog post: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { email } = await verifyAdmin(req.headers.get("authorization"));
    const body = await req.json();
    const db = getAdminDb();
    await db.collection("blogs").doc(body.id).update(body.partial);
    return NextResponse.json({ success: true, email });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/blog PATCH auth error:", err.message);
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    console.error("[API] /api/admin/blog PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update blog post: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await verifyAdmin(req.headers.get("authorization"));
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing blog post id" },
        { status: 400 }
      );
    }
    const db = getAdminDb();
    await db.collection("blogs").doc(id).delete();
    return NextResponse.json({ success: true, email });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/blog DELETE auth error:", err.message);
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    console.error("[API] /api/admin/blog DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete blog post: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}
