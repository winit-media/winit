export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: "https://winitmedia.com/sitemap.xml",
    host: "https://winitmedia.com",
  };
}
