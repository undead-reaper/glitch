import { createTRPCRouter } from "@/services/trpc/init";
import { categoriesRouter } from "@/services/trpc/routers/categories";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
