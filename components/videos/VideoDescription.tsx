import { cn } from "@/lib/utils";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

type Props = Readonly<{
  description: string | null;
  views: number;
  date: Date;
}>;

const VideoDescription = ({ description, views, date }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(views);
  }, [views]);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "standard",
    }).format(views);
  }, [views]);

  const compactDate = formatDistanceToNowStrict(date, { addSuffix: true });

  const expandedDate = format(date, "MMM d, yyyy");

  return (
    <div className="bg-muted/50 rounded-xl p-3">
      <div className="flex gap-3 text-sm mb-2">
        <span className="font-medium">
          {isExpanded ? expandedViews : compactViews} views
        </span>
        <span className="font-medium">
          {isExpanded ? expandedDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-2"
          )}
        >
          {description || "No description available."}
        </p>
        <div
          onClick={() => setIsExpanded((current) => !current)}
          className="flex items-center gap-1 mt-4 text-sm font-medium cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span className="underline">Show less</span>
              <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              <span className="underline">Show more</span>
              <ChevronDown className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDescription;
