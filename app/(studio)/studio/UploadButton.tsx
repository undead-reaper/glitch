"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/services/trpc/client";
import { Loader2, Plus } from "lucide-react";

const StudioUploadButton = () => {
  const utils = trpc.useUtils();
  const upload = trpc.videos.upload.useMutation({
    onSuccess: () => utils.studio.getMany.invalidate(),
  });

  const onClick = () => {
    upload.mutate();
  };

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      onClick={onClick}
      disabled={upload.isPending}
    >
      {upload.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
      Create
    </Button>
  );
};

export default StudioUploadButton;
