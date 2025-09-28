import { db } from "@/services/drizzle";
import { videoViews } from "@/services/drizzle/schema/videoViews";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [existingRecord] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );

      if (existingRecord) return existingRecord;

      const [newRecord] = await db
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();

      return newRecord;
    }),
});
