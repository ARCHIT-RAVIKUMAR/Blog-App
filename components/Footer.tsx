export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-1 px-5 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Inkwell</p>
        <p>Built with Next.js and Tailwind CSS</p>
      </div>
    </footer>
  );
}
