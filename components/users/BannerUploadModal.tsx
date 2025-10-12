"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import { trpc } from "@/services/trpc/client";
import { UploadDropzone } from "@/services/uploadthing";
import { toast } from "sonner";

type Props = Readonly<{
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

const BannerUploadModal = ({ open, onOpenChange, userId }: Props) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    onOpenChange(false);
    utils.users.getOne.invalidate({ userId });
    toast.success("Banner Uploaded Successfully", {
      description: "Your banner has been set successfully.",
    });
  };

  return (
    <ResponsiveModal
      title="Upload a Banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export default BannerUploadModal;
