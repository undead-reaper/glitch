import { db } from "@/services/drizzle";
import {
  reactionType,
  videoReactions,
} from "@/services/drizzle/schema/videoReactions";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

const reactionZod = z.enum(reactionType.enumValues);

export const videoReactionsRouter = createTRPCRouter({
  react: protectedProcedure
    .input(z.object({ videoId: z.string(), type: reactionZod }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId, type } = input;

      const [existingRecord] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, type)
          )
        );

      if (existingRecord) {
        const [deletedRecord] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          )
          .returning();

        return deletedRecord;
      }

      const [newRecord] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: type,
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: { type: type },
        })
        .returning();

      return newRecord;
    }),
});
