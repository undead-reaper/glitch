import { db } from "@/services/drizzle";
import { subscriptions } from "@/services/drizzle/schema/subscriptions";
import { users } from "@/services/drizzle/schema/users";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
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

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            creatorId: z.nanoid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(subscriptions),
          user: {
            ...getTableColumns(users),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, users.id)
            ),
          },
        })
        .from(subscriptions)
        .innerJoin(users, eq(subscriptions.creatorId, users.id))
        .where(
          and(
            eq(subscriptions.viewerId, userId),
            cursor
              ? or(
                  lt(subscriptions.updatedAt, cursor.updatedAt),
                  and(
                    eq(subscriptions.updatedAt, cursor.updatedAt),
                    lt(subscriptions.creatorId, cursor.creatorId)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creatorId))
        // Fetch one extra item to determine if there's a next page
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // Remove the last item if there are more items to indicate the presence of a next page
      const items = hasMore ? data.slice(0, -1) : data;
      // Get the last item to create the next cursor
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            creatorId: lastItem.creatorId,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
