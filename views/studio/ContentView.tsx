import VideoSection from "@/components/studio/VideoSection";

const StudioContentView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Channel Content</h1>
        <p className="text-xs text-muted-foreground">
          Manage your channel videos and playlists
        </p>
      </div>
      <VideoSection />
    </div>
  );
};

export default StudioContentView;
