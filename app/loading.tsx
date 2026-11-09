export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
      <div className="h-14 w-2/3 animate-pulse rounded-xl bg-line" />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-line/70" />
        ))}
      </div>
    </div>
  );
}
