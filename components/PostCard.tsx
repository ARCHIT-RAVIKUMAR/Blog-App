import Link from "next/link";
import Cover from "./Cover";
import { formatDate, readingTime } from "@/lib/posts";
import type { Post } from "@/lib/types";

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-muted">
      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">
        {post.author.split(" ").map((n) => n[0]).join("")}
      </span>
      <span className="font-medium text-ink">{post.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
    </div>
  );
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const mins = readingTime(post.content);

  if (featured) {
    return (
      <article className="group relative flex flex-col-reverse overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-md md:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-10">
          <span className="w-fit rounded-md bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
            {post.category}
          </span>
          <h2 className="text-2xl font-bold leading-snug md:text-[1.75rem]">
            <Link href={`/posts/${post.id}`} className="after:absolute after:inset-0 after:content-['']">
              {post.title}
            </Link>
          </h2>
          <p className="leading-relaxed text-muted">{post.excerpt}</p>
          <Meta post={post} />
        </div>
        <Cover hue={post.coverHue} image={post.image} className="h-60 w-full md:h-auto md:min-h-[320px] md:w-[46%]" />
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-md">
      <div className="relative">
        <Cover hue={post.coverHue} image={post.image} className="aspect-[16/10] w-full" />
        <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium">
          {mins} min read
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-semibold text-accent">{post.category}</p>
        <h2 className="text-lg font-semibold leading-snug">
          <Link href={`/posts/${post.id}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-auto pt-2">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}
