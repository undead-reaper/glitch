import { DEFAULT_PLAYLISTS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import PlaylistView from "@/views/dashboard/PlaylistsView";

;

const PlaylistsPage = async () => {
  void trpc.playlists.getUserPlaylists.prefetchInfinite({
    limit: DEFAULT_PLAYLISTS_LIMIT,
  });

  return (
    <HydrateClient>
      <PlaylistView />
    </HydrateClient>
  );
};

export default PlaylistsPage;
