"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, LogOut, ArrowLeft, Search } from "lucide-react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app, fetchSiteContent, BlogPost, fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/firebase";
import TiptapEditor from "@/components/TiptapEditor";
import ImageUpload from "@/app/admin/components/ImageUpload";
import { Field } from "@/app/admin/components/FormElements";
import { SaveButton } from "@/app/admin/components/SaveIndicator";
import { useToast, ToastProvider } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Link from "next/link";

import LoginGate from "@/app/admin/components/LoginGate";

const auth = getAuth(app);

function BlogDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [userEmail] = useState(() => auth.currentUser?.email || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const p = await fetchBlogPosts();
    setPosts(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

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
    if (!editing.title.trim()) {
      toast("Title is required", "error");
      return;
    }
    setSaving(true);
    try {
      const data = { ...editing, updatedAt: Date.now() };
      if (posts.find((p) => p.id === editing.id)) {
        await updateBlogPost(editing.id, data);
        toast("Post updated", "success");
      } else {
        await createBlogPost(data);
        toast("Post created", "success");
      }
      setEditing(null);
      load();
    } catch (err) {
      console.error("[BlogAdmin] Save failed:", err);
      toast("Failed to save post", "error");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    try {
      await deleteBlogPost(id);
      toast("Post deleted", "success");
      load();
    } catch (err) {
      console.error("[BlogAdmin] Delete failed:", err);
      toast("Failed to delete post", "error");
    }
    setDeleteId(null);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "published" && post.published) ||
      (filterStatus === "draft" && !post.published);
    return matchesSearch && matchesStatus;
  });

  const updateEditing = (partial: Partial<BlogPost>) => {
    if (!editing) return;
    const updated = { ...editing, ...partial };
    if (partial.title && !partial.slug) {
      updated.slug = partial.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    setEditing(updated);
  };

  return (
    <div className="min-h-svh bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Blog Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blogs" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              View Blogs
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
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

        {posts.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or tag..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["all", "published", "draft"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                    filterStatus === status
                      ? "bg-white text-brand shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {editing && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{posts.find((p) => p.id === editing.id) ? "Edit Post" : "New Post"}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing({ ...editing, published: !editing.published })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    editing.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {editing.published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={() => {
                    if (editing && (editing.title || editing.content)) {
                      if (!window.confirm("Discard unsaved changes?")) return;
                    }
                    setEditing(null);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <Field label="Title" value={editing.title} onChange={(v) => updateEditing({ title: v })} placeholder="Post title" showCount maxLength={100} />
            <Field label="Slug" value={editing.slug} onChange={(v) => updateEditing({ slug: v })} placeholder="my-blog-post" />
            <Field label="Excerpt" value={editing.excerpt} onChange={(v) => updateEditing({ excerpt: v })} textarea placeholder="Brief summary" showCount maxLength={200} />
            <Field label="Author" value={editing.author} onChange={(v) => updateEditing({ author: v })} />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Cover Image</label>
              <ImageUpload value={editing.coverImage} onChange={(v) => updateEditing({ coverImage: v })} />
            </div>
            <Field label="Tags (comma separated)" value={editing.tags.join(", ")} onChange={(v) => updateEditing({ tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="tag1, tag2, tag3" />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
              <TiptapEditor
                content={editing.content}
                onChange={(html) => updateEditing({ content: html })}
              />
            </div>

            <div className="flex justify-end">
              <SaveButton onClick={save} saving={saving} disabled={!editing.title.trim()} label={posts.find((p) => p.id === editing.id) ? "Update Post" : "Publish Post"} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-brand" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No blog posts yet. Click &quot;New Post&quot; to create one.</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No posts match your search.</p>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <img src={post.coverImage} alt="" className="w-20 h-16 object-cover rounded-lg shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <p className="font-semibold text-sm truncate">{post.title || "Untitled"}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(post)} className="text-brand hover:text-brand-dark text-sm font-medium px-2 py-1 rounded hover:bg-brand/5 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(post.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={() => deleteId && remove(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
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
        try {
          const content = await fetchSiteContent();
          const allowed = content.blogUsers.some((u) => u.email === user.email) || user.email === content.contactEmail;
          setAuthorized(allowed);
        } catch {
          setAuthorized(false);
        }
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!authed) {
    return (
      <ToastProvider>
        <LoginGate onLogin={() => setAuthed(true)} />
      </ToastProvider>
    );
  }

  if (!authorized) {
    return (
      <ToastProvider>
        <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
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
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <BlogDashboard />
    </ToastProvider>
  );
}
