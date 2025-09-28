import { createTRPCRouter } from "@/services/trpc/init";
import { categoriesRouter } from "@/services/trpc/routers/categories";
import { studioRouter } from "@/services/trpc/routers/studio";
import { videosRouter } from "@/services/trpc/routers/videos";
import { videoViewsRouter } from "@/services/trpc/routers/videoViews";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  videos: videosRouter,
  studio: studioRouter,
  videoViews: videoViewsRouter,
});

export type AppRouter = typeof appRouter;
