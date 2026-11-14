import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard, { Avatar } from "@/components/PostCard";
import CategoryTag from "@/components/CategoryTag";
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
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="bg-ink pb-28 pt-10 text-white sm:pb-40 sm:pt-14">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li><Link href="/#articles" className="hover:text-white">Articles</Link></li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/?category=${encodeURIComponent(post.category)}#articles`} className="hover:text-white">
                  {post.category}
                </Link>
              </li>
            </ol>
          </nav>

          <CategoryTag category={post.category} className="mt-8" />
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-balance sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-white/75">{post.excerpt}</p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={post.author} tone="dark" />
              <div className="text-sm leading-snug text-white/70">
                <p className="font-semibold text-white">{post.author}</p>
                <p>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {readingTime(post.content)} min read
                </p>
              </div>
            </div>
            <CopyLink tone="dark" />
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-20 max-w-[1000px] px-5 sm:-mt-32 sm:px-8">
        <Cover
          hue={post.coverHue}
          image={post.image}
          alt={post.title}
          priority
          sizes="(min-width: 1000px) 936px, 100vw"
          className="aspect-[16/8] w-full rounded-2xl shadow-2xl"
        />

        <div className="mx-auto mt-12 flex max-w-[720px] flex-col gap-5 text-[1.0625rem] leading-[1.85] text-ink/85">
          {post.content.split(/\n\s*\n/).map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="mt-5 text-3xl font-bold text-ink">{block.slice(3)}</h2>
            ) : (
              <p key={i}>{block}</p>
            ),
          )}

          <aside aria-label="About the author" className="mt-7 flex items-center gap-4 rounded-2xl border border-line bg-white p-6">
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
            <h2 id="related" className="text-3xl font-bold">Keep reading</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} className="h-full">
                  <PostCard post={r} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
