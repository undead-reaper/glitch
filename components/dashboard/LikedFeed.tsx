"use client";

import { MinimalErrorFallback } from "@/components/ErrorFallback";
import InfiniteScroll from "@/components/InfiniteScroll";
import { VideoCard, VideoCardSkeleton } from "@/components/videos/VideoCard";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/videos/VideoGridCard";
import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const LikedFeed = () => {
  return (
    <Suspense fallback={<LikedFeedSkeleton />}>
      <ErrorBoundary FallbackComponent={MinimalErrorFallback}>
        <LikedFeedSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LikedFeedSkeleton = () => {
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

const LikedFeedSuspense = () => {
  const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_VIDEOS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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
            <VideoCard key={video.id} data={video} />
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

export default LikedFeed;
