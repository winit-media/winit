import { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/lib/firebase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://winitmedia.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const posts = await fetchBlogPosts();
    const blogPages: MetadataRoute.Sitemap = posts
      .filter((post) => post.published)
      .map((post) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    return [...staticPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
