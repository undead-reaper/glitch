import InfiniteScroll from "@/components/InfiniteScroll";
import ResponsiveModal from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { DEFAULT_PLAYLISTS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Loader2, Square, SquareCheck } from "lucide-react";
import { toast } from "sonner";

type Props = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}>;

const PlaylistAddModal = ({ open, onOpenChange, videoId }: Props) => {
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getPlaylistsForVideo.useInfiniteQuery(
    {
      limit: DEFAULT_PLAYLISTS_LIMIT,
      videoId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    }
  );

  const utils = trpc.useUtils();

  const manageMutation = trpc.playlists.manageVideo.useMutation({
    onSuccess: (_, variables) => {
      const playlist = playlists?.pages
        .flatMap((page) => page.items)
        .find((p) => p.id === variables.playlistId);

      const manageState = playlist?.containsVideo
        ? "Video Removed from Playlist"
        : "Video Added to Playlist";

      toast.success("Playlist updated", {
        description: manageState,
      });
      utils.playlists.getUserPlaylists.invalidate();
      utils.playlists.getPlaylistsForVideo.invalidate({ videoId });
    },
    onError: (error) => {
      toast.error("Failed to update playlist", {
        description: error.message,
      });
    },
  });

  return (
    <ResponsiveModal
      title="Add to Playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                variant="ghost"
                className="w-full justify-start px-2 space-x-2"
                size="lg"
                key={playlist.id}
                disabled={manageMutation.isPending}
                onClick={() =>
                  manageMutation.mutate({
                    playlistId: playlist.id,
                    videoId,
                  })
                }
              >
                {playlist.containsVideo ? <SquareCheck /> : <Square />}
                <span>{playlist.name}</span>
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual
          />
        )}
      </div>
    </ResponsiveModal>
  );
};

export default PlaylistAddModal;
