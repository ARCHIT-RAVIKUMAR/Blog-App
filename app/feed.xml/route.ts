import { SITE_URL, getPosts } from "@/lib/posts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${SITE_URL}/posts/${p.id}</link><guid>${SITE_URL}/posts/${p.id}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Inkwell</title><link>${SITE_URL}</link><description>Notes on building for the web</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
