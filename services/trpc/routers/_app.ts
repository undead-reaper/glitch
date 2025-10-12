import { createTRPCRouter } from "@/services/trpc/init";
import { categoriesRouter } from "@/services/trpc/routers/categories";
import { commentReactionsRouter } from "@/services/trpc/routers/commentReactions";
import { commentsRouter } from "@/services/trpc/routers/comments";
import { historyRouter } from "@/services/trpc/routers/history";
import { playlistsRouter } from "@/services/trpc/routers/playlists";
import { searchRouter } from "@/services/trpc/routers/search";
import { studioRouter } from "@/services/trpc/routers/studio";
import { subscriptionsRouter } from "@/services/trpc/routers/subscriptions";
import { suggestionsRouter } from "@/services/trpc/routers/suggestions";
import { usersRouter } from "@/services/trpc/routers/users";
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
  suggestions: suggestionsRouter,
  search: searchRouter,
  history: historyRouter,
  playlists: playlistsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
