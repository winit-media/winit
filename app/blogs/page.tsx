"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBlogPosts, BlogPost } from "@/lib/firebase";
import { Calendar, ArrowRight, Tag, X, User } from "lucide-react";
import { sanitizeBlogContent } from "@/lib/sanitize-blog";
import { useScrollLock } from "@/hooks/useScrollLock";

function BlogModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  useScrollLock(true);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/50 md:backdrop-blur-sm overflow-y-auto ios-scroll py-10 px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close blog post"
        >
          <X size={18} />
        </button>

        {post.coverImage && (
          <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Calendar size={12} />
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {post.author && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
              </>
            )}
          </div>

          <h1
            id="blog-modal-title"
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-display"
          >
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-brand/5 text-brand px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.excerpt && (
            <p className="text-gray-500 leading-relaxed mb-6 border-l-4 border-brand pl-4 italic">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-brand prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(post.content) }}
          />
        </div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BlogPost | null>(null);

  const handleClose = useCallback(() => setSelected(null), []);

  useEffect(() => {
    fetchBlogPosts().then((p) => {
      setPosts(p.filter((post) => post.published));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-svh bg-white">
      {/* Header */}
      <div className="bg-brand relative overflow-hidden pattern-bg">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-[3.75rem]">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-4">
            Blogs
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Insights, stories, and updates from the WinIt team.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="relative w-full py-12 pattern-bg" data-theme="light">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No blogs published yet.</p>
              <p className="text-gray-300 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelected(post)}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-brand/20 transition-all duration-300 flex flex-col text-left cursor-pointer"
                >
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      {post.author && (
                        <>
                          <span>&middot;</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                    <h2 className="font-display font-semibold text-lg text-gray-900 group-hover:text-brand transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-brand/5 text-brand px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-brand text-sm font-medium mt-auto">
                      Read More <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && <BlogModal post={selected} onClose={handleClose} />}
    </div>
  );
}
