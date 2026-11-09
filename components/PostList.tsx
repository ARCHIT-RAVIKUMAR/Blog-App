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

export default function PostList({ initialQuery = "" }: { initialQuery?: string }) {
  const { data: posts = [], isError, refetch } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const deferred = useDeferredValue(query);
  const inputId = useId();

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const results = useMemo(() => {
    const terms = deferred.toLowerCase().split(/\s+/).filter(Boolean);
    return posts.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      const haystack = `${p.title} ${p.excerpt} ${p.category} ${p.author}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [posts, deferred, category]);

  function onChange(value: string) {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }

  const filtering = deferred.trim().length > 0 || category !== "All";

  return (
    <div id="articles">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Our most recent articles</h1>
          <p className="mt-2 text-muted">Engineering, design and accessibility, written by the people doing the work.</p>
        </div>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="w-full sm:w-72">
          <label htmlFor={inputId} className="sr-only">Search articles</label>
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search articles"
              autoComplete="off"
              className="h-11 w-full rounded-lg border border-line bg-white pl-10 pr-3 text-sm placeholder:text-muted focus:border-accent"
            />
          </div>
        </form>
      </div>

      <div role="group" aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {results.length} {results.length === 1 ? "article" : "articles"} shown
      </p>

      {isError ? (
        <div role="alert" className="mt-8 rounded-2xl border border-line p-8">
          <p className="text-lg font-semibold">We couldn’t load the articles.</p>
          <p className="mt-1 text-muted">Check your connection and try again.</p>
          <button onClick={() => refetch()} className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white">
            Try again
          </button>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="text-lg font-semibold">No articles match your search.</p>
          <p className="mt-1 text-muted">Try a different word or pick another category.</p>
          <button
            onClick={() => { onChange(""); setCategory("All"); }}
            className="mt-4 rounded-lg border border-line px-5 py-2.5 text-sm font-medium hover:bg-subtle"
          >
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
    </div>
  );
}
