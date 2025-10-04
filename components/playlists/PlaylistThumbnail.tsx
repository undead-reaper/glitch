import { Skeleton } from "@/components/ui/skeleton";
import { THUMBNAIL_PLACEHOLDER } from "@/constants/globals";
import { cn } from "@/lib/utils";
import { ListVideo, Play } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

type Props = Readonly<{
  imageUrl: string;
  name: string;
  videos: number;
  className?: string;
}>;

export const PlaylistThumbnailSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full bg-muted" />
    </div>
  );
};

const PlaylistThumbnail = ({ imageUrl, name, videos, className }: Props) => {
  const compactVideos = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(videos);
  }, [videos]);

  return (
    <div className={cn("relative pt-3 group", className)}>
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-foreground/20 aspect-video" />
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-foreground/25 aspect-video" />
        <div className="relative overflow-hidden w-full rounded-xl aspect-video">
          <Image
            src={imageUrl || THUMBNAIL_PLACEHOLDER}
            alt={name}
            fill
            className="w-full h-full object-cover bg-muted"
          />
          <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-x-2 text-background">
              <Play className="size-4 fill-background" />
              <span className="font-medium">Play All</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-foreground/80 text-background text-xs font-medium flex items-center gap-x-1">
        <ListVideo className="size-4" />
        {compactVideos} videos
      </div>
    </div>
  );
};

export default PlaylistThumbnail;
