export default function Cover({
  hue,
  image,
  className = "",
}: {
  hue: number;
  image?: string;
  className?: string;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }

  const a = `hsl(${hue} 85% 58%)`;
  const b = `hsl(${(hue + 40) % 360} 90% 72%)`;
  const c = `hsl(${(hue + 320) % 360} 70% 22%)`;
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${c}, ${a})` }}
    >
      <div
        className="absolute -right-10 -top-10 size-2/3 rounded-full opacity-90"
        style={{ background: `radial-gradient(circle at 30% 30%, ${b}, transparent 70%)` }}
      />
      <div className="absolute -bottom-16 left-6 size-3/5 rotate-12 rounded-[2.5rem] bg-white/15 ring-1 ring-white/30" />
    </div>
  );
}
