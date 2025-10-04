"use client";

import PlaylistsFeed from "@/components/dashboard/PlaylistsFeed";
import PlaylistCreateModal from "@/components/playlists/PlaylistCreateModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const PlaylistsView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="max-w-[150rem] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="flex justify-between items-center">
        <div className="select-none">
          <h1 className="text-2xl font-bold">Your Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Manage your playlists here
          </p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full cursor-pointer"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus />
        </Button>
      </div>
      <PlaylistsFeed />
    </div>
  );
};

export default PlaylistsView;
