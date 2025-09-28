"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bookmark, MoreVertical, Trash2 } from "lucide-react";

type Props = Readonly<{
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}>;

const VideoMenu = ({ videoId, variant, onRemove }: Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <Button className="rounded-full cursor-pointer" variant="secondary">
          <Bookmark />
          <span>Save</span>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className="rounded-full cursor-pointer"
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem className="cursor-pointer">
          <Bookmark className="mr-2 size-4" />
          <span>Save</span>
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem className="cursor-pointer">
            <Trash2 className="mr-2 size-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoMenu;
