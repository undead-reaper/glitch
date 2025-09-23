import { createTRPCRouter } from "@/services/trpc/init";
import { categoriesRouter } from "@/services/trpc/routers/categories";
import { studioRouter } from "@/services/trpc/routers/studio";
import { videosRouter } from "@/services/trpc/routers/videos";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  videos: videosRouter,
  studio: studioRouter,
});

export type AppRouter = typeof appRouter;
