import CommentForm from "@/components/comments/CommentForm";
import CommentReplies from "@/components/comments/CommentReplies";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { CommentsGetManyOutput } from "@/types/comments/CommentsGetManyOutput";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Props = Readonly<{
  comment: CommentsGetManyOutput["items"][number];
  variant?: "reply" | "default";
}>;

const CommentItem = ({ comment, variant = "default" }: Props) => {
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

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

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
        <Link prefetch href={`/users/${comment.userId}` as Route}>
          <UserAvatar
            size={variant === "reply" ? "sm" : "lg"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link prefetch href={`/users/${comment.userId}` as Route}>
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
              {variant === "default" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 cursor-pointer hover:bg-muted! hover:text-foreground/70"
                  onClick={() => setIsReplyOpen(true)}
                >
                  Reply
                </Button>
              )}
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
      {isReplyOpen && variant === "default" && (
        <div className="mt-4 pl-14">
          <CommentForm
            variant="reply"
            parentId={comment.id}
            onCancel={() => setIsReplyOpen(false)}
            videoId={comment.videoId}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === "default" && (
        <div className="pl-14 mt-2">
          <Button
            onClick={() => setIsRepliesOpen((current) => !current)}
            size="sm"
            variant="ghost"
            className="rounded-full text-primary cursor-pointer hover:bg-primary/10! hover:text-primary"
          >
            {isRepliesOpen ? (
              <ChevronUp className="size-4 mr-2" />
            ) : (
              <ChevronDown className="size-4 mr-2" />
            )}
            <span>{comment.replyCount} replies</span>
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && variant === "default" && isRepliesOpen && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};

export default CommentItem;
