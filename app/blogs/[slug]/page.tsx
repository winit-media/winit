"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { fetchBlogPostBySlug, BlogPost } from "@/lib/firebase";
import { Calendar, Tag, ArrowLeft, User, Loader2 } from "lucide-react";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import PatternOverlay from "@/components/PatternOverlay";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetchBlogPostBySlug(slug).then((p) => {
      setPost(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <AdminProvider>
        <Navbar />
        <div className={`${poppins.variable} min-h-screen bg-white flex items-center justify-center`}>
          <Loader2 size={32} className="animate-spin text-brand" />
        </div>
      </AdminProvider>
    );
  }

  if (!post) {
    return (
      <AdminProvider>
        <Navbar />
        <div className={`${poppins.variable} min-h-screen bg-white flex items-center justify-center`}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
            <p className="text-gray-500 mb-6">The blog post you are looking for does not exist.</p>
            <Link href="/blogs" className="text-brand hover:text-brand-dark font-medium transition-colors">
              &larr; Back to Blogs
            </Link>
          </div>
        </div>
      </AdminProvider>
    );
  }

  return (
    <AdminProvider>
      <Navbar />
      <div className={`${poppins.variable} min-h-screen bg-white`}>
        {/* Header */}
        <div className="bg-brand relative overflow-hidden">
          <PatternOverlay opacity={0.16} />
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
            <h1
            className="text-3xl md:text-5xl font-display font-bold text-white mt-4 leading-tight"
            style={{ fontFamily: "'Clash Display', 'Montserrat', system-ui, sans-serif" }}
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm mt-4">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="flex items-center gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content area with pattern */}
      <div className="relative">
        <PatternOverlay opacity={0.16} />
        <div className="relative z-10">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 mb-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img src={post.coverImage} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          {post.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-brand pl-4 italic">
              {post.excerpt}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-brand prose-blockquote:text-gray-600"
            style={{ fontFamily: "var(--font-poppins), 'Poppins', system-ui, sans-serif" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-between">
          <Link href="/blogs" className="text-brand hover:text-brand-dark font-medium text-sm transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> All Blogs
          </Link>
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            WinIt Home
          </Link>
        </div>
      </div>
    </div>
    </AdminProvider>
  );
}
