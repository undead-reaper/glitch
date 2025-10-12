import UserAvatar from "@/components/UserAvatar";
import SubscribeButton from "@/components/subscriptions/SubscribeButton";
import { Skeleton } from "@/components/ui/skeleton";

type Props = Readonly<{
  name: string;
  imageUrl: string;
  subscriberCount: number;
  onUnsubscribe: () => void;
  disabled?: boolean;
}>;

export const SubscriptionItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="size-10 rounded-full bg-muted" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="mt-1 h-3 w-20 bg-muted" />
          </div>
          <Skeleton className="h-8 w-20 bg-muted" />
        </div>
      </div>
    </div>
  );
};

const SubscriptionItem = ({
  imageUrl,
  name,
  subscriberCount,
  onUnsubscribe,
  disabled = false,
}: Props) => {
  return (
    <div className="flex items-start gap-4">
      <UserAvatar size="lg" imageUrl={imageUrl} name={name} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {subscriberCount.toLocaleString()} subscribers
            </p>
          </div>
          <SubscribeButton
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onUnsubscribe();
            }}
            disabled={disabled}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItem;
