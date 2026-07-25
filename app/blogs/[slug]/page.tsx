import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import { getPublishedPostBySlug, getAllPublishedPosts } from "@/lib/serverBlogs";
import { SITE_LOGO_URL } from "@/lib/siteContent";
import BlogContent from "@/components/BlogContent";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const description = post.excerpt || `${post.title} - WinIt Media blog post`;
  const url = `https://winitmedia.com/blogs/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage || undefined,
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "WinIt Media",
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://winitmedia.com/blogs/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://winitmedia.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: "https://winitmedia.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://winitmedia.com/blogs/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-svh bg-white blogs-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Mobile: stacked layout */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="bg-brand relative overflow-hidden pattern-bg">
          <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-12">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li><Link href="/" className="hover:text-white/80 transition-colors">Home</Link></li>
                <li className="text-white/30">/</li>
                <li><Link href="/blogs" className="hover:text-white/80 transition-colors">Blogs</Link></li>
                <li className="text-white/30">/</li>
                <li className="text-white/70 truncate max-w-[180px]">{post.title}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-display font-bold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm mt-4">
              {post.author && (
                <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag size={10} />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile content */}
        <div className="relative pattern-bg" data-theme="light">
          <div className="relative z-10">
            {post.coverImage && (
              <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 mb-6">
                <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5">
                  <img src={post.coverImage} alt={post.title} className="w-full h-auto max-h-[400px] object-cover" loading="lazy" decoding="async" />
                </div>
              </div>
            )}
            <article className="max-w-4xl mx-auto px-4 pb-12">
              {post.excerpt && (
                <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-brand pl-4 italic">{post.excerpt}</p>
              )}
              <BlogContent html={post.content} />
            </article>
          </div>
        </div>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:flex h-screen pt-16">
        {/* Left sidebar — sticky (40%) */}
        <aside className="w-2/5 shrink-0 bg-brand relative overflow-hidden pattern-bg">
          <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none">
            <div className="relative z-10 px-8 xl:px-10 py-12 flex flex-col h-full">
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-white/50">
                  <li><Link href="/" className="hover:text-white/80 transition-colors">Home</Link></li>
                  <li className="text-white/30">/</li>
                  <li><Link href="/blogs" className="hover:text-white/80 transition-colors">Blogs</Link></li>
                  <li className="text-white/30">/</li>
                  <li className="text-white/70 truncate max-w-[180px]">{post.title}</li>
                </ol>
              </nav>

              <h1 className="text-3xl xl:text-4xl font-display font-bold text-white leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm mt-5">
                {post.author && (
                  <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Tag size={10} />{tag}
                    </span>
                  ))}
                </div>
              )}

              {post.coverImage && (
                <div className="mt-8 rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10 relative z-10">
                  <img src={post.coverImage} alt={post.title} className="w-full h-auto max-h-[320px] object-cover" loading="lazy" decoding="async" />
                </div>
              )}

              <div className="mt-auto pt-8">
                <Link href="/blogs" className="text-white/50 hover:text-white/80 text-sm transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={14} /> All Blogs
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Right content — scrollable */}
        <div className="flex-1 min-w-0 overflow-y-auto pattern-bg" data-theme="light">
          <div className="relative z-10 max-w-3xl mx-auto px-10 py-12">
            {post.excerpt && (
              <p className="text-lg text-gray-500 leading-relaxed mb-10 border-l-4 border-brand pl-4 italic">{post.excerpt}</p>
            )}
            <BlogContent html={post.content} />
          </div>
        </div>
      </div>


    </div>
  );
}
