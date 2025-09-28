"use client";

import VideoBanner from "@/components/videos/VideoBanner";
import VideoInfo from "@/components/videos/VideoInfo";
import VideoPlayer from "@/components/videos/VideoPlayer";
import { cn } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = Readonly<{
  videoId: string;
}>;

const VideoViewer = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<div>Loading video...</div>}>
      <ErrorBoundary fallback={<div>Error loading video</div>}>
        <VideoViewerSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoViewerSuspense = ({ videoId }: Props) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const utils = trpc.useUtils();
  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });
  const { isSignedIn } = useAuth();

  const handlePlay = () => {
    if (isSignedIn) {
      createView.mutate({ videoId });
    }
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoInfo video={video} />
    </>
  );
};

export default VideoViewer;
