# Inkwell: a Next.js blog

A server-rendered blog built with the Next.js App Router, React Query and Tailwind CSS.

**Live demo:** _add your deployed URL here_
**Screenshots:** _add to `/docs/screenshots` and link here_

## Features

| Requirement | Implementation |
| --- | --- |
| Latest stable Next.js | Next.js 15 (App Router), React 19, TypeScript |
| Mock API | `MOCK_API_URL` points at a [mockapi.io](https://mockapi.io) resource. If unset, the app serves bundled seed data from its own `/api/posts` route, so it runs with zero setup. |
| React Query | Posts are prefetched on the server and hydrated on the client (`HydrationBoundary`), then cached with a 60s stale time. |
| SSR homepage | `app/page.tsx` is dynamically rendered; the article list is present in the initial HTML. |
| Dynamic routing | `app/posts/[id]/page.tsx`, with a custom `not-found` page. |
| Search | Instant client-side filtering across title, excerpt, category and author. `useDeferredValue` keeps typing responsive, and the query is mirrored to `?q=` so results are shareable and server-rendered state matches. |
| Tailwind UI | Tailwind v4 design tokens in `globals.css`, fully responsive from 320px up. |
| SEO | Per-page `generateMetadata`, canonical URLs, Open Graph/Twitter tags, JSON-LD `BlogPosting`, `sitemap.xml`, `robots.txt`, RSS at `/feed.xml`. |
| Accessibility | Skip link, landmarks, labelled search with a live results count, `:focus-visible` rings, semantic `<article>`/`<time>`, decorative art hidden from screen readers, `prefers-reduced-motion` respected. |
| API routes | `GET /api/posts` and `GET /api/posts/:id`. |

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Using mockapi.io

1. Create a project and a `posts` resource with fields: `title`, `excerpt`, `content`, `author`, `authorRole`, `category`, `coverHue` (number), `publishedAt` (ISO date string).
2. Import the entries from `lib/data.ts` (generate 8 records, or paste them in).
3. Set `MOCK_API_URL=https://<id>.mockapi.io/api/v1/posts` in `.env.local`.

## Project structure

```
app/
  page.tsx               SSR homepage, prefetches into React Query
  posts/[id]/page.tsx    Article page + metadata + JSON-LD
  api/posts/...          Route handlers
  sitemap.ts robots.ts feed.xml/route.ts
components/
  PostList.tsx           Client island: query + search + states
  PostCard.tsx Cover.tsx Header.tsx Footer.tsx Providers.tsx
lib/
  posts.ts               Data access (mockapi or seed), helpers
  data.ts types.ts
```

**State management:** server data lives in React Query; the only local state is the search string. The client boundary is limited to `PostList` and `Providers`; everything else is a server component.

## Design notes

Plus Jakarta Sans throughout, white background, one blue accent. Covers come from the `image` field (seed data uses picsum.photos); posts without an image fall back to generated art. Update `@theme` in `app/globals.css` to retune colours and fonts.

If you are matching a specific reference design, adjust tokens in `globals.css` and the spacing in `PostCard.tsx` and `app/page.tsx`.

## Deploy

Push to GitHub, import the repo on [Vercel](https://vercel.com), and set `NEXT_PUBLIC_SITE_URL` (plus `MOCK_API_URL` if used).

## Scripts

`npm run dev` · `npm run build` · `npm start`
