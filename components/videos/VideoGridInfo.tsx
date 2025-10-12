import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import { UserInfo } from "@/components/users/UserInfo";
import VideoMenu from "@/components/videos/VideoMenu";
import { VideoGetManyOutput } from "@/types/dashboard";
import { formatDistanceToNowStrict } from "date-fns";
import { Route } from "next";
import Link from "next/link";
import { useMemo } from "react";

type Props = Readonly<{
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}>;

export const VideoGridInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-10 mb-1.5 flex-shrink-0 rounded-full bg-muted" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%] bg-muted" />
        <Skeleton className="h-5 w-[70%] bg-muted" />
      </div>
    </div>
  );
};

const VideoGridInfo = ({ data, onRemove }: Props) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(
      data.views
    );
  }, [data.views]);

  const compactDate = useMemo(() => {
    return formatDistanceToNowStrict(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link prefetch href={`/users/${data.user.id}` as Route}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link prefetch href={`/watch?v=${data.id}`}>
          <h3 className="font-medium mb-1.5 leading-tight line-clamp-2 text-base break-words">
            {data.title}
          </h3>
        </Link>
        <Link prefetch href={`/users/${data.user.id}` as Route}>
          <UserInfo
            size="sm"
            name={data.user.name}
            className="text-muted-foreground"
          />
        </Link>
        <Link prefetch href={`/watch?v=${data.id}`}>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu
          videoId={data.id}
          onRemove={onRemove}
          responsive={false}
          additionalOptions
        />
      </div>
    </div>
  );
};

export default VideoGridInfo;
