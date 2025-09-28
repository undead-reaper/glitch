import { Button } from "@/components/ui/button";
import { clientEnv } from "@/env/env.client";
import { Share } from "lucide-react";
import { toast } from "sonner";

type Props = Readonly<{
  videoId: string;
}>;

const VideoShareButton = ({ videoId }: Props) => {
  const onShare = () => {
    const fullUrl = `${clientEnv.NEXT_PUBLIC_BASE_URL}/watch?v=${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Video link copied to clipboard", { description: fullUrl });
  };

  return (
    <Button
      variant="secondary"
      className="rounded-full cursor-pointer"
      onClick={onShare}
    >
      <Share className="size-4" />
      <span>Share</span>
    </Button>
  );
};

export default VideoShareButton;
