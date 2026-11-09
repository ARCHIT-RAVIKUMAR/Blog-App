import type { Post } from "./types";

export const seedPosts: Post[] = [
  {
    id: "1",
    title: "Server components changed how I think about data fetching",
    excerpt:
      "Moving fetches to the server removes a surprising amount of client code. Here is what stayed, what went away, and what I would do differently.",
    content:
      "For years the default pattern was a component that mounts, fires a request in an effect, and shows a spinner. It works, but every piece of that flow ships to the browser.\n\nWith server components the request happens before any HTML is sent. The component simply awaits its data and returns markup. There is no loading state to design for the first paint, and no waterfall of requests that begin only after the JavaScript has downloaded.\n\nClient components still have a job. Anything that responds to input, such as search boxes, menus and optimistic updates, belongs on the client. The trick is to keep that boundary small and pass it plain, serializable props.",
    author: "Archit Ravikumar",
    authorRole: "Staff engineer",
    category: "Engineering",
    coverHue: 228,
    image: "https://picsum.photos/seed/inkwell-1/1200/800",
    publishedAt: "2026-09-28",
  },
  {
    id: "2",
    title: "A field guide to spacing in interfaces",
    excerpt:
      "Consistent spacing is the cheapest way to make a layout feel deliberate. A short scale, applied without exceptions, does most of the work.",
    content:
      "Pick a base unit and stay with it. Four pixels is a good start because it divides cleanly and keeps touch targets honest.\n\nBuild a scale from that unit: 4, 8, 12, 16, 24, 32, 48, 64. Resist the urge to add a value for one special case. When something looks off, it is usually because two neighbours disagree about their distance, not because the scale is missing a number.\n\nGroup related things closer than unrelated things. A heading belongs to the paragraph beneath it, so the gap above should be larger than the gap below.",
    author: "Rohan",
    authorRole: "Product designer",
    category: "Design",
    coverHue: 150,
    image: "https://picsum.photos/seed/inkwell-2/1200/800",
    publishedAt: "2026-09-21",
  },
  {
    id: "3",
    title: "Why your focus ring is not optional",
    excerpt:
      "Keyboard users rely on a visible focus indicator to know where they are. Removing it saves a little polish and costs a lot of usability.",
    content:
      "Outlines get removed because the default ring can clash with a design. The fix is to restyle it, not to delete it.\n\nUse :focus-visible so the ring appears for keyboard navigation but not for most mouse clicks. Give it at least a three to one contrast ratio against the adjacent colours, and offset it a couple of pixels so it does not collide with borders.\n\nTest by unplugging your mouse for ten minutes. Every place you get lost is a bug.",
    author: "Priya Nair",
    authorRole: "Accessibility lead",
    category: "Accessibility",
    coverHue: 18,
    image: "https://picsum.photos/seed/inkwell-3/1200/800",
    publishedAt: "2026-09-14",
  },
  {
    id: "4",
    title: "Caching without lying to your users",
    excerpt:
      "Stale data is fine when people know it might be stale. Good caching is as much about communication as it is about headers.",
    content:
      "A cache is a bet that the answer has not changed. Most of the time the bet pays off, and the page feels instant.\n\nReact Query makes the trade explicit. A stale time says how long a result counts as fresh, and background refetching quietly corrects it afterwards. People see content immediately and the content catches up.\n\nThe failure mode is silent staleness on things that matter, like prices or stock. For those, shorten the window or invalidate on every mutation.",
    author: "Maya",
    authorRole: "Staff engineer",
    category: "Engineering",
    coverHue: 262,
    image: "https://picsum.photos/seed/inkwell-4/1200/800",
    publishedAt: "2026-09-07",
  },
  {
    id: "5",
    title: "Writing headlines that earn the click and the read",
    excerpt:
      "A headline is a promise. The best ones are specific, honest about the payoff, and short enough to scan in a feed.",
    content:
      "Start with what the reader gets. If the article teaches a technique, name the technique. If it argues a position, state the position.\n\nSpecifics beat adjectives. Cut the amazing and the ultimate, and add the number, the tool or the constraint that makes the piece different from the ten others on the same topic.\n\nThen read the first paragraph and check that it keeps the promise. A headline that over-delivers in the title and under-delivers in the text costs you the next visit.",
    author: "Lena",
    authorRole: "Editor",
    category: "Writing",
    coverHue: 38,
    image: "https://picsum.photos/seed/inkwell-5/1200/800",
    publishedAt: "2026-08-30",
  },
  {
    id: "6",
    title: "Performance budgets that teams actually keep",
    excerpt:
      "A budget nobody checks is a wish. Put the number in CI, make it fail loudly, and review it when it moves.",
    content:
      "Choose two or three metrics that map to real experience: largest contentful paint, total blocking time and shipped JavaScript in kilobytes.\n\nSet the budget slightly below where you are today, not at an aspirational target. The aim is to stop regressions first and improve second.\n\nWhen a pull request breaks the budget, treat it like a failing test. Either fix it, or raise the limit in the same change with a sentence explaining why.",
    author: "Aaron",
    authorRole: "Product designer",
    category: "Engineering",
    coverHue: 196,
    image: "https://picsum.photos/seed/inkwell-6/1200/800",
    publishedAt: "2026-08-23",
  },
  {
    id: "7",
    title: "Color palettes that pass contrast on the first try",
    excerpt:
      "Start from lightness, not hue. If your steps differ enough in luminance, accessible pairings fall out for free.",
    content:
      "Most palettes fail contrast because the mid tones are too close together. Hue is fun to pick, but readability is decided by lightness.\n\nBuild each hue as a ramp with even lightness steps. Then you know that step 700 on step 50 will pass for body text, regardless of whether the hue is blue or orange.\n\nDocument the safe pairings next to the swatches. Designers will use what is easy to find.",
    author: "Priya Nair",
    authorRole: "Accessibility lead",
    category: "Design",
    coverHue: 330,
    image: "https://picsum.photos/seed/inkwell-7/1200/800",
    publishedAt: "2026-08-16",
  },
  {
    id: "8",
    title: "Small habits for readable pull requests",
    excerpt:
      "Reviewers give better feedback on small, well-described changes. A few habits make that the default instead of the exception.",
    content:
      "Keep a pull request to one idea. If the description needs the word and more than once, it probably wants to be two changes.\n\nWrite the description for someone who has not seen the ticket. Say what changed, why it changed, and how you checked it works.\n\nLeave comments on your own diff where the code is surprising. It saves the reviewer a round trip and often exposes a better approach before anyone else reads it.",
    author: "Achu",
    authorRole: "Editor",
    category: "Writing",
    coverHue: 98,
    image: "https://picsum.photos/seed/inkwell-8/1200/800",
    publishedAt: "2026-08-09",
  },
];
