import Link from "next/link";
import Cover from "./Cover";
import CategoryTag from "./CategoryTag";
import { formatDate, readingTime } from "@/lib/format";
import type { Post } from "@/lib/types";

type Tone = "light" | "dark";

export function Avatar({ name, size = "sm", tone = "light" }: { name: string; size?: "sm" | "lg"; tone?: Tone }) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${
        tone === "dark" ? "bg-white/15 text-white" : "bg-accent-soft text-accent"
      } ${size === "lg" ? "size-12 text-base" : "size-9 text-xs"}`}
    >
      {initials}
    </span>
  );
}

export function Meta({ post, tone = "light" }: { post: Post; tone?: Tone }) {
  const dark = tone === "dark";
  return (
    <div className="flex items-center gap-3">
      <Avatar name={post.author} tone={tone} />
      <div className={`text-[13px] leading-snug ${dark ? "text-white/70" : "text-muted"}`}>
        <p className={`font-semibold ${dark ? "text-white" : "text-ink"}`}>{post.author}</p>
        <p>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {readingTime(post.content)} min read
        </p>
      </div>
    </div>
  );
}

type Props = { post: Post; variant?: "hero" | "card" | "row" };

export default function PostCard({ post, variant = "card" }: Props) {
  const href = `/posts/${post.id}`;
  const stretch = "after:absolute after:inset-0 after:content-['']";

  if (variant === "hero") {
    return (
      <article className="group relative isolate flex min-h-[440px] flex-col justify-end overflow-hidden rounded-3xl bg-ink text-white md:min-h-[520px]">
        <div className="absolute inset-0 -z-10">
          <Cover
            hue={post.coverHue}
            image={post.image}
            priority
            sizes="(min-width: 1120px) 760px, 100vw"
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/45 to-black/5" />
        <div className="flex max-w-2xl flex-col gap-4 p-6 md:p-10">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">Top story</span>
            <CategoryTag category={post.category} />
          </div>
          <h2 className="text-3xl font-bold leading-[1.08] text-balance md:text-5xl">
            <Link href={href} className={stretch}>{post.title}</Link>
          </h2>
          <p className="line-clamp-2 text-white/80 md:text-lg">{post.excerpt}</p>
          <Meta post={post} tone="dark" />
        </div>
      </article>
    );
  }

  if (variant === "row") {
    return (
      <article className="group relative flex gap-4 rounded-2xl border border-line bg-white p-3 transition-shadow duration-300 hover:shadow-lg sm:gap-6 sm:p-4">
        <Cover
          hue={post.coverHue}
          image={post.image}
          sizes="176px"
          className="aspect-square w-28 shrink-0 rounded-xl sm:aspect-[4/3] sm:w-44"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1">
          <CategoryTag category={post.category} className="w-fit" />
          <h2 className="text-base font-bold leading-snug sm:text-xl">
            <Link href={href} className={stretch}>{post.title}</Link>
          </h2>
          <p className="hidden line-clamp-2 text-sm leading-relaxed text-muted sm:block">{post.excerpt}</p>
          <p className="text-xs text-muted">
            {post.author} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {readingTime(post.content)} min read
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <Cover
          hue={post.coverHue}
          image={post.image}
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
          className="aspect-[16/10] w-full"
        />
        <CategoryTag category={post.category} className="absolute left-4 top-4 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="text-xl font-bold leading-snug">
          <Link href={href} className={stretch}>{post.title}</Link>
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-auto pt-3">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}
