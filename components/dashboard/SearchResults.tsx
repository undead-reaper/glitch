"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { VideoCard, VideoCardSkeleton } from "@/components/videos/VideoCard";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/videos/VideoGridCard";
import { DEFAULT_SEARCH_LIMIT } from "@/constants/dashboard";
import { cn } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  searchQuery: string | undefined;
}>;

const SearchResults = ({ searchQuery }: Props) => {
  return (
    <Suspense key={searchQuery} fallback={<SearchResultsSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading search results</div>}>
        <SearchResultsSuspense searchQuery={searchQuery} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SearchResultsSkeleton = () => {
  return (
    <div>
      <div className="hidden flex-col gap-4 md:flex animate-pulse">
        {Array.from({ length: DEFAULT_SEARCH_LIMIT }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4 gap-y-6 md:hidden animate-pulse">
        {Array.from({ length: DEFAULT_SEARCH_LIMIT }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const SearchResultsSuspense = ({ searchQuery }: Props) => {
  const [videos, query] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query: searchQuery,
      limit: DEFAULT_SEARCH_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div className={cn("flex flex-col gap-4 gap-y-6")}>
      {videos.pages
        .flatMap((page) => page.items)
        .map((video) => (
          <div key={video.id}>
            <div className="hidden flex-col gap-4 md:flex">
              <VideoCard data={video} />
            </div>
            <div className="flex flex-col md:hidden">
              <VideoGridCard data={video} />
            </div>
          </div>
        ))}
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};

export default SearchResults;
