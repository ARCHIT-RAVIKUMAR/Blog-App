import { seedPosts } from "./data";
import type { Post } from "./types";

const API = process.env.MOCK_API_URL?.replace(/\/$/, "");

function sortNewest(posts: Post[]) {
  return [...posts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

export async function getPosts(): Promise<Post[]> {
  if (!API) return sortNewest(seedPosts);
  const res = await fetch(API, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
  return sortNewest((await res.json()) as Post[]);
}

export async function getPost(id: string): Promise<Post | null> {
  if (!API) return seedPosts.find((p) => p.id === id) ?? null;
  const res = await fetch(`${API}/${encodeURIComponent(id)}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load post (${res.status})`);
  return (await res.json()) as Post;
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
