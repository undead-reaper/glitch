import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { trpc } from "@/services/trpc/client";
import { CommentsGetManyOutput } from "@/types/comments/CommentsGetManyOutput";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNowStrict } from "date-fns";
import { Trash2 } from "lucide-react";
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
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.content}</p>
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
