import { clientEnv } from "@/env/env.client";
import { db } from "@/services/drizzle";
import { subscriptions } from "@/services/drizzle/schema/subscriptions";
import { users } from "@/services/drizzle/schema/users";
import { videoReactions } from "@/services/drizzle/schema/videoReactions";
import { videos, videoUpdateSchema } from "@/services/drizzle/schema/videos";
import { videoViews } from "@/services/drizzle/schema/videoViews";
import { mux } from "@/services/mux";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/services/trpc/init";
import { qstash } from "@/services/upstash/qstash";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, isNotNull } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
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
      if (deletedVideo.thumbnailKey || deletedVideo.previewKey) {
        await new UTApi().deleteFiles([
          deletedVideo.thumbnailKey!,
          deletedVideo.previewKey!,
        ]);
      }
      if (!deletedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Video not found or you do not have permission to delete it.",
        });
      }
      return deletedVideo;
    }),

  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found or you do not have permission to edit it.",
        });
      } else if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video does not have a valid playback ID.",
        });
      }

      const utApi = new UTApi();
      if (existingVideo.thumbnailKey) {
        await utApi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.webp?fit_mode=smartcrop`;

      const uploadedThumbnail = await utApi.uploadFilesFromUrl(
        tempThumbnailUrl
      );

      if (!uploadedThumbnail.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload thumbnail",
        });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } =
        uploadedThumbnail.data;

      return await db
        .update(videos)
        .set({
          thumbnailUrl,
          thumbnailKey,
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
    }),

  generateTitle: protectedProcedure
    .input(z.object({ id: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await qstash.trigger({
        url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/api/workflows/title`,
        body: { userId, videoId: input.id },
      });
      return { workflowRunId };
    }),

  generateDescription: protectedProcedure
    .input(z.object({ id: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await qstash.trigger({
        url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/api/workflows/description`,
        body: { userId, videoId: input.id },
      });
      return { workflowRunId };
    }),

  getOne: baseProcedure
    .input(z.object({ id: z.nanoid() }))
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;

      let userId: string | undefined;

      if (clerkUserId) {
        const [user] = await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(eq(users.clerkId, clerkUserId));

        if (user) {
          userId = user.id;
        }
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        userId
          ? db
              .select({
                videoId: videoReactions.videoId,
                type: videoReactions.type,
              })
              .from(videoReactions)
              .where(eq(videoReactions.userId, userId))
          : db
              .select({
                videoId: videoReactions.videoId,
                type: videoReactions.type,
              })
              .from(videoReactions)
              .where(eq(videoReactions.userId, "")) // This will never match
      );

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        userId
          ? db
              .select()
              .from(subscriptions)
              .where(eq(subscriptions.viewerId, userId))
          : db
              .select()
              .from(subscriptions)
              .where(eq(subscriptions.viewerId, "")) // This will never match
      );

      const [existingVideo] = await db
        .with(viewerReactions, viewerSubscriptions)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
            subscribers: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, users.id)
            ),
            viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
              Boolean
            ),
          },
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
          viewerReaction: viewerReactions.type,
        })
        .from(videos)
        .where(eq(videos.id, input.id))
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, users.id)
        );

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found.",
        });
      }

      return existingVideo;
    }),

  revalidate: protectedProcedure
    .input(z.object({ id: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found or you do not have permission to edit it.",
        });
      } else if (!existingVideo.muxUploadId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video does not have a valid upload ID.",
        });
      }

      const directUpload = await mux.video.uploads.retrieve(
        existingVideo.muxUploadId
      );

      if (!directUpload || !directUpload.asset_id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve upload information from Mux.",
        });
      }

      const asset = await mux.video.assets.retrieve(directUpload.asset_id);

      if (!asset) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve asset information from Mux.",
        });
      }

      const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;

      const [updatedVideo] = await db
        .update(videos)
        .set({
          muxStatus: asset.status,
          muxPlaybackId: asset.playback_ids?.[0]?.id,
          muxAssetId: asset.id,
          duration,
          muxTrackId: asset.tracks?.[1]?.id,
          muxTrackStatus: asset.tracks?.[1].status,
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),
});
