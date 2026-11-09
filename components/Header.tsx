import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-md bg-accent text-sm font-bold text-white">
            I
          </span>
          Inkwell
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 text-sm font-medium text-muted">
            <li><Link href="/" className="rounded-md px-3 py-2 hover:text-ink">Articles</Link></li>
            <li><Link href="/about" className="rounded-md px-3 py-2 hover:text-ink">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
