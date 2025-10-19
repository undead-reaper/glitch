"use client";

import CommentForm from "@/components/comments/CommentForm";
import CommentItem from "@/components/comments/CommentItem";
import { MinimalErrorFallback } from "@/components/ErrorFallback";
import InfiniteScroll from "@/components/InfiniteScroll";
import { DEFAULT_COMMENTS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  videoId: string;
}>;

export const VideoComments = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<VideoCommentsSkeleton />}>
      <ErrorBoundary FallbackComponent={MinimalErrorFallback}>
        <VideoCommentsSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoCommentsSkeleton = () => {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2 className="text-muted-foreground size-7 animate-spin" />
    </div>
  );
};

const VideoCommentsSuspense = ({ videoId }: Props) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_COMMENTS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const count = comments.pages[0].count;

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold">
          {count} <span>Comments</span>
        </h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4">
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
