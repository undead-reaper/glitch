import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import PlaylistVideosView from "@/views/dashboard/PlaylistVideosView";
import { redirect } from "next/navigation";

;

type Props = Readonly<{
  searchParams: Promise<{
    list: string;
  }>;
}>;

const PlaylistPage = async ({ searchParams }: Props) => {
  const { list: playlistId } = await searchParams;
  trpc.playlists.getOne.prefetch({ playlistId });
  trpc.playlists.getPlaylistVideos.prefetchInfinite({
    limit: DEFAULT_VIDEOS_LIMIT,
    playlistId,
  });

  if (!playlistId) {
    redirect("/");
  }

  return (
    <HydrateClient>
      <PlaylistVideosView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default PlaylistPage;
