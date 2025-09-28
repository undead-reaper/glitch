import VideoDescription from "@/components/videos/VideoDescription";
import VideoMenu from "@/components/videos/VideoMenu";
import VideoOwnerInfo from "@/components/videos/VideoOwnerInfo";
import VideoReactions from "@/components/videos/VideoReactions";
import VideoShareButton from "@/components/videos/VideoShareButton";
import { VideoGetOneOutput } from "@/types/dashboard/VideoGetOneOutput";

type Props = {
  video: VideoGetOneOutput;
};

const VideoInfo = ({ video }: Props) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwnerInfo user={video.user} videoId={video.id} />
        <div className="flex overflow-x-auto min-w-[calc(50%-0.375rem)] md:min-w-min justify-start md:justify-end sm:overflow-visible sm:pb-0 sm:mb-0 mr-2 pb-2 -mb-2 gap-2">
          <VideoReactions />
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
