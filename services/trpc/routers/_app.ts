import { createTRPCRouter } from "@/services/trpc/init";
import { categoriesRouter } from "@/services/trpc/routers/categories";
import { commentReactionsRouter } from "@/services/trpc/routers/commentReactions";
import { commentsRouter } from "@/services/trpc/routers/comments";
import { studioRouter } from "@/services/trpc/routers/studio";
import { subscriptionsRouter } from "@/services/trpc/routers/subscriptions";
import { videoReactionsRouter } from "@/services/trpc/routers/videoReactions";
import { videosRouter } from "@/services/trpc/routers/videos";
import { videoViewsRouter } from "@/services/trpc/routers/videoViews";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  videos: videosRouter,
  studio: studioRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
});

export type AppRouter = typeof appRouter;
