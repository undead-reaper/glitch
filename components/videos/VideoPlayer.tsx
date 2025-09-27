import { THUMBNAIL_PLACEHOLDER } from "@/constants/globals";
import MuxPlayer from "@mux/mux-player-react";

type Props = Readonly<{
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}>;

const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: Props) => {
  if (!playbackId) return null;

  return (
    <MuxPlayer
      playbackId={playbackId}
      poster={thumbnailUrl || THUMBNAIL_PLACEHOLDER}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#00ffcc"
      onPlay={onPlay}
    />
  );
};

export default VideoPlayer;
