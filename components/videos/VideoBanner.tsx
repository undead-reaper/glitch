import { VideoGetOneOutput } from "@/types/dashboard";
import { AlertTriangle } from "lucide-react";

type Props = {
  status: VideoGetOneOutput["muxStatus"];
};

const VideoBanner = ({ status }: Props) => {
  if (status === "ready") return null;

  return (
    <div className="py-3 bg-yellow-500 px-4 rounded-b-xl flex items-center gap-2">
      <AlertTriangle className="size-4 text-black shrink-0" />
      <span className="text-xs md:text-sm font-medium text-black line-clamp-1">
        The Video is still processing.
      </span>
    </div>
  );
};

export default VideoBanner;
