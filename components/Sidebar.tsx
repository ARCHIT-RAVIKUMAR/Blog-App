import Link from "next/link";
import type { Post } from "@/lib/types";

type Props = {
  categories: string[];
  counts: Record<string, number>;
  active: string;
  onCategory: (c: string) => void;
  picks: Post[];
};

export default function Sidebar({ categories, counts, active, onCategory, picks }: Props) {
  return (
    <aside aria-label="Sidebar" className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
      <section aria-labelledby="topics-title" className="rounded-2xl border border-line bg-white p-6">
        <h2 id="topics-title" className="text-lg font-bold">Topics</h2>
        <ul className="mt-4 space-y-1">
          {categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                aria-pressed={active === c}
                onClick={() => onCategory(c)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active === c ? "bg-ink text-white" : "hover:bg-subtle"
                }`}
              >
                {c === "All" ? "All topics" : c}
                <span className={`text-xs ${active === c ? "text-white/70" : "text-muted"}`}>{counts[c] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {picks.length > 0 && (
        <section aria-labelledby="picks-title" className="rounded-2xl border border-line bg-white p-6">
          <h2 id="picks-title" className="text-lg font-bold">Editor’s picks</h2>
          <ol className="mt-5 space-y-5">
            {picks.map((p, i) => (
              <li key={p.id} className="group relative flex gap-4">
                <span aria-hidden="true" className="font-display text-3xl font-bold leading-none text-accent/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs font-medium text-muted">{p.category}</p>
                  <Link
                    href={`/posts/${p.id}`}
                    className="font-semibold leading-snug after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
                  >
                    {p.title}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-2xl bg-ink p-6 text-white">
        <h2 className="text-lg font-bold">About Inkwell</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Short, practical writing from engineers, designers and editors who build for the web.
        </p>
        <Link href="/about" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
          Learn more →
        </Link>
      </section>
    </aside>
  );
}
