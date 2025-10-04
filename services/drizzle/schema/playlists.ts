import { createdAt, nano, updatedAt } from "@/services/drizzle/schema/common";
import { playlistVideos } from "@/services/drizzle/schema/playlistVideos";
import { users } from "@/services/drizzle/schema/users";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const playlistVisibility = pgEnum("playlist_visibility", [
  "private",
  "public",
  "unlisted",
]);

export const playlists = pgTable("playlists", {
  id: nano,
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  visibility: playlistVisibility("visibility").notNull().default("private"),
  createdAt,
  updatedAt,
}).enableRLS();

export const playlistRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  videos: many(playlistVideos),
}));

export const playlistInsertSchema = createInsertSchema(playlists);
export const playlistUpdateschema = createUpdateSchema(playlists);
export const playlistSelectSchema = createSelectSchema(playlists);
