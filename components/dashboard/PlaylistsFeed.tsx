"use client";

import { MinimalErrorFallback } from "@/components/ErrorFallback";
import InfiniteScroll from "@/components/InfiniteScroll";
import PlaylistGridCard, {
  PlaylistGridCardSkeleton,
} from "@/components/playlists/PlaylistGridCard";
import { DEFAULT_PLAYLISTS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const PlaylistsFeed = () => {
  return (
    <Suspense fallback={<PlaylistsFeedSkeleton />}>
      <ErrorBoundary FallbackComponent={MinimalErrorFallback}>
        <PlaylistsFeedSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistsFeedSkeleton = () => {
  return (
    <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6 animate-pulse">
      {Array.from({ length: DEFAULT_PLAYLISTS_LIMIT }).map((_, index) => (
        <PlaylistGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const PlaylistsFeedSuspense = () => {
  const [playlists, query] =
    trpc.playlists.getUserPlaylists.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_PLAYLISTS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <>
      <div className="gap-4 gap-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
        {playlists.pages
          .flatMap((page) => page.items)
          .map((playlist) => (
            <PlaylistGridCard key={playlist.id} data={playlist} />
          ))}
      </div>
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </>
  );
};

export default PlaylistsFeed;
