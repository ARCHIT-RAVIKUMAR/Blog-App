const styles: Record<string, string> = {
  Engineering: "bg-sky-100 text-sky-800",
  Design: "bg-fuchsia-100 text-fuchsia-800",
  Accessibility: "bg-emerald-100 text-emerald-800",
  Writing: "bg-amber-100 text-amber-800",
};

export default function CategoryTag({ category, className = "" }: { category: string; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        styles[category] ?? "bg-stone-200 text-stone-800"
      } ${className}`}
    >
      {category}
    </span>
  );
}
