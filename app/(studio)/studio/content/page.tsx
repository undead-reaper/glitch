import { STUDIO_DEFAULT_VIDEO_LIMIT } from "@/constants/studio";
import { HydrateClient, trpc } from "@/services/trpc/server";
import StudioContentView from "@/views/studio/ContentView";

export const dynamic = "force-dynamic";

const StudioContent = () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: STUDIO_DEFAULT_VIDEO_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioContentView />
    </HydrateClient>
  );
};

export default StudioContent;
