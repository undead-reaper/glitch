"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import StudioUploader from "@/components/studio/StudioUploader";
import { Button } from "@/components/ui/button";
import { trpc } from "@/services/trpc/client";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

const StudioUploadButton = () => {
  const utils = trpc.useUtils();
  const upload = trpc.videos.upload.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
    },
  });

  const onClick = () => {
    upload.mutate();
  };

  return (
    <>
      <ResponsiveModal
        title="Upload Video"
        open={!!upload.data?.url}
        onOpenChange={() => upload.reset()}
      >
        {upload.data?.url ? (
          <StudioUploader
            endpoint={upload.data?.url}
            onSuccess={() => {
              utils.studio.getMany.invalidate();
              upload.reset();
              toast.success("Video Uploaded Successfully", {
                description: "You can find it in your content library.",
              });
            }}
          />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        className="cursor-pointer"
        onClick={onClick}
        disabled={upload.isPending}
      >
        {upload.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
        Create
      </Button>
    </>
  );
};

export default StudioUploadButton;
