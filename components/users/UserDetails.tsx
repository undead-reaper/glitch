import SubscribeButton from "@/components/subscriptions/SubscribeButton";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "@/types/dashboard";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";

type Props = Readonly<{
  user: UserGetOneOutput;
}>;

export const UserDetailsSkeleton = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="size-[3.75rem] rounded-full bg-muted" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 bg-muted" />
            <Skeleton className="h-4 w-48 bg-muted" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-full" />
      </div>

      <div className="hidden md:flex items-start gap-5">
        <Skeleton className="size-[10rem] rounded-full bg-muted" />
        <div className="flex-1">
          <Skeleton className="h-8 w-64 bg-muted" />
          <Skeleton className="h-5 w-48 bg-muted mt-1" />
          <Skeleton className="h-10 w-32 rounded-full mt-3 bg-muted" />
        </div>
      </div>
    </div>
  );
};

const UserDetails = ({ user }: Props) => {
  const clerk = useClerk();
  const { userId, isLoaded } = useAuth();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  const handleAvatarClick = () => {
    if (user.clerkId === userId) {
      clerk.openUserProfile();
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="size-[3.75rem]"
            onClick={handleAvatarClick}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold overflow-clip line-clamp-2">
              {user.name}
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{user.subscriberCount} subscribers</span>
              <span>•</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>
        {userId === user.clerkId ? (
          <Link
            prefetch
            href="/studio"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full mt-3 rounded-full"
            )}
          >
            Open Studio
          </Link>
        ) : (
          <SubscribeButton
            disabled={isPending || !isLoaded}
            onClick={onClick}
            isSubscribed={user.viewerSubscribed}
            className="w-full mt-3"
          />
        )}
      </div>

      <div className="hidden md:flex items-start gap-5">
        <UserAvatar
          size="xl"
          imageUrl={user.imageUrl}
          name={user.name}
          className={cn(
            userId === user.clerkId &&
              "cursor-pointer hover:opacity-80 transition-opacity duration-300"
          )}
          onClick={handleAvatarClick}
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold overflow-clip line-clamp-2">
            {user.name}
          </h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{user.subscriberCount} subscribers</span>
            <span>•</span>
            <span>{user.videoCount} videos</span>
          </div>
          {userId === user.clerkId ? (
            <Link
              prefetch
              href="/studio"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "mt-3 rounded-full"
              )}
            >
              Open Studio
            </Link>
          ) : (
            <SubscribeButton
              disabled={isPending || !isLoaded}
              onClick={onClick}
              isSubscribed={user.viewerSubscribed}
              className="mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
