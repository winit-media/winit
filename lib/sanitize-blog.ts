import createDOMPurify from "dompurify";

const ALLOWED_IFRAME_HOSTS = new Set([
  "www.youtube-nocookie.com",
  "www.youtube.com",
  "player.vimeo.com",
  "wistia.com",
]);

const DOMPurify = typeof window !== "undefined" ? createDOMPurify(window) : null;

if (DOMPurify) {
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName !== "iframe") return;
    const el = node as Element;
    const src = el.getAttribute("src") || "";
    try {
      const url = new URL(src);
      if (!ALLOWED_IFRAME_HOSTS.has(url.hostname)) {
        el.remove();
        return;
      }
    } catch {
      el.remove();
      return;
    }
    const allow = el.getAttribute("allow");
    if (allow) {
      const sanitized = allow
        .split(";")
        .map((s: string) => s.trim())
        .filter((s: string) => s === "fullscreen" || s === "picture-in-picture")
        .join("; ");
      if (sanitized) {
        el.setAttribute("allow", sanitized);
      } else {
        el.removeAttribute("allow");
      }
    }
  });
}

export function sanitizeBlogContent(html: string): string {
  if (!DOMPurify) return html;
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });
}
