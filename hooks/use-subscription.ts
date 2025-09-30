import { trpc } from "@/services/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Subscription Added", {
        description: "You have subscribed successfully.",
      });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
        utils.videos.getManySubscribed.invalidate();
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error("Could not Add Subscription", {
          description: error.message,
        });
      }
    },
  });

  const unsubscribe = trpc.subscriptions.delete.useMutation({
    onSuccess: () => {
      toast.success("Subscription Removed", {
        description: "You have unsubscribed successfully.",
      });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
        utils.videos.getManySubscribed.invalidate();
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error("Could not Remove Subscription", {
          description: error.message,
        });
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ creatorId: userId });
    } else {
      subscribe.mutate({ creatorId: userId });
    }
  };

  return { onClick, isPending };
};
