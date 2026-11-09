import type { MetadataRoute } from "next";
import { SITE_URL, getPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, priority: 0.5 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/posts/${p.id}`,
      lastModified: new Date(p.publishedAt),
      priority: 0.7,
    })),
  ];
}
