"use client";

import PlaylistAddModal from "@/components/playlists/PlaylistAddModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientEnv } from "@/env/env.client";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { Bookmark, Clock, MoreVertical, Share, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = Readonly<{
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
  responsive?: boolean;
  additionalOptions?: boolean;
}>;

const VideoMenu = ({
  videoId,
  variant = "ghost",
  onRemove,
  responsive = true,
  additionalOptions = false,
}: Props) => {
  const clerk = useClerk();

  const handleShare = () => {
    const fullUrl = `${clientEnv.NEXT_PUBLIC_BASE_URL}/watch?v=${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Video link copied to clipboard", { description: fullUrl });
  };

  const handleSaveToPlaylist = () => {
    if (clerk.isSignedIn) {
      setOpenSaveToPlaylistModal(true);
    } else {
      clerk.openSignIn();
    }
  };

  const [openSaveToPlaylistModal, setOpenSaveToPlaylistModal] = useState(false);

  return (
    <>
      <PlaylistAddModal
        open={openSaveToPlaylistModal}
        onOpenChange={setOpenSaveToPlaylistModal}
        videoId={videoId}
      />
      <div className={cn("block", responsive ? "block md:hidden" : "hidden")}>
        <Button className="rounded-full cursor-pointer" variant="secondary">
          <Bookmark />
          <span>Save</span>
        </Button>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn(responsive ? "hidden md:flex" : "flex")}
          asChild
        >
          <Button
            variant={variant}
            size="icon"
            className="rounded-full cursor-pointer"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={() => handleSaveToPlaylist()}
            className="cursor-pointer"
          >
            <Bookmark className="mr-2 size-4" />
            <span>Save to playlist</span>
          </DropdownMenuItem>
          {additionalOptions && (
            <>
              <DropdownMenuItem className="cursor-pointer">
                <Clock className="mr-2 size-4" />
                <span>Save to Watch Later</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShare}
                className="cursor-pointer"
              >
                <Share className="mr-2 size-4" />
                <span>Share</span>
              </DropdownMenuItem>
            </>
          )}
          {onRemove && (
            <DropdownMenuItem onClick={onRemove} className="cursor-pointer">
              <Trash2 className="mr-2 size-4" />
              <span>Remove</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default VideoMenu;