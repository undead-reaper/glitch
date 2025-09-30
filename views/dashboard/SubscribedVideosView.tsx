import SubscribedVideosFeed from "@/components/dashboard/SubscribedVideosFeed";

const SubscribedVideosView = () => {
  return (
    <div className="max-w-[150rem] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="select-none">
        <h1 className="text-2xl font-bold">Latest</h1>
        <p className="text-xs text-muted-foreground">
          Videos from your favorite creators
        </p>
      </div>
      <SubscribedVideosFeed />
    </div>
  );
};

export default SubscribedVideosView;
