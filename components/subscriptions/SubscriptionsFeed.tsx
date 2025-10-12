"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import SubscriptionItem, {
  SubscriptionItemSkeleton,
} from "@/components/subscriptions/SubscriptionItem";
import { trpc } from "@/services/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

const SubscriptionsFeed = () => {
  return (
    <Suspense fallback={<SubscriptionsFeedSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <SubscriptionsFeedSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscriptionsFeedSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 gap-y-6 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
};

const SubscriptionsFeedSuspense = () => {
  const utils = trpc.useUtils();
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const unsubscribe = trpc.subscriptions.delete.useMutation({
    onSuccess: (data) => {
      toast.success("Subscription Removed", {
        description: "You have unsubscribed successfully.",
      });
      utils.videos.getManySubscribed.invalidate();
      utils.subscriptions.getMany.invalidate();
      utils.users.getOne.invalidate({ userId: data.creatorId });
    },
    onError: (error) => {
      toast.error("Could not Remove Subscription", {
        description: error.message,
      });
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-6">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              prefetch
              key={subscription.creatorId}
              href={`/users/${subscription.user.id}`}
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribe={() => {
                  unsubscribe.mutate({ creatorId: subscription.creatorId });
                }}
                disabled={unsubscribe.isPending}
              />
            </Link>
          ))}
      </div>
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};

export default SubscriptionsFeed;
