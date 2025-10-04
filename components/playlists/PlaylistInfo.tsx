import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/utils";
import { PlaylistGetUserPlaylistsOutput } from "@/types/dashboard";

type Props = Readonly<{
  data: PlaylistGetUserPlaylistsOutput["items"][number];
}>;

export const PlaylistInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%] bg-muted" />
        <Skeleton className="h-5 w-[70%] bg-muted" />
        <Skeleton className="h-5 w-[50%] bg-muted" />
      </div>
    </div>
  );
};

const PlaylistInfo = ({ data }: Props) => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium line-clamp-2 text-sm break-words">
          {data.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {capitalize(data.visibility)} • Playlist
        </p>
        <p className="text-sm text-muted-foreground font-semibold hover:text-primary">
          View full playlist
        </p>
      </div>
    </div>
  );
};

export default PlaylistInfo;
