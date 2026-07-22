"use client";

import { sanitizeBlogContent } from "@/lib/sanitize-blog";

export default function BlogContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-brand prose-blockquote:text-gray-600"
      dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(html) }}
    />
  );
}
