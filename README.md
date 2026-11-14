# Inkwell: a server-rendered blog with Next.js

A responsive, accessible, SEO-friendly blog built with the **Next.js App Router**, **React Query** and **Tailwind CSS**. The homepage is rendered on the server, articles live on dynamic routes, and posts are fetched from a mock API (mockapi.io) with a built-in fallback so the project runs with zero setup.

| | |
| --- | --- |
| **Live demo** | https://blog-app-seven-lilac.vercel.app |
| **Repository** | _add your GitHub repo URL_ |

---

## Screenshots

> Add your own images to `docs/screenshots/` using these names.

| Desktop home | Mobile home |
| --- | --- |
| ![Home, desktop](docs/screenshots/home-desktop.png) | ![Home, mobile](docs/screenshots/home-mobile.png) |

| Search and filter | Article page |
| --- | --- |
| ![Search results](docs/screenshots/search.png) | ![Article](docs/screenshots/article.png) |

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Environment variables](#environment-variables)
5. [Using mockapi.io](#using-mockapiio)
6. [How it works](#how-it-works)
7. [Project structure](#project-structure)
8. [Data model](#data-model)
9. [API reference](#api-reference)
10. [UI and design decisions](#ui-and-design-decisions)
11. [Responsive behaviour](#responsive-behaviour)
12. [SEO](#seo)
13. [Accessibility](#accessibility)
14. [Performance](#performance)
15. [Deployment](#deployment)
16. [Testing checklist](#testing-checklist)
17. [Trade-offs and future work](#trade-offs-and-future-work)

---

## Features

- **Server-side rendered homepage.** The article list is part of the first HTML response, not fetched after load.
- **Dynamic article pages** at `/posts/[id]` with a hero image, section headings, author box, copy-link button and a "Keep reading" section.
- **Live search** across title, excerpt, category and author.
- **Category filter** that combines with search. Both are mirrored in the URL (`/?category=Design&q=focus`), so filtered views are shareable and are rendered correctly on the server.
- **React Query** for data fetching, caching and background refetching, hydrated from the server prefetch so there is no loading flash.
- **Route handlers** (`/api/posts`, `/api/posts/:id`) acting as the application's API layer.
- **Loading, error, empty and not-found states** designed as part of the UI.
- **SEO**: per-page metadata, canonical URLs, Open Graph and Twitter tags, JSON-LD structured data, sitemap, robots.txt, generated social image.
- **Accessibility**: semantic landmarks, skip link, labelled controls, visible focus, live result count, reduced-motion support.
- **Optimised images** with `next/image` (responsive sizes, lazy loading, priority on above-the-fold images).

## Tech stack

| Area | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | Server components, SSR, file-based dynamic routes, route handlers, metadata API |
| UI | React 19 | Server and client components, `useDeferredValue` for responsive search |
| Data | TanStack React Query 5 | Caching, background refetch, server-to-client hydration |
| Styling | Tailwind CSS 4 | Utility-first, design tokens in CSS, responsive variants |
| Language | TypeScript | Shared `Post` type across API, data layer and UI |
| Font | Plus Jakarta Sans via `next/font` | Self-hosted at build time, no layout shift |
| Hosting | Vercel | First-class Next.js support |

## Getting started

Requirements: **Node.js 18.18 or newer** and npm.

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
cp .env.example .env.local     # Windows CMD: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and create a production build |
| `npm start` | Serve the production build |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MOCK_API_URL` | No | Full URL of a mockapi.io `posts` resource. If empty, the bundled seed data in `lib/data.ts` is used. |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Public URL of the site, used for canonical links, sitemap and Open Graph tags. Defaults to `http://localhost:3000`. |

## Using mockapi.io

1. Create a project at [mockapi.io](https://mockapi.io) and add a resource called `posts`.
2. Define these fields:

   | Field | Type |
   | --- | --- |
   | `title`, `excerpt`, `content`, `author`, `authorRole`, `category` | string |
   | `image` | string (URL) |
   | `coverHue` | number (used only when `image` is empty) |
   | `publishedAt` | string, ISO date such as `2026-09-28` |

3. Add posts. In `content`, separate paragraphs with a blank line, and start a line with `## ` to make a section heading.
4. Set the resource URL in `.env.local` and restart the dev server:

   ```
   MOCK_API_URL=https://<your-id>.mockapi.io/api/v1/posts
   ```

5. If your images come from a host other than `picsum.photos` or `images.unsplash.com`, add it under `images.remotePatterns` in `next.config.ts`.
6. Prefer not to depend on an external image host? Put files in `public/images/` and set `image` to a path like `/images/post-1.jpg`. Local paths work without any config.

If an image fails to load, the card falls back to a generated gradient instead of showing a broken-image icon.

## How it works

### Rendering strategy

| Route | Strategy | Reason |
| --- | --- | --- |
| `/` | Server-rendered on every request (`force-dynamic`) | Required SSR homepage; also honours `?q=` and `?category=` on the server |
| `/posts/[id]` | Server-rendered, data cached for 60s | Article content and metadata resolved on the server |
| `/about` | Static | No dynamic data |
| `/sitemap.xml`, `/robots.txt` | Generated | Built from the same data layer |
| `/api/*` | Route handlers | Application API |

### Data flow on the homepage

```
Request  ─▶  app/page.tsx (server component)
               │  reads ?q and ?category
               │  queryClient.prefetchQuery(["posts"], getPosts)
               ▼
             <HydrationBoundary state={dehydrate(queryClient)}>
               <PostList/>            ← client component
                 │  useQuery(["posts"]) is already populated, so no spinner
                 │  search + category are plain local state, filtered with useMemo
                 ▼
             HTML contains the full article list on first byte
```

On the server, `getPosts()` reads from mockapi.io (or the seed data). In the browser, React Query refetches through `/api/posts` only when the data becomes stale (60 seconds), so navigating back and forth does not hit the network repeatedly.

### State management

- **Server data:** React Query (`["posts"]` query).
- **UI state:** two `useState` values in `PostList` (search text and selected category). Search uses `useDeferredValue` so typing stays responsive while the list re-filters.
- **URL as shareable state:** the filters are written to the URL with `history.replaceState`, and read again on the server on a fresh load.
- No global store is needed because there is no shared client state.

### Server and client boundary

Most of the app is server components. Only components that need interactivity are client components:

| Client component | Reason |
| --- | --- |
| `PostList` | React Query hook, search and filter state |
| `Providers` | Creates the `QueryClient` |
| `CopyLink` | Clipboard API and click state |

## Project structure

```
app/
  layout.tsx                  Root layout, fonts, default metadata, skip link
  page.tsx                    SSR homepage, prefetches posts into React Query
  loading.tsx  error.tsx      Loading skeleton and error boundary
  about/page.tsx              About page
  posts/[id]/page.tsx         Dynamic article page + generateMetadata + JSON-LD
  posts/[id]/not-found.tsx    Article-specific 404
  api/posts/route.ts          GET /api/posts
  api/posts/[id]/route.ts     GET /api/posts/:id
  sitemap.ts  robots.ts       SEO routes
  opengraph-image.tsx         Generated social preview image
  icon.svg                    Favicon
components/
  PostList.tsx                Hero, search, category filter, grid, states (client)
  PostCard.tsx                Standard and featured card, Avatar
  Cover.tsx                   next/image wrapper with fallback art
  CopyLink.tsx                Copy-to-clipboard button (client)
  Header.tsx  Footer.tsx      Site chrome
  Providers.tsx               QueryClientProvider (client)
lib/
  posts.ts                    Data access: mockapi.io or seed data (server only)
  format.ts                   Pure helpers: formatDate, readingTime
  data.ts                     Seed posts
  types.ts                    Post type
docs/screenshots/             Images used in this README
```

`lib/posts.ts` (server only) and `lib/format.ts` (safe for the client) are separate on purpose, so the seed data never ends up in the browser bundle.

## Data model

```ts
type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;      // paragraphs split by a blank line; "## " starts a heading
  author: string;
  authorRole: string;
  category: string;
  coverHue: number;     // fallback gradient when there is no image
  image?: string;       // cover image URL
  publishedAt: string;  // ISO date
};
```

## API reference

### `GET /api/posts`

Returns all posts, newest first.

```json
[
  {
    "id": "1",
    "title": "Server components changed how I think about data fetching",
    "category": "Engineering",
    "author": "Archit Ravikumar",
    "publishedAt": "2026-09-28"
  }
]
```

(Response trimmed here; every field in the data model is included.)

- `200` on success, with `Cache-Control: s-maxage=60, stale-while-revalidate=300`.
- `502` with `{ "error": "Could not load posts" }` if the upstream API fails.

### `GET /api/posts/:id`

Returns one post.

- `200` with the post object.
- `404` with `{ "error": "Not found" }` if it does not exist.

## UI and design decisions

- **Layout:** a standard blog structure: top bar, hero with search and category pills, a featured article, then a three-column card grid, and a multi-column footer. This follows common blog patterns such as the Dribbble blog-page references.
- **Type:** one family (Plus Jakarta Sans) with a clear scale. Page title 36 to 48px, section titles 24px, card titles 18px, body 16 to 17px with generous line height (1.6 to 1.85) for reading.
- **Spacing:** based on a 4px unit. Cards use 24px inner padding and a 24px grid gap; sections are separated by 48 to 64px. Content width is capped at 1120px for lists and 720px for article text, which keeps lines near 70 characters.
- **Colour:** white page, light grey sections, near-black text, one blue accent (`#2f6bff`). Muted text (`#6b7280`) passes contrast on white.
- **Cards:** image with a category chip, title, two-line excerpt, then author, date and reading time. The whole card is clickable through a stretched link on the title, so there is one tab stop per card.
- **Article page:** wide hero image, narrow reading column, section headings, author box, and related articles.
- **Tokens:** colours and fonts are defined once in `app/globals.css` under `@theme`.

## Responsive behaviour

| Breakpoint | Behaviour |
| --- | --- |
| Under 768px | One column, featured card stacks with image first, smaller headings |
| 768px and up | Two columns, featured card becomes image and text side by side |
| 1024px and up | Three columns |

Tested widths: 320px, 375px, 768px, 1024px and 1440px. Images use `sizes` so phones download smaller files.

## SEO

- `generateMetadata` on article pages sets title, description, canonical URL, authors and Open Graph article data.
- Site-wide title template (`%s | Inkwell`), description, `metadataBase` and `lang="en"`.
- **JSON-LD** (`BlogPosting`) on every article.
- `sitemap.xml` and `robots.txt` generated from the data layer (the API routes are disallowed for crawlers).
- Generated Open Graph image for link previews.
- Server-rendered HTML, so content is available to crawlers without running JavaScript.
- One `h1` per page and a logical heading order.

## Accessibility

- Landmarks: `header`, `nav` (labelled), `main`, `footer`, `article`, `section`, `aside`.
- **Skip link** to main content.
- Search input has a label, and the results count is announced with `role="status"`.
- Category buttons expose their state with `aria-pressed`.
- `:focus-visible` outline on all interactive elements.
- Decorative images and icons are hidden from assistive technology; the article hero image has a text alternative.
- Dates use `<time datetime>`.
- `prefers-reduced-motion` disables transitions.
- Colour contrast checked for body, muted and accent text on their backgrounds.
- Errors use `role="alert"`.

## Performance

- Server components keep client JavaScript small (the homepage ships React Query and the list component, not the whole app).
- `next/image` serves resized, lazy-loaded images; the featured card and article hero use `priority`.
- Font is self-hosted through `next/font` with `display: swap`.
- API responses are cached (`revalidate: 60`, `s-maxage`).
- Run Lighthouse on the deployed URL and note the scores here: _Performance __ / Accessibility __ / Best Practices __ / SEO ___.

## Deployment

1. Push the repository to GitHub.
2. Import it on [Vercel](https://vercel.com) (no build settings need changing).
3. Deploy once, copy the production URL, then add environment variables:
   - `NEXT_PUBLIC_SITE_URL` = your production URL
   - `MOCK_API_URL` = your mockapi.io URL (optional)
4. Redeploy from the Deployments tab so the variables take effect.

## Testing checklist

- [ ] Homepage lists all posts, with the newest as the featured card
- [ ] View source shows the article titles in the HTML (confirms SSR)
- [ ] Search filters as you type; clearing restores the list
- [ ] Category pills filter, and combine with search
- [ ] Opening `/?category=Design` directly shows only Design posts
- [ ] Footer topic links filter the homepage
- [ ] Article page loads, breadcrumb and "Keep reading" links work
- [ ] `/posts/does-not-exist` shows the not-found page
- [ ] Empty search shows the "No articles match" state
- [ ] `/sitemap.xml` and `/robots.txt` load
- [ ] Keyboard only: skip link, filters, cards and buttons are reachable with a visible focus ring
- [ ] Layout works at 320px without horizontal scrolling

## Trade-offs and future work

- The homepage uses `force-dynamic` to satisfy the SSR requirement and to read filters from the URL. For a high-traffic production blog, ISR with a short `revalidate` would reduce server load.
- Search is client-side filtering of the loaded list, which is right for dozens of posts. For thousands, it should move to a query parameter handled by the API with pagination.
- Post content is plain text with `## ` headings. A real CMS would return Markdown or rich text.
- There is no write path (create, edit or delete posts); the app is read-only by design.
- Ideas: pagination, tags, an RSS feed, dark mode, automated tests (Vitest and Playwright).

## Design reference

The task referenced a Dribbble blog design. The shot itself was not accessible at build time, so the layout follows the conventions of the blog-page designs in that family (hero with search, featured article, card grid). Spacing, type scale and colours are defined in one place (`app/globals.css` and the component class names) and are easy to retune against the reference.
