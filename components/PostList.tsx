"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useId, useMemo, useState } from "react";
import PostCard from "./PostCard";
import Sidebar from "./Sidebar";
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

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: posts.length };
    for (const p of posts) result[p.category] = (result[p.category] ?? 0) + 1;
    return result;
  }, [posts]);

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
  const [top, ...rest] = results;
  const medium = rest.slice(0, 2);
  const list = rest.slice(2);
  const picks = posts.slice(2, 6);

  return (
    <>
      <section aria-labelledby="hero-title" className="bg-ink text-white">
        <div className="mx-auto max-w-[1120px] px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
          <p className="w-fit rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80">
            The Inkwell blog
          </p>
          <h1 id="hero-title" className="mt-6 max-w-3xl text-5xl font-bold leading-[1.02] text-balance sm:text-7xl">
            Notes on building for the <span className="text-accent">web</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Short, practical articles on engineering, design and accessibility from people who ship products every day.
          </p>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-10 max-w-xl">
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
                className="h-14 w-full rounded-full border-2 border-transparent bg-white pr-5 text-base text-ink placeholder:text-muted focus:border-accent"
                style={{ paddingLeft: "3.25rem" }}
              />
            </div>
          </form>

          <div role="group" aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={activeCategory === c}
                onClick={() => onCategory(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === c
                    ? "border-accent bg-accent text-white"
                    : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <section id="articles" aria-labelledby="articles-title">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="articles-title" className="text-3xl font-bold">
                {filtering ? "Search results" : "Latest articles"}
              </h2>
              <p role="status" aria-live="polite" className="text-sm text-muted">
                {results.length} {results.length === 1 ? "article" : "articles"}
              </p>
            </div>

            {isError ? (
              <div role="alert" className="mt-8 rounded-2xl border border-line bg-white p-8">
                <p className="text-lg font-semibold">We couldn’t load the articles.</p>
                <p className="mt-1 text-muted">Check your connection and try again.</p>
                <button onClick={() => refetch()} className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white">
                  Try again
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <p className="text-lg font-semibold">No articles match your search.</p>
                <p className="mt-1 text-muted">Try a different word or pick another topic.</p>
                <button onClick={clearFilters} className="mt-5 rounded-full border border-line px-6 py-2.5 text-sm font-semibold hover:bg-subtle">
                  Clear filters
                </button>
              </div>
            ) : filtering ? (
              <ul className="mt-8 space-y-4">
                {results.map((post) => (
                  <li key={post.id}><PostCard post={post} variant="row" /></li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 space-y-6">
                <PostCard post={top} variant="hero" />
                {medium.length > 0 && (
                  <ul className="grid gap-6 sm:grid-cols-2">
                    {medium.map((post) => (
                      <li key={post.id} className="h-full"><PostCard post={post} /></li>
                    ))}
                  </ul>
                )}
                {list.length > 0 && (
                  <ul className="space-y-4">
                    {list.map((post) => (
                      <li key={post.id}><PostCard post={post} variant="row" /></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          <Sidebar categories={categories} counts={counts} active={activeCategory} onCategory={onCategory} picks={picks} />
        </div>
      </div>
    </>
  );
}
