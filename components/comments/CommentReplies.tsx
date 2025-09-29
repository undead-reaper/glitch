import CommentItem from "@/components/comments/CommentItem";
import { Button } from "@/components/ui/button";
import { DEFAULT_COMMENTS_LIMIT } from "@/constants/dashboard";
import { trpc } from "@/services/trpc/client";
import { CornerDownRight, Loader2 } from "lucide-react";

type Props = Readonly<{
  parentId: string;
  videoId: string;
}>;

const CommentReplies = ({ parentId, videoId }: Props) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_COMMENTS_LIMIT,
        videoId,
        parentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {data?.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} variant="reply" />
          ))}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {hasNextPage && (
        <Button
          className="rounded-full text-primary cursor-pointer hover:bg-primary/10! hover:text-primary mt-2"
          onClick={() => fetchNextPage()}
          variant="ghost"
          size="sm"
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CornerDownRight className="size-4 mr-2" />
          )}
          <span>Show More Replies</span>
        </Button>
      )}
    </div>
  );
};

export default CommentReplies;
