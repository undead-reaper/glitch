"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { VideoGetOneOutput } from "@/types/dashboard";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

type Props = Readonly<{
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}>;

const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: Props) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const react = trpc.videoReactions.react.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error("Could not register your reaction", {
          description: error.message,
        });
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        className="rounded-l-full rounded-r-none gap-2 pr-4 cursor-pointer"
        variant="secondary"
        onClick={() => react.mutate({ videoId, type: "like" })}
        disabled={react.isPending}
      >
        <ThumbsUp
          className={cn(
            "size-5",
            viewerReaction === "like" && "fill-foreground"
          )}
        />
        <span>{likes}</span>
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        className="rounded-l-none rounded-r-full pl-3 cursor-pointer"
        variant="secondary"
        disabled={react.isPending}
        onClick={() => react.mutate({ videoId, type: "dislike" })}
      >
        <ThumbsDown
          className={cn(
            "size-5",
            viewerReaction === "dislike" && "fill-foreground"
          )}
        />
        <span>{dislikes}</span>
      </Button>
    </div>
  );
};

export default VideoReactions;
