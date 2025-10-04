import { createdAt, updatedAt } from "@/services/drizzle/schema/common";
import { playlists } from "@/services/drizzle/schema/playlists";
import { videos } from "@/services/drizzle/schema/videos";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const playlistVideos = pgTable(
  "playlist_videos",
  {
    playlistId: text("playlist_id")
      .references(() => playlists.id, { onDelete: "cascade" })
      .notNull(),
    videoId: text("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [
    primaryKey({
      name: "playlist_videos_pk",
      columns: [t.playlistId, t.videoId],
    }),
  ]
).enableRLS();

export const playlistVideoRelations = relations(playlistVideos, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistVideos.playlistId],
    references: [playlists.id],
  }),
  video: one(videos, {
    fields: [playlistVideos.videoId],
    references: [videos.id],
  }),
}));
