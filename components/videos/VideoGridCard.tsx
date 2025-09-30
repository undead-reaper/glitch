import VideoGridInfo from "@/components/videos/VideoGridInfo";
import VideoThumbnail from "@/components/videos/VideoThumbnail";
import { VideoGetManyOutput } from "@/types/dashboard";
import Link from "next/link";

type Props = Readonly<{
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}>;

const VideoGridCard = ({ data, onRemove }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/watch?v=${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <VideoGridInfo data={data} onRemove={onRemove} />
    </div>
  );
};

export default VideoGridCard;
