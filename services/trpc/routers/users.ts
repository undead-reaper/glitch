import { db } from "@/services/drizzle";
import { subscriptions } from "@/services/drizzle/schema/subscriptions";
import { users } from "@/services/drizzle/schema/users";
import { videos } from "@/services/drizzle/schema/videos";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import z from "zod";

export const usersRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ userId: z.nanoid() }))
    .query(async ({ ctx, input }) => {
      const { clerkUserId } = ctx;

      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db
          .select()
          .from(subscriptions)
          .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
      );

      const [existingUser] = await db
        .with(viewerSubscriptions)
        .select({
          ...getTableColumns(users),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
            Boolean
          ),
          videoCount: db.$count(videos, eq(videos.userId, users.id)),
          subscriberCount: db.$count(
            subscriptions,
            eq(subscriptions.creatorId, users.id)
          ),
        })
        .from(users)
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, users.id)
        )
        .where(eq(users.id, input.userId));

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return existingUser;
    }),
});
