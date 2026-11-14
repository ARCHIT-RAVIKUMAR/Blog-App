"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useId, useMemo, useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/lib/types";

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  if (!res.ok) throw new Error("Could not load posts");
  return res.json();
}

function syncUrl(q: string, category: string) {
  const url = new URL(window.location.href);
  if (q) url.searchParams.set("q", q);
  else url.searchParams.delete("q");
  if (category !== "All") url.searchParams.set("category", category);
  else url.searchParams.delete("category");
  window.history.replaceState(null, "", url);
}

type Props = { initialQuery?: string; initialCategory?: string };

export default function PostList({ initialQuery = "", initialCategory = "All" }: Props) {
  const { data: posts = [], isError, refetch } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const deferred = useDeferredValue(query);
  const inputId = useId();

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const activeCategory = categories.includes(category) ? category : "All";

  const results = useMemo(() => {
    const terms = deferred.toLowerCase().split(/\s+/).filter(Boolean);
    return posts.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      const haystack = `${p.title} ${p.excerpt} ${p.category} ${p.author}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [posts, deferred, activeCategory]);

  function onSearch(value: string) {
    setQuery(value);
    syncUrl(value, activeCategory);
  }
  function onCategory(value: string) {
    setCategory(value);
    syncUrl(query, value);
  }
  function clearFilters() {
    setQuery("");
    setCategory("All");
    syncUrl("", "All");
  }

  const filtering = deferred.trim().length > 0 || activeCategory !== "All";

  return (
    <>
      <section aria-labelledby="hero-title" className="border-b border-line bg-subtle">
        <div className="mx-auto max-w-[1120px] px-5 py-14 text-center sm:px-8 sm:py-20">
          <p className="mx-auto w-fit rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-muted">
            The Inkwell blog
          </p>
          <h1 id="hero-title" className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Notes on building for the web
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Short, practical articles on engineering, design and accessibility from people who ship products every day.
          </p>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="mx-auto mt-8 max-w-xl">
            <label htmlFor={inputId} className="sr-only">Search articles</label>
            <div className="relative">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search by title, topic or author"
                autoComplete="off"
                className="h-14 w-full rounded-xl border border-line bg-white pl-12 pr-4 text-base shadow-sm placeholder:text-muted focus:border-accent"
              />
            </div>
          </form>

          <div role="group" aria-label="Filter by category" className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={activeCategory === c}
                onClick={() => onCategory(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === c
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="articles" aria-labelledby="articles-title" className="mx-auto max-w-[1120px] px-5 pt-12 sm:px-8 sm:pt-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="articles-title" className="text-2xl font-bold tracking-tight">
            {filtering ? "Search results" : "Latest articles"}
          </h2>
          <p role="status" aria-live="polite" className="text-sm text-muted">
            {results.length} {results.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {isError ? (
          <div role="alert" className="mt-8 rounded-2xl border border-line p-8">
            <p className="text-lg font-semibold">We couldn’t load the articles.</p>
            <p className="mt-1 text-muted">Check your connection and try again.</p>
            <button onClick={() => refetch()} className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white">
              Try again
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-lg font-semibold">No articles match your search.</p>
            <p className="mt-1 text-muted">Try a different word or pick another category.</p>
            <button onClick={clearFilters} className="mt-5 rounded-lg border border-line px-5 py-2.5 text-sm font-medium hover:bg-subtle">
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((post, i) => {
              const featured = !filtering && i === 0;
              return (
                <li key={post.id} className={featured ? "md:col-span-2 lg:col-span-3" : "h-full"}>
                  <PostCard post={post} featured={featured} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
