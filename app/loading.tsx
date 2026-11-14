export default function Loading() {
  return (
    <div role="status" aria-label="Loading articles">
      <div className="border-b border-line bg-subtle">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center px-5 py-20 sm:px-8">
          <div className="h-12 w-3/4 max-w-xl animate-pulse rounded-xl bg-line" />
          <div className="mt-6 h-14 w-full max-w-xl animate-pulse rounded-xl bg-line/70" />
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-[1120px] gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-line/60" />
        ))}
      </div>
    </div>
  );
}
