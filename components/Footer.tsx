import Link from "next/link";
import { getPosts } from "@/lib/posts";

export default async function Footer() {
  let topics: string[] = [];
  try {
    topics = Array.from(new Set((await getPosts()).map((p) => p.category)));
  } catch {
    // The footer should never take the whole page down.
  }

  return (
    <footer className="mt-24 border-t border-line bg-subtle">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-md bg-accent text-sm font-bold text-white">I</span>
            Inkwell
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Short, practical writing on engineering, design and accessibility for people who build products for the web.
          </p>
        </div>

        <nav aria-label="Topics">
          <h2 className="text-sm font-semibold">Topics</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {topics.map((t) => (
              <li key={t}>
                <Link href={`/?category=${encodeURIComponent(t)}`} className="hover:text-ink">{t}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="text-sm font-semibold">Site</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/" className="hover:text-ink">All articles</Link></li>
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-ink">Sitemap</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1120px] px-5 py-6 text-sm text-muted sm:px-8">
          © {new Date().getFullYear()} Inkwell. Built with Next.js, React Query and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
