import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

const ALLOWED_POST_FIELDS = new Set([
  "id", "title", "slug", "excerpt", "content", "coverImage",
  "author", "published", "tags", "createdAt", "updatedAt",
]);

const ALLOWED_PATCH_FIELDS = new Set([
  "title", "slug", "excerpt", "content", "coverImage",
  "author", "published", "tags", "updatedAt",
]);

function sanitizeDocId(id: string): string {
  return id.replace(/[/#[\]]/g, "").substring(0, 150);
}

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

    if (!body.post || typeof body.post !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!body.post.id || typeof body.post.id !== "string") {
      return NextResponse.json({ error: "Missing or invalid post id" }, { status: 400 });
    }

    if (!body.post.title || typeof body.post.title !== "string") {
      return NextResponse.json({ error: "Missing or invalid post title" }, { status: 400 });
    }

    const docId = sanitizeDocId(body.post.id);
    if (!docId) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    const sanitized = filterObject(body.post, ALLOWED_POST_FIELDS);
    sanitized.id = docId;

    const db = getAdminDb();
    await db.collection("blogs").doc(docId).set(sanitized);
    revalidatePath("/sitemap.xml");
    revalidatePath("/blogs");
    if (sanitized.slug) revalidatePath(`/blogs/${sanitized.slug}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/blog POST auth error:", err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[API] /api/admin/blog POST error:", err);
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? "Internal server error" : "Failed to create blog post: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await verifyAdmin(req.headers.get("authorization"));
    const body = await req.json();

    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing or invalid post id" }, { status: 400 });
    }

    if (!body.partial || typeof body.partial !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const docId = sanitizeDocId(body.id);
    if (!docId) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    const sanitized = filterObject(body.partial, ALLOWED_PATCH_FIELDS);

    const db = getAdminDb();
    await db.collection("blogs").doc(docId).update(sanitized);
    revalidatePath("/sitemap.xml");
    revalidatePath("/blogs");
    const patchedDoc = await db.collection("blogs").doc(docId).get();
    if (patchedDoc.exists) {
      const data = patchedDoc.data();
      if (data?.slug) revalidatePath(`/blogs/${data.slug}`);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/blog PATCH auth error:", err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[API] /api/admin/blog PATCH error:", err);
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? "Internal server error" : "Failed to update blog post: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await verifyAdmin(req.headers.get("authorization"));
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing blog post id" }, { status: 400 });
    }

    const docId = sanitizeDocId(id);
    if (!docId) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    const db = getAdminDb();
    const deletedDoc = await db.collection("blogs").doc(docId).get();
    const deletedSlug = deletedDoc.exists ? (deletedDoc.data()?.slug as string | undefined) : undefined;
    await db.collection("blogs").doc(docId).delete();
    revalidatePath("/sitemap.xml");
    revalidatePath("/blogs");
    if (deletedSlug) revalidatePath(`/blogs/${deletedSlug}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      console.error("[API] /api/admin/blog DELETE auth error:", err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[API] /api/admin/blog DELETE error:", err);
    return NextResponse.json(
      { error: process.env.NODE_ENV === "production" ? "Internal server error" : "Failed to delete blog post: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}
