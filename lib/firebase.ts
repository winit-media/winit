import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";

// Re-export types and defaults from the pure data module (no Firebase imports)
export type { SiteContent } from "./siteContent";
export { defaultSiteContent, mergeSiteContent } from "./siteContent";
import { SiteContent, defaultSiteContent, mergeSiteContent } from "./siteContent";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
let db: ReturnType<typeof getFirestore> | null = null;
try {
  db = getFirestore(app);
} catch (e) {
  console.error("[Firebase] getFirestore failed — likely iOS Private Browsing or IndexedDB issue:", e);
}

export { app };

const DOC_PATH = "siteContent/main";

export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    if (!db) return defaultSiteContent;
    const docRef = doc(db, DOC_PATH);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return mergeSiteContent(snap.data() as Partial<SiteContent>);
    }
    return defaultSiteContent;
  } catch (err) {
    console.error("[Firebase] fetchSiteContent error:", err);
    return defaultSiteContent;
  }
}

async function getAuthToken(): Promise<string> {
  const user = getAuth(app).currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken();
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to save content (${res.status})`);
  }
}

// ── Blog Types ──────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

const BLOGS_COLLECTION = "blogs";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!db) return [];
    const q = query(collection(db, BLOGS_COLLECTION), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as BlogPost).filter((p) => p.published);
  } catch (err) {
    console.error("[Firebase] fetchBlogPosts error:", err);
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!db) return null;
    const q = query(collection(db, BLOGS_COLLECTION), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const post = snap.docs[0].data() as BlogPost;
    return post.published ? post : null;
  } catch (err) {
    console.error("[Firebase] fetchBlogPostBySlug error:", err);
    return null;
  }
}

export async function createBlogPost(post: BlogPost): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch("/api/admin/blog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ post }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to create blog post (${res.status})`);
  }
}

export async function updateBlogPost(id: string, partial: Partial<BlogPost>): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch("/api/admin/blog", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, partial }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to update blog post (${res.status})`);
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to delete blog post (${res.status})`);
  }
}

export { db };
