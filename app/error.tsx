"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong.</h1>
      <p className="mt-3 text-muted">We couldn’t load this page. Try again in a moment.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-accent px-6 py-3 font-semibold text-white">
        Try again
      </button>
    </div>
  );
}
