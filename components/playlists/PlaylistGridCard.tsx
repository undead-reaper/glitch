import PlaylistInfo, {
  PlaylistInfoSkeleton,
} from "@/components/playlists/PlaylistInfo";
import PlaylistThumbnail, {
  PlaylistThumbnailSkeleton,
} from "@/components/playlists/PlaylistThumbnail";
import { THUMBNAIL_PLACEHOLDER } from "@/constants/globals";
import { PlaylistGetUserPlaylistsOutput } from "@/types/dashboard";
import { Route } from "next";
import Link from "next/link";

type Props = {
  data: PlaylistGetUserPlaylistsOutput["items"][number];
};

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};

const PlaylistGridCard = ({ data }: Props) => {
  return (
    <Link prefetch href={`/playlist?list=${data.id}` as Route}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          imageUrl={data.thumbnailUrl || THUMBNAIL_PLACEHOLDER}
          name={data.name}
          videos={data.videos}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};

export default PlaylistGridCard;
