import SubscribeButton from "@/components/subscriptions/SubscribeButton";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { UserInfo } from "@/components/users/UserInfo";
import { useSubscription } from "@/hooks/use-subscription";
import { VideoGetOneOutput } from "@/types/dashboard/VideoGetOneOutput";
import { useAuth } from "@clerk/nextjs";
import { Route } from "next";
import Link from "next/link";

type Props = Readonly<{
  user: VideoGetOneOutput["user"];
  videoId: string;
}>;

const VideoOwnerInfo = ({ user, videoId }: Props) => {
  const { userId: clerkUserId, isLoaded } = useAuth();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return (
    <div className="flex md:items-center items-start md:justify-start justify-between gap-3 space-x-3">
      <Link href={`/users/${user.id}` as Route}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col min-w-0">
            <UserInfo name={user.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscribers} Subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId === user.clerkId ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link href={`/studio/videos/${videoId}` as Route}>Edit Video</Link>
        </Button>
      ) : (
        <SubscribeButton
          onClick={onClick}
          isSubscribed={user.viewerSubscribed}
          disabled={isPending || !isLoaded}
          className="flex-none cursor-pointer"
        />
      )}
    </div>
  );
};

export default VideoOwnerInfo;
