import { db } from "@/services/drizzle";
import { subscriptions } from "@/services/drizzle/schema/subscriptions";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ creatorId: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (userId === input.creatorId) {
        throw new TRPCError({
          message: "You cannot subscribe to yourself",
          code: "BAD_REQUEST",
        });
      }

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          viewerId: userId,
          creatorId: input.creatorId,
        })
        .returning();
      return subscription;
    }),

  delete: protectedProcedure
    .input(z.object({ creatorId: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (userId === input.creatorId) {
        throw new TRPCError({
          message: "You cannot subscribe to yourself",
          code: "BAD_REQUEST",
        });
      }

      const [subscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, userId),
            eq(subscriptions.creatorId, input.creatorId)
          )
        )
        .returning();
      return subscription;
    }),
});
