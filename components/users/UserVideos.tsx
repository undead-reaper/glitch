"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/videos/VideoGridCard";
import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  userId?: string;
}>;

const UserVideos = ({ userId }: Props) => {
  return (
    <Suspense fallback={<UserVideosSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <UserVideosSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserVideosSkeleton = () => {
  return (
    <div>
      <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const UserVideosSuspense = ({ userId }: Props) => {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    {
      userId,
      limit: DEFAULT_VIDEOS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
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

export default UserVideos;
