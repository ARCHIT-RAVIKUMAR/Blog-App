export type Post = {
  id: string;
  title: string;
  excerpt: string;
  /** Paragraphs separated by a blank line. Lines starting with "## " are section headings. */
  content: string;
  author: string;
  authorRole: string;
  category: string;
  coverHue: number;
  /** Optional cover image URL. Falls back to generated art when empty. */
  image?: string;
  publishedAt: string; // ISO date
};
