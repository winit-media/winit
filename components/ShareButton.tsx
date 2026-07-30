"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-sm"
      aria-label={copied ? "Link copied" : "Share this post"}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
