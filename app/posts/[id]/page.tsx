import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import { SITE_URL, formatDate, getPost, getPosts, readingTime } from "@/lib/posts";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: `/posts/${post.id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
      url: `/posts/${post.id}`,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const related = (await getPosts()).filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    mainEntityOfPage: `${SITE_URL}/posts/${post.id}`,
  };

  return (
    <article className="mx-auto max-w-[760px] px-5 pt-10 sm:px-8 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
          <span aria-hidden="true">←</span> Back to articles
        </Link>
      </nav>

      <header className="mt-6">
        <span className="rounded-md bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">{post.category}</span>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-[2.5rem]">{post.title}</h1>
        <div className="mt-6 flex items-center gap-3 text-sm text-muted">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </span>
          <div className="leading-snug">
            <p className="font-medium text-ink">{post.author}</p>
            <p>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {readingTime(post.content)} min read
            </p>
          </div>
        </div>
      </header>

      <Cover hue={post.coverHue} image={post.image} className="mt-8 aspect-[16/9] w-full rounded-2xl" />

      <p className="mt-8 text-xl leading-relaxed text-ink/80">{post.excerpt}</p>
      <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.8] text-ink/85">
        {post.content.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {related.length > 0 && (
        <aside aria-labelledby="related" className="mt-14 border-t border-line pt-8">
          <h2 id="related" className="text-lg font-semibold">More in {post.category}</h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/posts/${r.id}`} className="font-medium text-accent hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
