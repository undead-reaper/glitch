"use client";

import PlaylistDetailsCard from "@/components/playlists/PlaylistDetailsCard";
import PlaylistVideoFeed from "@/components/playlists/PlaylistVideoFeed";

type Props = Readonly<{
  playlistId: string;
}>;

const PlaylistVideosView = ({ playlistId }: Props) => {
  return (
    <div className="max-w-[150rem] mx-auto mb-10 pt-2.5 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="col-span-1 h-min xl:h-full">
        <PlaylistDetailsCard playlistId={playlistId} />
      </div>
      <div className="col-span-1 xl:col-span-2">
        <PlaylistVideoFeed playlistId={playlistId} />
      </div>
    </div>
  );
};

export default PlaylistVideosView;
