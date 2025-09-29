import { db } from "@/services/drizzle";
import { commentReactions } from "@/services/drizzle/schema/commentReactions";
import { reactionType } from "@/services/drizzle/schema/videoReactions";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { and, eq } from "drizzle-orm";
import z from "zod";

const reactionZod = z.enum(reactionType.enumValues);

export const commentReactionsRouter = createTRPCRouter({
  react: protectedProcedure
    .input(z.object({ commentId: z.string(), type: reactionZod }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { commentId, type } = input;

      const [existingRecord] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, type)
          )
        );

      if (existingRecord) {
        const [deletedRecord] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedRecord;
      }

      const [newRecord] = await db
        .insert(commentReactions)
        .values({
          userId,
          commentId,
          type: type,
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: { type: type },
        })
        .returning();

      return newRecord;
    }),
});
