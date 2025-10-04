"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { VideoCard, VideoCardSkeleton } from "@/components/videos/VideoCard";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/videos/VideoGridCard";
import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

type Props = Readonly<{
  playlistId: string;
}>;

const PlaylistVideoFeed = ({ playlistId }: Props) => {
  return (
    <Suspense fallback={<PlaylistVideoFeedSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <PlaylistVideoFeedSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistVideoFeedSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-6 md:hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 gap-y-6 md:flex">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const PlaylistVideoFeedSuspense = ({ playlistId }: Props) => {
  const utils = trpc.useUtils();

  const [videos, query] =
    trpc.playlists.getPlaylistVideos.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_VIDEOS_LIMIT,
        playlistId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const removeVideo = trpc.playlists.manageVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist", {
        description:
          "The video has been successfully removed from the playlist.",
      });
      utils.playlists.getUserPlaylists.invalidate();
      utils.playlists.getPlaylistVideos.invalidate({ playlistId });
      utils.playlists.getOne.invalidate({ playlistId });
      utils.playlists.getPlaylistsForVideo.invalidate({
        videoId: data.videoId,
      });
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-6 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};

export default PlaylistVideoFeed;
