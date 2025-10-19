import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import HomeView from "@/views/dashboard/HomeView";

type HomeProps = Readonly<{
  searchParams: Promise<{
    category?: string;
  }>;
}>;

export default async function HomePage({ searchParams }: HomeProps) {
  const { category } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetchInfinite({
    categoryId: category,
    limit: DEFAULT_VIDEOS_LIMIT,
  });

  return (
    <HydrateClient>
      <HomeView categoryId={category} />
    </HydrateClient>
  );
}
