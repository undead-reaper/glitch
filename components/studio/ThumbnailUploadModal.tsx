"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import { trpc } from "@/services/trpc/client";
import { UploadDropzone } from "@/services/uploadthing";
import { toast } from "sonner";

type Props = Readonly<{
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

const ThumbnailUploadModal = ({ open, onOpenChange, videoId }: Props) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    onOpenChange(false);
    utils.studio.getOne.invalidate({ id: videoId });
    utils.studio.getMany.invalidate();
    toast.success("Image Uploaded Successfully", {
      description: "Your thumbnail has been changed successfully.",
    });
  };

  return (
    <ResponsiveModal
      title="Upload Thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export default ThumbnailUploadModal;
