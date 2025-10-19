import { HydrateClient, trpc } from "@/services/trpc/server";
import SubscriptionsView from "@/views/dashboard/SubscriptionsView";

// Force dynamic rendering since this page requires authentication
export const dynamic = "force-dynamic";

const SubscriptionsPage = async () => {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: 5,
  });

  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default SubscriptionsPage;
