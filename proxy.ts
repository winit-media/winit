import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Blog subdomain (e.g., blog.acaditya10.tech) → serve /admin/blogs
  const blogDomain = process.env.BLOG_DOMAIN;
  if (blogDomain && hostname === blogDomain && !pathname.startsWith("/admin/blogs")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/blogs";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
