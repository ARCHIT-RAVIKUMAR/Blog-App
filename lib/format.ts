export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
