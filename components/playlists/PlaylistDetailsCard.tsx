import EditPlaylistModal from "@/components/playlists/EditPlaylistModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/UserAvatar";
import { UserInfo } from "@/components/users/UserInfo";
import { THUMBNAIL_PLACEHOLDER } from "@/constants/globals";
import { clientEnv } from "@/env/env.client";
import { capitalize } from "@/lib/utils";
import { trpc } from "@/services/trpc/client";
import { formatDistanceToNowStrict } from "date-fns";
import { Edit2, Share, Trash } from "lucide-react";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

type Props = Readonly<{
  playlistId: string;
}>;

const PlaylistDetailsCard = ({ playlistId }: Props) => {
  return (
    <Suspense fallback={<PlaylistDetailsCardSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading playlist details</div>}>
        <PlaylistDetailsCardSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistDetailsCardSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col lg:flex-row xl:flex-col gap-x-6">
          <div className="w-full lg:w-1/2 xl:w-full aspect-video bg-background rounded-xl mb-4">
            <Skeleton className="w-full h-full rounded-xl bg-background" />
          </div>

          <div className="flex flex-col gap-2 justify-start lg:justify-center xl:justify-start select-none">
            <Skeleton className="h-4 w-3/4 mb-2 bg-background" />

            <div className="flex items-center gap-2">
              <Skeleton className="size-9 rounded-full bg-background" />
              <Skeleton className="h-4 w-32 bg-background" />
            </div>

            <Skeleton className="h-4 w-full max-w-md bg-background" />

            <div className="mt-3 flex flex-row gap-2">
              <Skeleton className="h-10 w-32 rounded-full bg-background" />
              <Skeleton className="h-10 w-10 rounded-full bg-background" />
              <Skeleton className="h-10 w-10 rounded-full bg-background" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PlaylistDetailsCardSuspense = ({ playlistId }: Props) => {
  const [editPlaylist, setEditPlaylist] = useState(false);
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
    playlistId,
  });
  const updatedAt = formatDistanceToNowStrict(playlist.updatedAt, {
    addSuffix: true,
  });

  const utils = trpc.useUtils();
  const router = useRouter();

  const handleShare = () => {
    const url = `${clientEnv.NEXT_PUBLIC_BASE_URL}/playlist?list=${playlist.id}`;
    if (playlist.visibility === "public") {
      navigator.clipboard.writeText(url);
      toast.success("Playlist link copied to clipboard", { description: url });
    }
  };

  const handleDelete = trpc.playlists.delete.useMutation({
    onSuccess: () => {
      toast.success("Operation Successful", {
        description: "Playlist deleted successfully",
      });
      utils.playlists.getUserPlaylists.invalidate();
      router.replace("/feed/playlists");
    },
    onError: (error) => {
      toast.error("Could not delete playlist", {
        description: error.message,
      });
    },
  });

  return (
    <>
      <EditPlaylistModal
        open={editPlaylist}
        onOpenChange={setEditPlaylist}
        playlistId={playlist.id}
      />
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row xl:flex-col gap-x-6">
            <div className="w-full lg:w-1/2 xl:w-full aspect-video bg-background rounded-xl mb-4">
              <Image
                src={playlist.thumbnailUrl || THUMBNAIL_PLACEHOLDER}
                alt={playlist.name}
                width={640}
                height={360}
                className="object-cover rounded-xl bg-background"
              />
            </div>
            <div className="flex flex-col gap-2 justify-start lg:justify-center xl:justify-start select-none">
              <h1 className="font-bold text-2xl lg:text-3xl xl:text-2xl line-clamp-2">
                {playlist.name}
              </h1>
              <div className="flex items-center gap-2">
                <UserAvatar
                  imageUrl={playlist.user.imageUrl}
                  name={playlist.user.name}
                  size="sm"
                />
                <Link prefetch href={`/users/${playlist.user.id}` as Route}>
                  <UserInfo name={playlist.user.name} />
                </Link>
              </div>
              <span className="text-xs text-muted-foreground">
                {`Playlist • ${capitalize(playlist.visibility)} • ${
                  playlist.videos
                } videos • Updated ${updatedAt}`}
              </span>
              <p className="text-xs line-clamp-2">
                {playlist.description || "No description available"}
              </p>
              <div className="mt-3 flex flex-row gap-2">
                <Button
                  className="w-min rounded-full cursor-pointer hover:text-foreground"
                  variant="outline"
                  onClick={() => setEditPlaylist(true)}
                >
                  <Edit2 className="size-4 mr-2" />
                  <span>Edit Playlist</span>
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="rounded-full cursor-pointer hover:text-foreground"
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                    >
                      <Share />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="rounded-full cursor-pointer hover:text-foreground"
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete.mutate({ playlistId })}
                    >
                      <Trash />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PlaylistDetailsCard;
