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
    <footer className="mt-24 bg-ink text-white/70">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-white">
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-accent text-base font-bold">I</span>
            Inkwell
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Short, practical writing on engineering, design and accessibility for people who build products for the web.
          </p>
        </div>

        <nav aria-label="Topics">
          <h2 className="text-sm font-semibold text-white">Topics</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {topics.map((t) => (
              <li key={t}>
                <Link href={`/?category=${encodeURIComponent(t)}`} className="hover:text-white">{t}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="text-sm font-semibold text-white">Site</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-white">All articles</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1120px] px-5 py-6 text-sm sm:px-8">
          © {new Date().getFullYear()} Inkwell. Built with Next.js, React Query and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
