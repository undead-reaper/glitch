import { db } from "@/services/drizzle";
import { videos } from "@/services/drizzle/schema/videos";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";

export const videosRouter = createTRPCRouter({
  upload: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
      })
      .returning();
    return {
      video: video,
    };
  }),
});
