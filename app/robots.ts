export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/leads"],
      },
    ],
    sitemap: "https://winitmedia.com/sitemap.xml",
    host: "https://winitmedia.com",
  };
}
