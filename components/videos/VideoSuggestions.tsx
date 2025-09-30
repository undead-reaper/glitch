"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { VideoCard, VideoCardSkeleton } from "@/components/videos/VideoCard";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/videos/VideoGridCard";
import { DEFAULT_SUGGESTIONS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  videoId: string;
  isManual?: boolean;
}>;

const VideoSuggestions = ({ videoId, isManual = false }: Props) => {
  return (
    <Suspense fallback={<VideoSuggestionsSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading suggestions</div>}>
        <VideoSuggestionsSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSuggestionsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="hidden md:block space-y-3">
        {Array.from({ length: DEFAULT_SUGGESTIONS_LIMIT }).map((_, index) => (
          <VideoCardSkeleton key={index} size="compact" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {Array.from({ length: DEFAULT_SUGGESTIONS_LIMIT }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const VideoSuggestionsSuspense = ({ videoId, isManual }: Props) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_SUGGESTIONS_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) =>
          page.items.map((suggestion) => (
            <VideoCard key={suggestion.id} data={suggestion} size="compact" />
          ))
        )}
      </div>
      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) =>
          page.items.map((suggestion) => (
            <VideoGridCard key={suggestion.id} data={suggestion} />
          ))
        )}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isManual={isManual}
      />
    </>
  );
};

export default VideoSuggestions;
