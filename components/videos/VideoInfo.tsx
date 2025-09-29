import { Skeleton } from "@/components/ui/skeleton";
import VideoDescription from "@/components/videos/VideoDescription";
import VideoMenu from "@/components/videos/VideoMenu";
import VideoOwnerInfo from "@/components/videos/VideoOwnerInfo";
import VideoReactions from "@/components/videos/VideoReactions";
import VideoShareButton from "@/components/videos/VideoShareButton";
import { VideoGetOneOutput } from "@/types/dashboard/VideoGetOneOutput";

type Props = {
  video: VideoGetOneOutput;
};

export const VideoInfoSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5 md:w-2/5 bg-muted" />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 w-[70%]">
          <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-muted" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-4/5 md:w-2/6 bg-muted" />
            <Skeleton className="h-5 w-3/5 md:w-1/5 bg-muted" />
          </div>
        </div>
        <Skeleton className="h-9 w-2/6 md:w-2/6 rounded-full bg-muted" />
      </div>
      <div className="h-[7.5rem] w-full" />
    </div>
  );
};

const VideoInfo = ({ video }: Props) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwnerInfo user={video.user} videoId={video.id} />
        <div className="flex overflow-x-auto min-w-[calc(50%-0.375rem)] md:min-w-min justify-start md:justify-end sm:overflow-visible sm:pb-0 sm:mb-0 mr-2 pb-2 -mb-2 gap-2">
          <VideoReactions
            videoId={video.id}
            likes={video.likes}
            dislikes={video.dislikes}
            viewerReaction={video.viewerReaction}
          />
          <VideoShareButton videoId={video.id} />
          <VideoMenu videoId={video.id} variant={"secondary"} />
        </div>
      </div>
      <VideoDescription
        description={video.description}
        views={video.views}
        date={video.createdAt}
      />
    </div>
  );
};

export default VideoInfo;
