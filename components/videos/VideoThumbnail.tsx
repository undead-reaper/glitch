import { Skeleton } from "@/components/ui/skeleton";
import { THUMBNAIL_PLACEHOLDER } from "@/constants/globals";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

type VideoThumbnailProps = Readonly<{
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}>;

export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full bg-muted" />
    </div>
  );
};

const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl || THUMBNAIL_PLACEHOLDER}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0 duration-300 transition-opacity"
        />
        <Image
          src={previewUrl || THUMBNAIL_PLACEHOLDER}
          alt={title}
          unoptimized
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100 duration-300 transition-opacity"
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default VideoThumbnail;
