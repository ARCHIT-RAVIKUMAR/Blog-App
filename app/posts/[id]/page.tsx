import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/PostCard";
import PostCard from "@/components/PostCard";
import Cover from "@/components/Cover";
import CopyLink from "@/components/CopyLink";
import { formatDate, readingTime } from "@/lib/format";
import { SITE_URL, getPost, getPosts } from "@/lib/posts";

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
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const others = (await getPosts()).filter((p) => p.id !== post.id);
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    mainEntityOfPage: `${SITE_URL}/posts/${post.id}`,
  };

  return (
    <article className="mx-auto max-w-[1000px] px-5 pt-10 sm:px-8 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-[720px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-ink">Articles</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/?category=${encodeURIComponent(post.category)}`} className="hover:text-ink">{post.category}</Link></li>
          </ol>
        </nav>

        <header className="mt-6">
          <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
            <div className="flex items-center gap-3">
              <Avatar name={post.author} />
              <div className="text-sm leading-snug text-muted">
                <p className="font-semibold text-ink">{post.author}</p>
                <p>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {readingTime(post.content)} min read
                </p>
              </div>
            </div>
            <CopyLink />
          </div>
        </header>
      </div>

      <Cover
        hue={post.coverHue}
        image={post.image}
        alt={post.title}
        priority
        sizes="(min-width: 1000px) 936px, 100vw"
        className="mt-10 aspect-[16/8] w-full rounded-2xl"
      />

      <div className="mx-auto mt-10 max-w-[720px] flex flex-col gap-5 text-[1.0625rem] leading-[1.85] text-ink/85">
        {post.content.split(/\n\s*\n/).map((block, i) =>
          block.startsWith("## ") ? (
            <h2 key={i} className="mt-5 text-2xl font-bold tracking-tight text-ink">
              {block.slice(3)}
            </h2>
          ) : (
            <p key={i}>{block}</p>
          ),
        )}

        <aside aria-label="About the author" className="mt-7 flex items-center gap-4 rounded-2xl border border-line bg-subtle p-6">
          <Avatar name={post.author} size="lg" />
          <div>
            <p className="font-semibold text-ink">{post.author}</p>
            <p className="text-sm leading-relaxed text-muted">
              {post.authorRole} at Inkwell. Writes about {post.category.toLowerCase()} and building for the web.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20">
          <h2 id="related" className="text-2xl font-bold tracking-tight">Keep reading</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.id} className="h-full">
                <PostCard post={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
