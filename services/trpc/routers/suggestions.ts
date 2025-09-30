import { db } from "@/services/drizzle";
import { users } from "@/services/drizzle/schema/users";
import { videoReactions } from "@/services/drizzle/schema/videoReactions";
import { videos } from "@/services/drizzle/schema/videos";
import { videoViews } from "@/services/drizzle/schema/videoViews";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import z from "zod";

export const suggestionsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.nanoid(),
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
      const { limit, cursor, videoId } = input;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId))
        .limit(1);

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Video with ID ${videoId} not found`,
        });
      }

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          views: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likes: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikes: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            existingVideo.categoryId
              ? eq(videos.categoryId, existingVideo.categoryId)
              : undefined,
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
