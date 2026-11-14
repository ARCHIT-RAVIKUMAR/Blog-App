import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Inkwell and how this blog is built.",
  alternates: { canonical: "/about" },
};

const stack = [
  ["Next.js 15", "App Router, server rendering, dynamic routes and route handlers"],
  ["React Query", "Server prefetch, client hydration and caching"],
  ["Tailwind CSS 4", "Responsive layout and design tokens"],
  ["TypeScript", "Typed data model shared by the API and the UI"],
];

export default function About() {
  return (
    <div className="mx-auto max-w-[720px] px-5 pt-12 sm:px-8 sm:pt-16">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">About Inkwell</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        Inkwell is a small blog about engineering, design and accessibility. The articles are short and practical,
        written for people who build products for the web.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">How it is built</h2>
      <dl className="mt-5 divide-y divide-line rounded-2xl border border-line">
        {stack.map(([name, desc]) => (
          <div key={name} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:gap-6">
            <dt className="w-40 shrink-0 font-semibold">{name}</dt>
            <dd className="text-muted">{desc}</dd>
          </div>
        ))}
      </dl>

      <Link href="/" className="mt-10 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white">
        Read the articles
      </Link>
    </div>
  );
}
