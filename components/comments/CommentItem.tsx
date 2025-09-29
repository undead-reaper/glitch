import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { CommentsGetManyOutput } from "@/types/comments/CommentsGetManyOutput";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNowStrict } from "date-fns";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { toast } from "sonner";

type Props = Readonly<{
  comment: CommentsGetManyOutput["items"][number];
}>;

const CommentItem = ({ comment }: Props) => {
  const utils = trpc.useUtils();
  const clerk = useClerk();

  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.success("Comment Deleted Successfully", {
        description: "Your comment has been deleted.",
      });
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error("Failed to delete comment", {
          description: error.message,
        });
      }
    },
  });
  const { userId } = useAuth();
  const isOwner = userId === comment.user.clerkId;
  const react = trpc.commentReactions.react.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error("Failed to React to Comment", {
          description: error.message,
        });
      }
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}` as Route}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}` as Route}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Button
                  className="size-7 hover:bg-muted! hover:rounded-full hover:text-foreground/70 cursor-pointer"
                  size="icon"
                  variant="ghost"
                  disabled={react.isPending}
                  onClick={() =>
                    react.mutate({ commentId: comment.id, type: "like" })
                  }
                >
                  <ThumbsUp
                    className={cn(
                      comment.viewerReaction === "like" && "fill-foreground"
                    )}
                  />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {comment.likes}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  className="size-7 hover:bg-muted! hover:rounded-full hover:text-foreground/70 cursor-pointer"
                  size="icon"
                  variant="ghost"
                  disabled={react.isPending}
                  onClick={() =>
                    react.mutate({ commentId: comment.id, type: "dislike" })
                  }
                >
                  <ThumbsDown
                    className={cn(
                      comment.viewerReaction === "dislike" && "fill-foreground"
                    )}
                  />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {comment.dislikes}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isOwner && (
          <Button
            onClick={() => deleteComment.mutate({ commentId: comment.id })}
            variant="ghost"
            className="size-8 cursor-pointer"
            disabled={deleteComment.isPending}
            size="icon"
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
