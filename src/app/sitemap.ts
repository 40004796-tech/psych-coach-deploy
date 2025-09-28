import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls = ["/"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: 1,
  }));
  return urls;
}


