import LikedFeed from "@/components/dashboard/LikedFeed";

const LikedView = () => {
  return (
    <div className="max-w-3xl mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="select-none">
        <h1 className="text-2xl font-bold">Liked Videos</h1>
        <p className="text-xs text-muted-foreground">
          The videos you've liked recently
        </p>
      </div>
      <LikedFeed />
    </div>
  );
};

export default LikedView;
