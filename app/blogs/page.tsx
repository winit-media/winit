"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { fetchBlogPosts, BlogPost } from "@/lib/firebase";
import { Calendar, ArrowRight, Tag } from "lucide-react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts().then((p) => {
      setPosts(p.filter((post) => post.published));
      setLoading(false);
    });
  }, []);

  return (
    <div className={`${poppins.variable} min-h-screen bg-white`}>
      {/* Header */}
      <div className="bg-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('/pattern.svg')", backgroundSize: "60px" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <Link href="/" className="text-white/70 hover:text-white text-sm mb-4 inline-block transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-4" style={{ fontFamily: "'Clash Display', 'Montserrat', system-ui, sans-serif" }}>
            Blogs
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Insights, stories, and updates from the WinIt team.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
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
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-brand/20 transition-all duration-300 flex flex-col"
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <h2 className="font-display font-semibold text-lg text-gray-900 group-hover:text-brand transition-colors mb-2 line-clamp-2" style={{ fontFamily: "'Clash Display', 'Montserrat', system-ui, sans-serif" }}>
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
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <Link href="/" className="text-brand hover:text-brand-dark font-medium text-sm transition-colors">
            &larr; Back to WinIt Home
          </Link>
        </div>
      </div>
    </div>
  );
}
