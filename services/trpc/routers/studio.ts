import { db } from "@/services/drizzle";
import { videos } from "@/services/drizzle/schema/videos";
import { videoViews } from "@/services/drizzle/schema/videoViews";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import z from "zod";

export const studioRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.nanoid() }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id: videoId } = input;

      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Video with ID ${videoId} not found`,
        });
      }

      return video;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.nanoid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(videos),
          views: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
        })
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        // Fetch one extra item to determine if there's a next page
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // Remove the last item if there are more items to indicate the presence of a next page
      const items = hasMore ? data.slice(0, -1) : data;
      // Get the last item to create the next cursor
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
