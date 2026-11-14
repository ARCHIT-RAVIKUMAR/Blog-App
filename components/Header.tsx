import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-accent text-base font-bold text-white">
            I
          </span>
          Inkwell
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 text-sm font-medium text-white/70">
            <li><Link href="/" className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white">Articles</Link></li>
            <li><Link href="/about" className="rounded-full px-4 py-2 hover:bg-white/10 hover:text-white">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
