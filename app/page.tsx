import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "All" } = await searchParams;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["posts"], queryFn: getPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* key remounts the list when the URL filters change via a link (e.g. footer topics) */}
      <PostList key={`${q}|${category}`} initialQuery={q} initialCategory={category} />
    </HydrationBoundary>
  );
}
