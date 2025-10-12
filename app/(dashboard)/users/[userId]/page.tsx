import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import UserView from "@/views/dashboard/UserView";

type Props = Readonly<{
  params: Promise<{
    userId: string;
  }>;
}>;

const UserPage = async ({ params }: Props) => {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ userId });
  void trpc.videos.getMany.prefetchInfinite({
    userId,
    limit: DEFAULT_VIDEOS_LIMIT,
  });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default UserPage;
