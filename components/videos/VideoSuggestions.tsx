"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import { VideoCard } from "@/components/videos/VideoCard";
import VideoGridCard from "@/components/videos/VideoGridCard";
import { DEFAULT_SUGGESTIONS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";

type Props = Readonly<{
  videoId: string;
  isManual?: boolean;
}>;

const VideoSuggestions = ({ videoId, isManual }: Props) => {
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
