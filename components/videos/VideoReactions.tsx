import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type Props = Readonly<{}>;

const VideoReactions = (props: Props) => {
  const videoReaction: "like" | "dislike" | null = null;

  return (
    <div className="flex items-center flex-none">
      <Button
        className="rounded-l-full rounded-r-none gap-2 pr-4 cursor-pointer"
        variant="secondary"
      >
        <ThumbsUp
          className={cn(
            "size-5",
            videoReaction === "like" && "fill-foreground"
          )}
        />
        <span>{1}</span>
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        className="rounded-l-none rounded-r-full pl-3 cursor-pointer"
        variant="secondary"
      >
        <ThumbsDown
          className={cn(
            "size-5",
            videoReaction === "dislike" && "fill-foreground"
          )}
        />
        <span>{0}</span>
      </Button>
    </div>
  );
};

export default VideoReactions;
