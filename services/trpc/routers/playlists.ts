import { db } from "@/services/drizzle";
import {
  playlists,
  playlistVisibility,
} from "@/services/drizzle/schema/playlists";
import { playlistVideos } from "@/services/drizzle/schema/playlistVideos";
import { users } from "@/services/drizzle/schema/users";
import { videos } from "@/services/drizzle/schema/videos";
import { createTRPCRouter, protectedProcedure } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
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

      const result = async () => {
        if (!existingPlaylistVideo) {
          await db
            .insert(playlistVideos)
            .values({
              playlistId,
              videoId,
            })
            .returning();
        } else {
          await db
            .delete(playlistVideos)
            .where(
              and(
                eq(playlistVideos.playlistId, playlistId),
                eq(playlistVideos.videoId, videoId)
              )
            )
            .returning();
        }
      };

      return await result();
    }),
});
