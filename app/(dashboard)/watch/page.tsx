import { HydrateClient, trpc } from "@/services/trpc/server";
import VideoView from "@/views/dashboard/VideoView";

type Props = Readonly<{
  searchParams: Promise<{
    v: string;
  }>;
}>;

const VideoPage = async ({ searchParams }: Props) => {
  const { v: videoId } = await searchParams;
  void trpc.videos.getOne.prefetch({ id: videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
