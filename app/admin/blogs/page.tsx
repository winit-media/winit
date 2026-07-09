"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Save, Loader2, LogOut, ArrowLeft, Type,
} from "lucide-react";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app, fetchSiteContent, BlogPost, fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/firebase";
import TiptapEditor from "@/components/TiptapEditor";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Link from "next/link";

const auth = getAuth(app);

function ImageUpload({ value, onChange, folder }: { value: string; onChange: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useState<HTMLInputElement | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder || "winit/blogs");
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value && (
        <img src={value} alt="" className="h-20 w-auto object-contain rounded border bg-gray-50 p-1" />
      )}
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="blog-img-upload" />
        <label
          htmlFor="blog-img-upload"
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          {uploading ? "Uploading..." : "Upload Image"}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Or paste URL"
        />
      </div>
    </div>
  );
}

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Blog Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage blog posts</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BlogAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthed(!!user);
      if (user?.email) {
        setUserEmail(user.email);
        const content = await fetchSiteContent();
        const allowed = content.blogUsers.some((u) => u.email === user.email);
        setAuthorized(allowed || false);
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!authed) {
    return <LoginGate onLogin={() => {}} />;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-6">
            Your account ({userEmail}) is not authorized to manage blogs. Contact the site admin to be added.
          </p>
          <button
            onClick={() => signOut(auth)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <BlogDashboard />;
}

function BlogDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) setUserEmail(user.email);
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const p = await fetchBlogPosts();
    setPosts(p);
    setLoading(false);
  };

  const create = () => {
    const now = Date.now();
    setEditing({
      id: now.toString(),
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: userEmail.split("@")[0] || "",
      published: false,
      tags: [],
      createdAt: now,
      updatedAt: now,
    });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const data = { ...editing, updatedAt: Date.now() };
    if (posts.find((p) => p.id === editing.id)) {
      await updateBlogPost(editing.id, data);
    } else {
      await createBlogPost(data);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    await deleteBlogPost(id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Blog Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-700">
              View Blogs
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Your Posts ({posts.length})</h2>
          <button
            onClick={create}
            className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <Plus size={14} /> New Post
          </button>
        </div>

        {editing && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{posts.find((p) => p.id === editing.id) ? "Edit Post" : "New Post"}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing({ ...editing, published: !editing.published })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    editing.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {editing.published ? "Published" : "Draft"}
                </button>
                <button onClick={() => setEditing(null)} className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600">
                  Cancel
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({
                  ...editing,
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Slug</label>
              <input
                type="text"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="my-blog-post"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Excerpt</label>
              <textarea
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                rows={2}
                placeholder="Brief summary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Author</label>
              <input
                type="text"
                value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Cover Image</label>
              <ImageUpload value={editing.coverImage} onChange={(v) => setEditing({ ...editing, coverImage: v })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma separated)</label>
              <input
                type="text"
                value={editing.tags.join(", ")}
                onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
              <TiptapEditor
                content={editing.content}
                onChange={(html) => setEditing({ ...editing, content: html })}
              />
            </div>

            <button
              onClick={save}
              disabled={saving || !editing.title.trim()}
              className="bg-brand text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              <Save size={16} /> {posts.find((p) => p.id === editing.id) ? "Update Post" : "Publish Post"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-brand" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No blog posts yet. Click &quot;New Post&quot; to create one.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4">
                {post.coverImage && (
                  <img src={post.coverImage} alt="" className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-sm truncate">{post.title || "Untitled"}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(post)} className="text-brand hover:text-brand-dark text-sm font-medium px-2">
                    Edit
                  </button>
                  <button onClick={() => remove(post.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
