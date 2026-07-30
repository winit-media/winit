import Link from "next/link";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { getAllPublishedPosts } from "@/lib/serverBlogs";
import type { Metadata } from "next";

// Render fresh on every request so new/updated posts appear instantly.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Insights, stories, and updates from the WinIt Media team on influencer marketing, brand storytelling, and creative strategy.",
  alternates: {
    canonical: "https://winitmedia.com/blogs",
  },
  openGraph: {
    title: "Blogs | WinIt Media",
    description:
      "Insights, stories, and updates from the WinIt Media team on influencer marketing, brand storytelling, and creative strategy.",
    url: "https://winitmedia.com/blogs",
  },
};

export default async function BlogsPage() {
  const posts = await getAllPublishedPosts();

  return (
    <main className="min-h-svh bg-white blogs-page">
      {/* Header */}
      <div className="bg-brand relative overflow-hidden pattern-bg">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-24 pb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            Blogs
          </h1>
          <p className="text-white/70 mt-3 max-w-xl">
            Insights, stories, and updates from the WinIt team.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="relative w-full py-12 pattern-bg" data-theme="light">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          {posts.length === 0 ? (
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
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar size={12} />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                          <span
                            key={tag}
                            className="text-xs bg-brand/5 text-brand px-2 py-0.5 rounded-full flex items-center gap-1"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-brand text-sm font-medium mt-auto">
                      Read More{" "}
                      <ArrowRight
                        size={14}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
