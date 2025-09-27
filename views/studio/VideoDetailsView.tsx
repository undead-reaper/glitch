import VideoDetailsFormSection from "@/components/studio/VideoDetailsFormSection";

type Props = Readonly<{
  videoId: string;
}>;

const VideoDetailsView = ({ videoId }: Props) => {
  return (
    <div className="pt-2.5 max-w-[150rem]">
      <VideoDetailsFormSection videoId={videoId} />
    </div>
  );
};

export default VideoDetailsView;
