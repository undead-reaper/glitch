import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import LikedView from "@/views/dashboard/LikedView";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

const LikedPage = async () => {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    unauthorized();
  }

  void trpc.playlists.getLiked.prefetchInfinite({
    limit: DEFAULT_VIDEOS_LIMIT,
  });

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
};

export default LikedPage;
