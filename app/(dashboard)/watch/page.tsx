import {
  DEFAULT_COMMENTS_LIMIT,
  DEFAULT_SUGGESTIONS_LIMIT,
} from "@/constants/dashboard";
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
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_COMMENTS_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_SUGGESTIONS_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
