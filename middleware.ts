import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  const blogDomain = process.env.BLOG_DOMAIN;
  if (
    blogDomain &&
    hostname === blogDomain &&
    !pathname.startsWith("/admin/blogs") &&
    !pathname.startsWith("/api")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/blogs";
    return NextResponse.rewrite(url);
  }

  const adminDomain = process.env.ADMIN_DOMAIN;
  if (
    adminDomain &&
    hostname === adminDomain &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
