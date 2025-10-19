import { db } from "@/services/drizzle";
import {
  playlists,
  playlistVisibility,
} from "@/services/drizzle/schema/playlists";
import { playlistVideos } from "@/services/drizzle/schema/playlistVideos";
import { users } from "@/services/drizzle/schema/users";
import { videoReactions } from "@/services/drizzle/schema/videoReactions";
import { videos } from "@/services/drizzle/schema/videos";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  lt,
  or,
  sql,
} from "drizzle-orm";
import z from "zod";

export const playlistsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        visibility: z.enum(playlistVisibility.enumValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, visibility } = input;
      const { id: userId } = ctx.user;

      const [createdPlaylist] = await db
        .insert(playlists)
        .values({
          userId,
          name,
          visibility,
        })
        .returning();

      if (!createdPlaylist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create playlist",
        });
      }

      return createdPlaylist;
    }),

  getUserPlaylists: protectedProcedure
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
          ...getTableColumns(playlists),
          user: users,
          thumbnailUrl: sql<
            string | null
          >`(SELECT v.thumbnail_url FROM ${playlistVideos} pv JOIN ${videos} v ON v.id = pv.video_id WHERE pv.playlist_id = ${playlists.id} ORDER BY pv.updated_at DESC LIMIT 1)`,
          videos: db.$count(
            playlistVideos,
            eq(playlists.id, playlistVideos.playlistId)
          ),
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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

  getPlaylistsForVideo: protectedProcedure
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
      const { id: userId } = ctx.user;

      const data = await db
        .select({
          ...getTableColumns(playlists),
          user: users,
          videos: db.$count(
            playlistVideos,
            eq(playlists.id, playlistVideos.playlistId)
          ),
          containsVideo: videoId
            ? sql<boolean>`EXISTS (
            SELECT 1 FROM ${playlistVideos} 
            WHERE ${playlistVideos.playlistId} = ${playlists.id} 
            AND ${playlistVideos.videoId} = ${videoId}
          )`
            : sql<boolean>`false`,
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(
          and(
            eq(playlists.userId, userId),
            cursor
              ? or(
                  lt(playlists.updatedAt, cursor.updatedAt),
                  and(
                    eq(playlists.updatedAt, cursor.updatedAt),
                    lt(playlists.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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

  manageVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.nanoid(),
        videoId: z.nanoid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { playlistId, videoId } = input;
      const { id: userId } = ctx.user;

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      const [existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        );

      const result = await (async () => {
        if (!existingPlaylistVideo) {
          const [inserted] = await db
            .insert(playlistVideos)
            .values({
              playlistId,
              videoId,
            })
            .returning();
          return inserted;
        } else {
          const [deleted] = await db
            .delete(playlistVideos)
            .where(
              and(
                eq(playlistVideos.playlistId, playlistId),
                eq(playlistVideos.videoId, videoId)
              )
            )
            .returning();
          return deleted;
        }
      })();

      return result;
    }),

  getPlaylistVideos: baseProcedure
    .input(
      z.object({
        playlistId: z.nanoid(),
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
      const { limit, cursor, playlistId } = input;
      const { clerkUserId } = ctx;

      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(eq(playlists.id, playlistId));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const hasAccess =
        existingPlaylist.visibility === "public" ||
        (existingPlaylist.visibility === "private" &&
          userId === existingPlaylist.userId);

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this playlist",
        });
      }

      const videosFromPlaylist = db.$with("playlist_videos").as(
        db
          .select({
            videoId: playlistVideos.videoId,
          })
          .from(playlistVideos)
          .where(eq(playlistVideos.playlistId, playlistId))
      );

      const data = await db
        .with(videosFromPlaylist)
        .select({
          ...getTableColumns(videos),
          user: users,
          views: db.$count(
            videoReactions,
            eq(videoReactions.videoId, videos.id)
          ),
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
        .innerJoin(
          videosFromPlaylist,
          eq(videos.id, videosFromPlaylist.videoId)
        )
        .where(
          and(
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

  getOne: baseProcedure
    .input(z.object({ playlistId: z.nanoid() }))
    .query(async ({ ctx, input }) => {
      const { playlistId } = input;
      const { clerkUserId } = ctx;

      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const [existingPlaylist] = await db
        .select({
          ...getTableColumns(playlists),
          user: users,
          thumbnailUrl: sql<
            string | null
          >`(SELECT v.thumbnail_url FROM ${playlistVideos} pv JOIN ${videos} v ON v.id = pv.video_id WHERE pv.playlist_id = ${playlists.id} ORDER BY pv.updated_at DESC LIMIT 1)`,
          videos: db.$count(
            playlistVideos,
            eq(playlists.id, playlistVideos.playlistId)
          ),
        })
        .from(playlists)
        .innerJoin(users, eq(playlists.userId, users.id))
        .where(eq(playlists.id, playlistId));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      const hasAccess =
        existingPlaylist.visibility === "public" ||
        (existingPlaylist.visibility === "private" &&
          userId === existingPlaylist.userId);

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this playlist",
        });
      }

      return existingPlaylist;
    }),

  delete: protectedProcedure
    .input(z.object({ playlistId: z.nanoid() }))
    .mutation(async ({ ctx, input }) => {
      const { playlistId } = input;
      const { id: userId } = ctx.user;

      const [deletedPlaylist] = await db
        .delete(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))
        .returning();

      if (!deletedPlaylist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete playlist",
        });
      }

      return deletedPlaylist;
    }),

  update: protectedProcedure
    .input(
      z.object({
        playlistId: z.nanoid(),
        name: z.string(),
        description: z.string().nullable(),
        visibility: z.enum(playlistVisibility.enumValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { playlistId, name, description, visibility } = input;
      const { id: userId } = ctx.user;

      const [updatedPlaylist] = await db
        .update(playlists)
        .set({
          name,
          description,
          visibility,
        })
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))
        .returning();

      if (!updatedPlaylist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update playlist",
        });
      }

      return updatedPlaylist;
    }),

  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.nanoid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            videoId: videoReactions.videoId,
            likedAt: videoReactions.updatedAt,
          })
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like")
            )
          )
      );

      const data = await db
        .with(viewerReactions)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt: viewerReactions.likedAt,
          views: db.$count(
            videoReactions,
            eq(videoReactions.videoId, videos.id)
          ),
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
        .innerJoin(viewerReactions, eq(videos.id, viewerReactions.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewerReactions.likedAt, cursor.likedAt),
                  and(
                    eq(viewerReactions.likedAt, cursor.likedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewerReactions.likedAt), desc(videos.id))
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
            likedAt: lastItem.likedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});