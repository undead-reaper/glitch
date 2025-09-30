import HistoryFeed from "@/components/dashboard/HistoryFeed";

const HistoryView = () => {
  return (
    <div className="max-w-3xl mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
      <div className="select-none">
        <h1 className="text-2xl font-bold">Watch History</h1>
        <p className="text-xs text-muted-foreground">
          The videos you've watched recently
        </p>
      </div>
      <HistoryFeed />
    </div>
  );
};

export default HistoryView;
