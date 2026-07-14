import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** robots.txt — everything public except admin and APIs. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
