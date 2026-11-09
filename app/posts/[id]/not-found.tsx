import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-4xl font-extrabold">That article doesn’t exist.</h1>
      <p className="mt-3 text-muted">It may have been moved or removed.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 font-medium text-white">
        Browse all articles
      </Link>
    </div>
  );
}
