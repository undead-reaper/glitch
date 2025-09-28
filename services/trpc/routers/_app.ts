import { createTRPCRouter } from "@/services/trpc/init";
import { categoriesRouter } from "@/services/trpc/routers/categories";
import { studioRouter } from "@/services/trpc/routers/studio";
import { videoReactionsRouter } from "@/services/trpc/routers/videoReactions";
import { videosRouter } from "@/services/trpc/routers/videos";
import { videoViewsRouter } from "@/services/trpc/routers/videoViews";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  videos: videosRouter,
  studio: studioRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
});

export type AppRouter = typeof appRouter;
