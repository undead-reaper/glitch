import VideoViewer from "@/components/dashboard/VideoViewer";
import VideoComments from "@/components/videos/VideoComments";
import VideoSuggestions from "@/components/videos/VideoSuggestions";

type Props = Readonly<{
  videoId: string;
}>;

const VideoView = ({ videoId }: Props) => {
  return (
    <div className="flex flex-col max-w-[150rem] mx-auto pt-2.5 mb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoViewer videoId={videoId} />
          <div className="xl:hidden block mt-4">
            <VideoSuggestions />
          </div>
          <VideoComments />
        </div>
        <div className="hidden xl:block w-full xl:w-[23.75rem] 2xl:w[28.75rem] shrink-1">
          <VideoSuggestions />
        </div>
      </div>
    </div>
  );
};

export default VideoView;
