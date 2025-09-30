import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/UserAvatar";
import { UserInfo } from "@/components/users/UserInfo";
import VideoMenu from "@/components/videos/VideoMenu";
import VideoThumbnail, {
  VideoThumbnailSkeleton,
} from "@/components/videos/VideoThumbnail";
import { cn } from "@/lib/utils";
import { VideoGetManyOutput } from "@/types/dashboard";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useMemo } from "react";

const videoCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[10.5rem]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoCardProps extends VariantProps<typeof videoCardVariants> {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoCardSkeleton = ({
  size = "default",
}: VariantProps<typeof videoCardVariants>) => {
  return (
    <div className={videoCardVariants({ size })}>
      <div className={thumbnailVariants({ size })}>
        <VideoThumbnailSkeleton />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <div className="flex-1 min-w-0">
            <Skeleton
              className={cn(
                "h-5 w-[40%] bg-muted",
                size === "compact" && "h-4 w-[40%]"
              )}
            />
            {size === "default" && (
              <>
                <Skeleton className="h-4 w-[20%] bg-muted mt-2" />
                <div className="flex items-center gap-2 my-3">
                  <Skeleton className="size-8 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-24 bg-muted" />
                </div>
              </>
            )}
            {size === "compact" && (
              <Skeleton className="h-4 w-[50%] bg-muted mt-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoCard = ({
  data,
  onRemove,
  size = "default",
}: VideoCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(
      data.views
    );
  }, [data.views]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(
      data.likes
    );
  }, [data.likes]);

  return (
    <div className={videoCardVariants({ size })}>
      <Link
        href={`/watch?v=${data.id}`}
        className={thumbnailVariants({ size })}
      >
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <Link href={`/watch?v=${data.id}`} className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium line-clamp-2",
                size === "compact" ? "text-sm" : "text-base"
              )}
            >
              {data.title}
            </h3>
            {size === "default" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
            {size === "default" && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <UserAvatar
                    imageUrl={data.user.imageUrl}
                    size="sm"
                    name={data.user.name}
                  />
                  <UserInfo size="sm" name={data.user.name} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground w-fit line-clamp-2">
                      {data.description || "No description available."}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p>From the video Description</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {size === "compact" && (
              <UserInfo
                size="sm"
                name={data.user.name}
                className="text-muted-foreground mt-1"
              />
            )}
            {size === "compact" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu
              videoId={data.id}
              onRemove={onRemove}
              responsive={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
