import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { blogArticles } from "@/content/blog";

/**
 * sitemap.xml — regenerated on every build. New blog articles
 * are included automatically; /qa is one rich page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/qa`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogArticles.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedDate ?? post.publishDate}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: post.featured ? 0.7 : 0.6,
  }));

  return [...staticPages, ...blogPages];
}
