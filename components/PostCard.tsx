import Link from "next/link";
import Cover from "./Cover";
import { formatDate, readingTime } from "@/lib/format";
import type { Post } from "@/lib/types";

export function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent ${
        size === "lg" ? "size-12 text-base" : "size-9 text-xs"
      }`}
    >
      {initials}
    </span>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={post.author} />
      <div className="text-[13px] leading-snug text-muted">
        <p className="font-semibold text-ink">{post.author}</p>
        <p>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {readingTime(post.content)} min read
        </p>
      </div>
    </div>
  );
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  if (featured) {
    return (
      <article className="group relative flex flex-col-reverse overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-300 hover:shadow-lg md:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-5 p-6 md:p-12">
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Featured</span>
            <span className="font-semibold text-accent">{post.category}</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-[2rem]">
            <Link href={`/posts/${post.id}`} className="after:absolute after:inset-0 after:content-['']">
              {post.title}
            </Link>
          </h2>
          <p className="leading-relaxed text-muted md:text-lg">{post.excerpt}</p>
          <Meta post={post} />
        </div>
        <Cover
          hue={post.coverHue}
          image={post.image}
          priority
          sizes="(min-width: 1120px) 515px, (min-width: 768px) 46vw, 100vw"
          className="h-60 w-full md:h-auto md:min-h-[360px] md:w-[46%]"
        />
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <Cover
          hue={post.coverHue}
          image={post.image}
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
          className="aspect-[16/10] w-full"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="text-lg font-semibold leading-snug">
          <Link href={`/posts/${post.id}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-auto pt-3">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}
