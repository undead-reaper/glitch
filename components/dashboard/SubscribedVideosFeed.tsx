"use client";

import { MinimalErrorFallback } from "@/components/ErrorFallback";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/videos/VideoGridCard";
import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const SubscribedVideosFeed = () => {
  return (
    <Suspense fallback={<SubscribedVideosFeedSkeleton />}>
      <ErrorBoundary FallbackComponent={MinimalErrorFallback}>
        <SubscribedVideosFeedSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscribedVideosFeedSkeleton = () => {
  return (
    <div>
      <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const SubscribedVideosFeedSuspense = () => {
  const [videos, query] =
    trpc.videos.getManySubscribed.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_VIDEOS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <div>
      <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
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

export default SubscribedVideosFeed;
