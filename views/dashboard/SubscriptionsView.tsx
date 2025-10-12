import SubscriptionsFeed from "@/components/subscriptions/SubscriptionsFeed";

const SubscriptionsView = () => {
  return (
    <div className="max-w-3xl mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="select-none">
        <h1 className="text-2xl font-bold">All Subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          View and manage all your subscriptions
        </p>
      </div>
      <SubscriptionsFeed />
    </div>
  );
};

export default SubscriptionsView;
