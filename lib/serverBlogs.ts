/**
 * Server-side blog data access using Firebase Admin SDK.
 * Used in Next.js Server Components and API routes for direct Firestore access.
 */

import { getAdminDb } from "./firebase-admin";
import type { BlogPost } from "./types";

export type ServerBlogPost = BlogPost;

const BLOGS_COLLECTION = "blogs";

/** Fetches all published blog posts, ordered by creation date (newest first). */
export async function getAllPublishedPosts(): Promise<ServerBlogPost[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(BLOGS_COLLECTION)
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as ServerBlogPost))
      .filter((p) => p.published);
  } catch (err) {
    console.error("[ServerBlogs] getAllPublishedPosts error:", err);
    return [];
  }
}

/** Fetches a single published blog post by its URL slug. Returns null if not found or unpublished. */
export async function getPublishedPostBySlug(
  slug: string
): Promise<ServerBlogPost | null> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(BLOGS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const post = { id: snap.docs[0].id, ...snap.docs[0].data() } as ServerBlogPost;
    return post.published ? post : null;
  } catch (err) {
    console.error("[ServerBlogs] getPublishedPostBySlug error:", err);
    return null;
  }
}
