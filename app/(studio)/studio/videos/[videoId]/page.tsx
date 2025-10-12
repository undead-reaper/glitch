import { HydrateClient, trpc } from "@/services/trpc/server";
import VideoDetailsView from "@/views/studio/VideoDetailsView";

;

type Props = {
  params: Promise<{ videoId: string }>;
};

const VideoDetails = async ({ params }: Props) => {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoDetailsView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoDetails;
