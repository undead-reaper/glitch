import { TvMinimalPlay } from "lucide-react";

const SubscriptionsUnauthorizedView = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-3">
      <TvMinimalPlay className="size-28" />
      <h1 className="font-medium text-2xl">Don't miss new videos</h1>
      <p className="text-center">
        Sign in to see updates from your favourite creators
      </p>
    </div>
  );
};

export default SubscriptionsUnauthorizedView;
