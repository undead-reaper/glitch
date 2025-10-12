import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import TrendingView from "@/views/dashboard/TrendingView";

;

export default async function TrendingPage() {
  void trpc.videos.getTrending.prefetchInfinite({
    limit: DEFAULT_VIDEOS_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
}
