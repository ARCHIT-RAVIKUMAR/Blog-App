export default function Loading() {
  return (
    <div role="status" aria-label="Loading articles">
      <div className="bg-ink">
        <div className="mx-auto max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="h-16 w-3/4 max-w-2xl animate-pulse rounded-2xl bg-white/15" />
          <div className="mt-8 h-14 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-[1120px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_320px]">
        <div className="h-[420px] animate-pulse rounded-3xl bg-line" />
        <div className="hidden h-80 animate-pulse rounded-2xl bg-line/70 lg:block" />
      </div>
    </div>
  );
}
