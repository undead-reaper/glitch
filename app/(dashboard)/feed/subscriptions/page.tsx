import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import SubscribedVideosView from "@/views/dashboard/SubscribedVideosView";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

// Force dynamic rendering since this page requires authentication
export const dynamic = "force-dynamic";

const SubscriptionsPage = async () => {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    unauthorized();
  }

  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_VIDEOS_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscribedVideosView />
    </HydrateClient>
  );
};

export default SubscriptionsPage;
