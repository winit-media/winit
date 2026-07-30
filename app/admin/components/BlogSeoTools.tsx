"use client";

import { CheckCircle2, XCircle, AlertCircle, Globe } from "lucide-react";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(html: string): number {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

interface SerpPreviewProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
}

export function SerpPreview({ title, slug, excerpt, content }: SerpPreviewProps) {
  const displayTitle = title || "Post Title";
  const displaySlug = slug || "your-slug";
  const displayDesc =
    excerpt ||
    stripHtml(content).slice(0, 320) ||
    "Your meta description will appear here — write a compelling excerpt to improve click-through rate from search results.";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-[#0d652d] mb-1">
        <Globe size={14} className="shrink-0 text-gray-400" />
        <span className="truncate">
          winitmedia.com <span className="text-gray-400">› blogs ›</span>{" "}
          <span className="font-medium">{displaySlug}</span>
        </span>
      </div>
      <p className="text-[#1a0dab] text-lg leading-tight mb-0.5 line-clamp-2 hover:underline cursor-pointer">
        {displayTitle}
      </p>
      <p className="text-[#4d5156] text-sm leading-relaxed line-clamp-3">
        {displayDesc}
      </p>
      {!excerpt && (
        <p className="text-amber-600 text-xs mt-1">
          No excerpt set &mdash; Google will auto-generate this snippet from your content. Write a custom excerpt to control what&rsquo;s shown.
        </p>
      )}
    </div>
  );
}

interface SeoChecklistProps {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  coverImage: string;
  tags: string[];
  content: string;
}

type CheckItem = {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

export function SeoChecklist({ title, slug, excerpt, author, coverImage, tags, content }: SeoChecklistProps) {
  const checks: CheckItem[] = [];
  const tLen = title.length;
  const eLen = excerpt.length;
  const wc = wordCount(content);

  // Title
  if (tLen === 0) {
    checks.push({ label: "Title", status: "fail", detail: "Missing" });
  } else if (tLen < 30) {
    checks.push({ label: "Title", status: "warn", detail: `${tLen} chars — aim 50–60` });
  } else if (tLen <= 60) {
    checks.push({ label: "Title", status: "pass", detail: `${tLen} chars` });
  } else {
    checks.push({ label: "Title", status: "warn", detail: `${tLen} chars — may be truncated in search` });
  }

  // Slug
  checks.push({
    label: "Slug",
    status: slug ? "pass" : "fail",
    detail: slug || "Empty — auto-generated from title",
  });

  // Excerpt
  if (eLen === 0) {
    checks.push({ label: "Excerpt", status: "fail", detail: "Missing — Google will auto-generate" });
  } else if (eLen < 120) {
    checks.push({ label: "Excerpt", status: "warn", detail: `${eLen} chars — aim 140–160` });
  } else if (eLen <= 160) {
    checks.push({ label: "Excerpt", status: "pass", detail: `${eLen} chars` });
  } else {
    checks.push({ label: "Excerpt", status: "warn", detail: `${eLen} chars — 140–160 is ideal` });
  }

  // Author
  if (!author) {
    checks.push({ label: "Author", status: "fail", detail: "Not set" });
  } else if (/^(admin|author|writer)$/i.test(author.trim())) {
    checks.push({ label: "Author", status: "warn", detail: `"${author}" — use a real name` });
  } else {
    checks.push({ label: "Author", status: "pass", detail: author });
  }

  // Cover Image
  checks.push({
    label: "Cover Image",
    status: coverImage ? "pass" : "fail",
    detail: coverImage ? "Set" : "Not set — social shares will lack an image",
  });

  // Tags
  if (tags.length === 0) {
    checks.push({ label: "Tags", status: "fail", detail: "None — add 3–5" });
  } else if (tags.length < 3) {
    checks.push({ label: "Tags", status: "warn", detail: `${tags.length} — aim for 3–5` });
  } else {
    checks.push({ label: "Tags", status: "pass", detail: `${tags.length}` });
  }

  // Content
  if (wc === 0) {
    checks.push({ label: "Content", status: "fail", detail: "Empty" });
  } else if (wc < 300) {
    checks.push({ label: "Content", status: "fail", detail: `~${wc} words — very short` });
  } else if (wc < 800) {
    checks.push({ label: "Content", status: "warn", detail: `~${wc} words — aim 800+` });
  } else {
    checks.push({ label: "Content", status: "pass", detail: `~${wc} words` });
  }

  const passCount = checks.filter((c) => c.status === "pass").length;
  const total = checks.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-gray-700">SEO Checklist</h4>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            passCount === total
              ? "bg-green-100 text-green-700"
              : passCount >= total - 2
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {passCount}/{total}
        </span>
      </div>
      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-start gap-2">
            {check.status === "pass" ? (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-500" />
            ) : check.status === "warn" ? (
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
            ) : (
              <XCircle size={16} className="shrink-0 mt-0.5 text-gray-300" />
            )}
            <div className="min-w-0">
              <span className="text-sm font-medium text-gray-700">{check.label}</span>
              <span className="text-sm text-gray-400 ml-1.5">{check.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
