import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect } from "react";

type Props = Readonly<{
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}>;

const InfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isManual = false,
}: Props) => {
  const { isIntersecting, targetRef } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isManual,
  ]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      <div ref={targetRef} className="h-1" />
      {hasNextPage ? (
        <Button
          variant="secondary"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ArrowRight />
          )}
          <span>{isFetchingNextPage ? "Loading More" : "Load More"}</span>
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          You have reached the end of the list.
        </p>
      )}
    </div>
  );
};

export default InfiniteScroll;
