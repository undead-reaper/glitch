import TrendingFeed from "@/components/dashboard/TrendingFeed";

const TrendingView = () => {
  return (
    <div className="max-w-[150rem] mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="select-none">
        <h1 className="text-2xl font-bold">Trending</h1>
        <p className="text-xs text-muted-foreground">
          Check out the latest trending videos
        </p>
      </div>
      <TrendingFeed />
    </div>
  );
};

export default TrendingView;
