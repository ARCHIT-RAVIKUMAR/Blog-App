import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["posts"], queryFn: getPosts });

  return (
    <div className="mx-auto max-w-[1120px] px-5 pt-12 sm:px-8 sm:pt-16">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostList initialQuery={q} />
      </HydrationBoundary>
    </div>
  );
}
