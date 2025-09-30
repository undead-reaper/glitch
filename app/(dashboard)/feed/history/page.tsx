import { DEFAULT_VIDEOS_LIMIT } from "@/constants/dashboard";
import { HydrateClient, trpc } from "@/services/trpc/server";
import HistoryView from "@/views/dashboard/HistoryView";
import { auth } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

export const dynamic = "force-dynamic";

const HistoryPage = async () => {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    unauthorized();
  }

  void trpc.history.getMany.prefetchInfinite({
    limit: DEFAULT_VIDEOS_LIMIT,
  });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default HistoryPage;
