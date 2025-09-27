import { db } from "@/services/drizzle";
import { videos, videoUpdateSchema } from "@/services/drizzle/schema/videos";
import { mux } from "@/services/mux";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videosRouter = createTRPCRouter({
  upload: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        max_resolution_tier: "1080p",
        playback_policies: ["public"],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*",
    });
    return {
      url: upload.url,
    };
  }),

  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required for update.",
        });
      }
      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
      if (!updatedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Video not found or you do not have permission to update it.",
        });
      }
      return updatedVideo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const [deletedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
      await mux.video.assets.delete(deletedVideo.muxAssetId!);
      if (!deletedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Video not found or you do not have permission to delete it.",
        });
      }
      return deletedVideo;
    }),
});
