import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Inkwell and the people who write it.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pt-12 sm:px-8 sm:pt-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About Inkwell</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Inkwell is a small blog about engineering, design and accessibility. The articles are short and practical,
        written for people who build products for the web.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-ink/80">
        This site is built with Next.js, React Query and Tailwind CSS. It renders on the server for fast first loads
        and good search visibility.
      </p>
    </div>
  );
}
